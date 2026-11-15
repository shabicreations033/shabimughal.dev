// Theme switch for browsers without View Transitions (older iPhones, Firefox on Android).
//
// The desktop version masks a snapshot of the new page with an ink shape (View Transitions API).
// Phone browsers handle that unevenly (iOS Safari, Android WebView, low-end GPUs), so here the ink is
// drawn on a plain full-screen <canvas> that every browser supports:
// Phones with View Transitions use lib/inkPolygon.js instead, which reveals the real new page.
//   1. an ink blob in the NEW theme's background colour spreads from the button across the screen,
//   2. once it covers everything, the theme is switched underneath it,
//   3. the blob fades away and the new theme is there.
// Only 2D canvas, requestAnimationFrame and a CSS opacity transition are used.

const GROW_MS = 900;
const FADE_MS = 450;

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export function inkCover({ x, y, color, commit }) {
  return new Promise((resolve) => {
    const root = document.documentElement;
    const w = root.clientWidth;
    const h = root.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = `position:fixed;left:0;top:0;width:${w}px;height:${h}px;z-index:2147483000;pointer-events:none;opacity:1;transition:opacity ${FADE_MS}ms ease-out;`;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      canvas.remove();
      commit();
      resolve();
      return;
    }
    ctx.scale(dpr, dpr);

    const reach = Math.max(Math.hypot(x, y), Math.hypot(w - x, y), Math.hypot(x, h - y), Math.hypot(w - x, h - y)) + 8;
    const STEPS = 120;
    // Each direction gets its own wobble, so the edge is a living ink front, not a circle.
    const waves = Array.from({ length: 4 }, (_, i) => ({
      k: 2 + i * 2 + Math.floor(Math.random() * 2),
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 0.8,
      amp: 0.16 / (i + 1),
    }));

    function draw(p) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      ctx.beginPath();
      const base = easeInOut(p) * reach;
      // The wobble dies out near the end so the blob finishes as a clean full cover.
      const wob = Math.sin(Math.min(1, p) * Math.PI) * (1 - Math.pow(p, 3));
      for (let i = 0; i <= STEPS; i++) {
        const a = (i / STEPS) * Math.PI * 2;
        let n = 0;
        for (const wv of waves) n += Math.sin(a * wv.k + wv.phase + p * wv.speed * 6) * wv.amp;
        const r = Math.max(0, base * (1 + n * wob));
        const px = x + Math.cos(a) * r;
        const py = y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      if (p >= 1) ctx.fillRect(0, 0, w, h);
    }

    let begin = 0;
    function frame(now) {
      if (!begin) begin = now;
      const p = Math.min(1, (now - begin) / GROW_MS);
      draw(p);
      if (p < 1) {
        requestAnimationFrame(frame);
        return;
      }
      // Fully covered: switch the theme underneath, let it paint, then fade the ink away.
      commit();
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          canvas.style.opacity = '0';
          setTimeout(() => {
            canvas.remove();
            resolve();
          }, FADE_MS + 60);
        })
      );
    }
    requestAnimationFrame(frame);
  });
}

// True on touch devices and small screens (phones and tablets).
export function isPhoneLayout() {
  if (typeof window === 'undefined') return false;
  const touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  return touch || window.innerWidth <= 800;
}
