// Ink reveal for phones and tablets, using the same View Transition as the desktop version.
//
// The desktop version masks the new page with a WebGL ink shape that is redrawn every frame. That is
// too heavy (and not reliably supported) on phones. Here the ink front is pre-computed once as a
// list of polygons (clip-path keyframes) and handed to the browser's own animation engine, which
// animates it on the GPU. The new theme still shows only inside the spreading ink; the old page
// stays visible outside it, exactly like on desktop.

export const PHONE_REVEAL_MS = 1900;

const FRAMES = 56; // keyframes along the animation
const STEPS = 84; // points around the ink front

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export function inkFrames({ x, y }) {
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.clientHeight;
  const reach = Math.max(Math.hypot(x, y), Math.hypot(w - x, y), Math.hypot(x, h - y), Math.hypot(w - x, h - y)) + 12;

  // Every direction gets its own slow wobble, so the front looks like bleeding ink, not a circle.
  const waves = Array.from({ length: 5 }, (_, i) => ({
    k: 2 + i * 2 + Math.floor(Math.random() * 2),
    phase: Math.random() * Math.PI * 2,
    speed: 0.5 + Math.random() * 0.9,
    amp: 0.2 / (i + 1),
  }));
  // A few fingers that run ahead of the main front.
  const fingers = Array.from({ length: 7 }, () => ({
    a: Math.random() * Math.PI * 2,
    width: 0.16 + Math.random() * 0.14,
    len: 0.12 + Math.random() * 0.16,
    delay: Math.random() * 0.25,
  }));

  const frames = [];
  for (let f = 0; f <= FRAMES; f++) {
    const t = f / FRAMES;
    const p = easeOut(t);
    const base = p * reach * 0.92;
    // The wobble fades out at the end so the front finishes as a clean full cover.
    const wob = Math.sin(Math.min(1, t * 1.15) * Math.PI) * (1 - Math.pow(t, 3));
    const extra = t >= 1 ? reach : 0;
    const pts = [];
    for (let i = 0; i < STEPS; i++) {
      const a = (i / STEPS) * Math.PI * 2;
      let n = 0;
      for (const wv of waves) n += Math.sin(a * wv.k + wv.phase + t * wv.speed * 5) * wv.amp;
      let finger = 0;
      for (const fg of fingers) {
        let d = Math.abs(((a - fg.a + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        d = Math.min(d, Math.PI * 2 - d);
        const grow = Math.max(0, Math.min(1, (t - fg.delay) / (1 - fg.delay)));
        finger += Math.exp(-(d * d) / (fg.width * fg.width)) * fg.len * Math.sin(grow * Math.PI) * 1.0;
      }
      const r = Math.max(0, base * (1 + (n + finger) * wob) + extra);
      pts.push(`${(x + Math.cos(a) * r).toFixed(1)}px ${(y + Math.sin(a) * r).toFixed(1)}px`);
    }
    frames.push(`polygon(${pts.join(',')})`);
  }
  return frames;
}

// Starts the reveal on the new-page snapshot of a running view transition. Returns false when the
// browser cannot animate view-transition pseudo-elements (the caller then skips the animation).
export function runInkReveal(root, { x, y }) {
  try {
    const anim = root.animate(
      { clipPath: inkFrames({ x, y }) },
      { duration: PHONE_REVEAL_MS, easing: 'linear', fill: 'forwards', pseudoElement: '::view-transition-new(root)' }
    );
    return !!anim;
  } catch (err) {
    return false;
  }
}
