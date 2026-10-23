import { useEffect, useRef } from 'react';

// Two-layer cursor: a small dot that sits exactly on the pointer and a thin ring that trails it with
// a soft ease. The ring grows over links and buttons (the dot shrinks away) and tightens slightly
// while the mouse button is held. Both are drawn white with mix-blend-mode: difference, so they read
// as dark on light backgrounds and light on dark ones, in either theme, with no colour switching.
//
// The system arrow is hidden only while this is active (class `has-custom-cursor` on <html>), and
// text fields keep their normal I-beam. Not used on touch / coarse-pointer devices or when the
// visitor prefers reduced motion. Styles: `.cursor-*` in index.css.
//
// Tuning: RING_EASE (0.1 = lazier, 0.3 = snappier), HOVER_SCALE (ring size over links).

const RING_EASE = 0.16;
const HOVER_SCALE = 1.7;
const INTERACTIVE = 'a, button, [role="button"], [role="tab"], summary, label, select';
const TEXTUAL = 'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), textarea';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const mouse = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let seen = false;
    let raf = 0;
    let running = false;
    let hover = false;
    let text = false;
    let down = false;
    let shown = false;

    const setState = () => {
      dot.classList.toggle('is-hover', hover && !text);
      dot.classList.toggle('is-down', down);
      ring.classList.toggle('is-hover', hover && !text);
      ring.classList.toggle('is-down', down);
      const hide = text || !shown;
      dot.classList.toggle('is-hidden', hide);
      ring.classList.toggle('is-hidden', hide);
    };

    function frame() {
      ringPos.x += (mouse.x - ringPos.x) * RING_EASE;
      ringPos.y += (mouse.y - ringPos.y) * RING_EASE;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      if (Math.abs(mouse.x - ringPos.x) < 0.05 && Math.abs(mouse.y - ringPos.y) < 0.05) {
        ringPos.x = mouse.x;
        ringPos.y = mouse.y;
        ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    function onMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      if (!seen) {
        seen = true;
        ringPos.x = mouse.x;
        ringPos.y = mouse.y;
      }
      const t = e.target instanceof Element ? e.target : null;
      const nextHover = !!(t && t.closest(INTERACTIVE));
      const nextText = !!(t && t.closest(TEXTUAL));
      const nextShown = true;
      if (nextHover !== hover || nextText !== text || nextShown !== shown) {
        hover = nextHover;
        text = nextText;
        shown = nextShown;
        setState();
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    }
    const onDown = () => {
      down = true;
      setState();
    };
    const onUp = () => {
      down = false;
      setState();
    };
    const onLeave = () => {
      shown = false;
      setState();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    root.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      root.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring is-hidden" aria-hidden="true">
        <span />
      </div>
      <div ref={dotRef} className="cursor-dot is-hidden" aria-hidden="true">
        <span />
      </div>
    </>
  );
}
