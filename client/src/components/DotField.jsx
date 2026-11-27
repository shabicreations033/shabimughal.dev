import { useEffect, useRef } from 'react';

// Page background: a faint dot grid that reacts to the pointer. The dots around the pointer glow and
// grow, and five of them are joined to it by thin lines. Every reaction is eased per dot (quick to
// light up, slow to fade), so dots and lines blend in and out smoothly as the pointer moves instead
// of switching on and off.
//
// The grid itself is plain CSS (`.dotfield`, free to render and already visible in the pre-rendered
// HTML). The canvas on top only paints the dots that are lit or still fading, and stops its loop when
// nothing is left. Colours are the theme's accent (#000033 light, #586BFF dark). Nothing is drawn for
// visitors who prefer reduced motion (the grid stays). The header has its own background, so the
// grid does not show behind the navbar.
//
// Water ripple: moving the pointer pushes the dots around it outward. The push travels outward at a
// fixed speed (WAVE_SPEED), so it arrives later at far dots, and every dot is held by a damped spring,
// so it overshoots and settles with a few small wobbles. A still pointer pushes nothing, so the dots
// rest. Dots are drawn at their displaced position; a background-coloured disc hides the CSS dot that
// stays at home underneath.
//
// Tuning: WAVE_*, SPRING_*, LINKS, LINK_MAX, HALO, ATTACK_MS (how fast a dot lights up), RELEASE_MS (how slowly it fades).

const LINKS = 5; // how many of the nearest dots are joined to the pointer
const LINK_MAX = 2.2; // a line never reaches farther than this, in dot gaps
const HALO = 3.6; // how far the glow around the pointer reaches, in dot gaps
const FOLLOW_MS = 110; // how closely the effect trails the pointer (lower = tighter)
const ATTACK_MS = 80;
const RELEASE_MS = 420;
const LINE_RELEASE_MS = 130; // lines let go faster than the glow, so no long trails are left behind
const WAVE_R = 4.4; // how far a push reaches, in dot gaps
const WAVE_SPEED = 620; // how fast the ripple travels outward, px per second
const WAVE_PUSH = 1500; // strength of the push at full pointer speed (px/s^2)
const SPEED_FULL = 900; // pointer speed (px/s) that counts as "full speed"
const SPRING_K = 105; // stiffness: higher = snaps back faster
const SPRING_C = 8; // damping: lower = more wobble (about 40% of critical)
const MAX_OFFSET = 0.42; // largest displacement, as a share of the dot gap
const HISTORY_MS = 720; // how long a push is remembered while it travels outward

export default function DotField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    let w = 0;
    let h = 0;
    let gap = 26;
    let accent = '#586bff';
    let ink = '#1d1d1b';
    let bg = '#ffffff';
    let raf = 0;
    let running = false;
    // `x`/`y` trail the pointer with a light ease (tx/ty is where it really is)
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false, last: 0 };

    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      accent = cs.getPropertyValue('--accent').trim() || accent;
      ink = cs.getPropertyValue('--ink').trim() || ink;
      bg = cs.getPropertyValue('--bg').trim() || bg;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = parseFloat(getComputedStyle(canvas.parentElement).getPropertyValue('--dot-gap'));
      if (g > 0) gap = g;
    };

    // Per-dot state, keyed by grid cell: v = glow (0..1), l = line strength (0..1),
    // ox/oy = displacement from home, vx/vy = its velocity
    const dots = new Map();
    const history = []; // recent pointer positions with how hard the pointer was moving: { t, x, y, s, w }
    let strength = 0; // smoothed pointer speed, 0..1
    let clock = 0; // seconds since the loop started (drives the history)
    const ease = (cur, target, dt, release = RELEASE_MS) =>
      cur + (target - cur) * (1 - Math.exp(-dt / (target > cur ? ATTACK_MS : release)));

    const draw = (now) => {
      const dt = Math.min(64, now - (pointer.last || now));
      pointer.last = now;
      const dts = Math.max(0.001, dt / 1000);
      clock += dts;
      const k = 1 - Math.exp(-dt / FOLLOW_MS);
      const px = pointer.x;
      const py = pointer.y;
      pointer.x += (pointer.tx - pointer.x) * k;
      pointer.y += (pointer.ty - pointer.y) * k;
      const cx = pointer.x;
      const cy = pointer.y;
      const span = gap * HALO;
      const R = gap * WAVE_R;

      // Pointer speed -> push strength (smoothed so it swells and fades instead of flickering)
      const speed = pointer.active ? Math.hypot(cx - px, cy - py) / dts : 0;
      const sTarget = Math.pow(Math.min(1, speed / SPEED_FULL), 0.8);
      strength += (sTarget - strength) * (1 - Math.exp(-dt / (sTarget > strength ? 60 : 160)));
      if (pointer.active || strength > 0.01) history.push({ t: clock, x: cx, y: cy, s: strength, w: dts / 0.25 });
      while (history.length && clock - history[0].t > HISTORY_MS / 1000) history.shift();

      // 1. Dots near the pointer glow; the LINKS nearest are joined to it
      const targets = new Map();
      const cells = (x0, y0, rad, fn) => {
        const c0 = Math.max(0, Math.floor((x0 - rad) / gap));
        const c1 = Math.ceil((x0 + rad) / gap);
        const r0 = Math.max(0, Math.floor((y0 - rad) / gap));
        const r1 = Math.ceil((y0 + rad) / gap);
        for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) fn(r * 10000 + c, c * gap + gap / 2, r * gap + gap / 2);
      };
      if (pointer.active) {
        const found = [];
        cells(cx, cy, span, (key, x, y) => {
          const d = Math.hypot(x - cx, y - cy);
          if (d <= span) found.push({ key, d });
        });
        found.sort((p, q) => p.d - q.d);
        for (let i = 0; i < found.length; i++) {
          targets.set(found[i].key, { v: Math.pow(1 - found[i].d / span, 1.5), l: i < LINKS && found[i].d < gap * LINK_MAX ? 1 : 0 });
        }
      }

      // 2. Every dot a recent push can still reach is woken up
      for (let i = 0; i < history.length; i += 3) {
        if (history[i].s < 0.03) continue;
        cells(history[i].x, history[i].y, R, (key) => {
          if (!dots.has(key)) dots.set(key, { v: 0, l: 0, ox: 0, oy: 0, vx: 0, vy: 0 });
        });
      }
      for (const key of targets.keys()) if (!dots.has(key)) dots.set(key, { v: 0, l: 0, ox: 0, oy: 0, vx: 0, vy: 0 });

      // 3. Move, ease and draw every awake dot
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      const spring = Math.min(dts, 1 / 30);
      const maxOff = gap * MAX_OFFSET;
      const live = [];
      for (const [key, st] of dots) {
        const t = targets.get(key) || { v: 0, l: 0 };
        st.v = ease(st.v, t.v, dt);
        st.l = ease(st.l, t.l, dt, LINE_RELEASE_MS);
        const c = key % 10000;
        const r = (key - c) / 10000;
        const hx = c * gap + gap / 2;
        const hy = r * gap + gap / 2;

        // push: pointer positions from the past, delayed by the distance the ripple has travelled
        let fx = 0;
        let fy = 0;
        for (let i = history.length - 1; i >= 0; i--) {
          const hp = history[i];
          if (hp.s < 0.03) continue;
          const d0 = Math.hypot(hx - hp.x, hy - hp.y);
          if (d0 > R || d0 < 1) continue;
          if (clock - hp.t < d0 / WAVE_SPEED) continue; // the ripple has not got this far yet
          const f = (1 - d0 / R) ** 2 * hp.s * hp.w * WAVE_PUSH;
          fx += ((hx - hp.x) / d0) * f;
          fy += ((hy - hp.y) / d0) * f;
        }
        st.vx += (fx - SPRING_K * st.ox - SPRING_C * st.vx) * spring;
        st.vy += (fy - SPRING_K * st.oy - SPRING_C * st.vy) * spring;
        st.ox += st.vx * spring;
        st.oy += st.vy * spring;
        const mag = Math.hypot(st.ox, st.oy);
        if (mag > maxOff) {
          st.ox *= maxOff / mag;
          st.oy *= maxOff / mag;
        }

        const resting = Math.abs(st.ox) + Math.abs(st.oy) < 0.05 && Math.abs(st.vx) + Math.abs(st.vy) < 0.6;
        if (resting && st.v < 0.01 && st.l < 0.01 && t.v === 0) {
          dots.delete(key);
          continue;
        }
        live.push({ st, hx, hy, x: hx + st.ox, y: hy + st.oy, moved: !resting, t });
      }

      // hide the CSS dot at home for every dot that has left it, then draw it where it is now
      ctx.fillStyle = bg;
      ctx.globalAlpha = 1;
      for (const d of live) {
        if (!d.moved) continue;
        ctx.beginPath();
        ctx.arc(d.hx, d.hy, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = ink;
      ctx.globalAlpha = 0.13;
      for (const d of live) {
        if (!d.moved) continue;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = accent;
      ctx.strokeStyle = accent;
      const lines = [];
      for (const d of live) {
        const { st } = d;
        if (st.v < 0.01 && st.l < 0.01) continue;
        if (st.l > 0.01 && Math.hypot(d.x - cx, d.y - cy) < span * 0.9) lines.push({ x: d.x, y: d.y, l: st.l });
        ctx.globalAlpha = Math.min(1, 0.6 * st.v + 0.4 * st.l);
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1 + 0.4 * st.v + 0.8 * st.l, 0, Math.PI * 2);
        ctx.fill();
      }
      // At most LINKS lines are ever drawn at once: the strongest win, the weakest are dropped.
      lines.sort((p, q) => q.l - p.l);
      for (let i = 0; i < Math.min(LINKS, lines.length); i++) {
        ctx.globalAlpha = 0.4 * lines[i].l;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(lines[i].x, lines[i].y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      return dots.size > 0 || history.length > 0;
    };

    const frame = (now) => {
      if (draw(now) || pointer.active) raf = requestAnimationFrame(frame);
      else running = false;
    };
    const wake = () => {
      if (running || document.hidden) return;
      running = true;
      pointer.last = 0;
      history.length = 0;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e) => {
      if (e.pointerType === 'touch' && e.type === 'pointermove' && !pointer.touching) return;
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
      if (!pointer.active) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      }
      pointer.active = true;
      wake();
    };
    const onDown = (e) => {
      if (e.pointerType === 'touch') pointer.touching = true;
      onMove(e);
    };
    const onUp = (e) => {
      if (e.pointerType === 'touch') {
        pointer.touching = false;
        pointer.active = false;
        wake();
      }
    };
    const onLeave = () => {
      pointer.active = false;
      wake();
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        running = false;
      }
    };

    readTheme();
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);
    const mo = new MutationObserver(readTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div className="dotfield" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
