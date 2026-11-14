// Ink-bleed reveal for the theme switch.
//
// The new theme spreads out from the toggle like ink soaking into paper: an uneven edge
// with a few long tendrils and small droplets running ahead of it. It is drawn as a small
// alpha canvas (480px wide, stretched to the screen), and every frame is handed to the
// page as the CSS variable --ink-mask, which masks the "new theme" snapshot of the
// View Transitions API (see index.css).

const W = 480;
const POINTS = 240;

function rand(a, b) {
  return a + Math.random() * (b - a);
}

function ease(t) {
  // slow start, quick middle, soft landing
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function startInk({ x, y, duration = 1900 }) {
  const root = document.documentElement;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const H = Math.max(40, Math.round((W * vh) / vw));
  const sc = W / vw;
  const cx = x * sc;
  const cy = y * sc;
  const far = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy));

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Random shape, new every time: wobble of the edge, tendrils, droplets.
  const lobes = Array.from({ length: 9 }, () => {
    const k = Math.floor(rand(2, 15));
    return { k, a: rand(0.05, 0.16) / Math.sqrt(k / 2), ph: rand(0, Math.PI * 2), sp: rand(-1.2, 1.2) };
  });
  const tendrils = Array.from({ length: 5 }, () => ({
    th: rand(0, Math.PI * 2),
    w: rand(0.1, 0.24),
    amp: rand(0.22, 0.5),
    late: rand(0, 0.3),
  }));
  const drops = Array.from({ length: 38 }, () => ({
    th: rand(0, Math.PI * 2),
    d: rand(1.02, 1.28),
    size: rand(1.2, 4.6),
    t0: rand(0.06, 0.8),
  }));

  function radiusFactor(theta, t) {
    let f = 1;
    for (const l of lobes) f += l.a * Math.sin(l.k * theta + l.ph + l.sp * t * 5);
    for (const d of tendrils) {
      let dt = Math.abs(((theta - d.th + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      f += d.amp * Math.max(0, Math.min(1, (t - d.late) * 2.2)) * Math.exp(-Math.pow(dt / d.w, 2));
    }
    return Math.max(0.62, f);
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    if (t >= 1) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      return;
    }
    const R = ease(t) * far * 1.75;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    for (let i = 0; i <= POINTS; i++) {
      const th = (i / POINTS) * Math.PI * 2;
      const r = R * radiusFactor(th, t);
      const px = cx + Math.cos(th) * r;
      const py = cy + Math.sin(th) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    for (const d of drops) {
      if (t < d.t0 || R < 6) continue;
      const r = R * radiusFactor(d.th, t) * d.d;
      const grow = Math.min(1, (t - d.t0) * 5);
      ctx.beginPath();
      ctx.arc(cx + Math.cos(d.th) * r, cy + Math.sin(d.th) * r, d.size * grow, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function push(t) {
    draw(t);
    root.style.setProperty('--ink-mask', `url(${canvas.toDataURL('image/png')})`);
  }

  // Empty mask first, so the new snapshot is hidden until the first frame is drawn.
  push(0);

  let raf = 0;
  let stopped = false;
  let begin = 0;
  function frame(now) {
    if (stopped) return;
    if (!begin) begin = now;
    const t = Math.min(1, (now - begin) / duration);
    push(t);
    if (t < 1) raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return function stop() {
    stopped = true;
    cancelAnimationFrame(raf);
    root.style.removeProperty('--ink-mask');
  };
}
