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
// Tuning: LINKS, LINK_MAX, HALO, ATTACK_MS (how fast a dot lights up), RELEASE_MS (how slowly it fades).

const LINKS = 5; // how many of the nearest dots are joined to the pointer
const LINK_MAX = 2.2; // a line never reaches farther than this, in dot gaps
const HALO = 3.6; // how far the glow around the pointer reaches, in dot gaps
const FOLLOW_MS = 90; // how closely the effect trails the pointer (lower = tighter)
const ATTACK_MS = 80;
const RELEASE_MS = 420;
const LINE_RELEASE_MS = 130; // lines let go faster than the glow, so no long trails are left behind

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
    let raf = 0;
    let running = false;
    // `x`/`y` trail the pointer with a light ease (tx/ty is where it really is)
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false, last: 0 };

    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      accent = cs.getPropertyValue('--accent').trim() || accent;
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

    // Per-dot state, keyed by grid cell: v = glow (0..1), l = line strength (0..1)
    const dots = new Map();
    const ease = (cur, target, dt, release = RELEASE_MS) =>
      cur + (target - cur) * (1 - Math.exp(-dt / (target > cur ? ATTACK_MS : release)));

    const draw = (now) => {
      const dt = Math.min(64, now - (pointer.last || now));
      pointer.last = now;
      const k = 1 - Math.exp(-dt / FOLLOW_MS);
      pointer.x += (pointer.tx - pointer.x) * k;
      pointer.y += (pointer.ty - pointer.y) * k;

      const cx = pointer.x;
      const cy = pointer.y;
      const span = gap * HALO;

      // 1. Work out what each dot near the pointer should be doing right now (its target)
      const targets = new Map();
      if (pointer.active) {
        const c0 = Math.max(0, Math.floor((cx - span) / gap));
        const c1 = Math.ceil((cx + span) / gap);
        const r0 = Math.max(0, Math.floor((cy - span) / gap));
        const r1 = Math.ceil((cy + span) / gap);
        const found = [];
        for (let r = r0; r <= r1; r++) {
          for (let c = c0; c <= c1; c++) {
            const x = c * gap + gap / 2;
            const y = r * gap + gap / 2;
            const d = Math.hypot(x - cx, y - cy);
            if (d > span) continue;
            found.push({ key: r * 10000 + c, d });
          }
        }
        found.sort((p, q) => p.d - q.d);
        // every dot nearby glows a little; the LINKS nearest ones are also joined to the pointer
        for (let i = 0; i < found.length; i++) {
          targets.set(found[i].key, { v: Math.pow(1 - found[i].d / span, 1.5), l: i < LINKS && found[i].d < gap * LINK_MAX ? 1 : 0 });
        }
      }

      // 2. Ease every dot toward its target. Dots that are lit or still fading are kept in the map.
      for (const key of targets.keys()) if (!dots.has(key)) dots.set(key, { v: 0, l: 0 });
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = accent;
      ctx.fillStyle = accent;
      ctx.lineWidth = 1;
      const lines = [];
      for (const [key, st] of dots) {
        const t = targets.get(key) || { v: 0, l: 0 };
        st.v = ease(st.v, t.v, dt);
        st.l = ease(st.l, t.l, dt, LINE_RELEASE_MS);
        if (st.v < 0.01 && st.l < 0.01 && t.v === 0) {
          dots.delete(key);
          continue;
        }
        const c = key % 10000;
        const r = (key - c) / 10000;
        const x = c * gap + gap / 2;
        const y = r * gap + gap / 2;
        // a line is only a candidate while its dot is still close to the pointer
        if (st.l > 0.01 && Math.hypot(x - cx, y - cy) < span * 0.9) lines.push({ x, y, l: st.l });
        ctx.globalAlpha = Math.min(1, 0.6 * st.v + 0.4 * st.l);
        ctx.beginPath();
        ctx.arc(x, y, 1 + 0.4 * st.v + 0.8 * st.l, 0, Math.PI * 2);
        ctx.fill();
      }
      // At most LINKS lines are ever drawn at once: when dots hand over while the pointer moves, the
      // strongest lines win and the weakest are dropped.
      lines.sort((p, q) => q.l - p.l);
      for (let i = 0; i < Math.min(LINKS, lines.length); i++) {
        ctx.globalAlpha = 0.4 * lines[i].l;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(lines[i].x, lines[i].y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      return dots.size > 0;
    };

    const frame = (now) => {
      if (draw(now) || pointer.active) raf = requestAnimationFrame(frame);
      else running = false;
    };
    const wake = () => {
      if (running || document.hidden) return;
      running = true;
      pointer.last = 0;
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
