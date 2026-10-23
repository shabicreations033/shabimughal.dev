import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Vertical scroll-progress bar fixed to the left edge of the screen: a thin track that fills
// from the top as you scroll, with a hairline marker and the percentage riding along the end
// of the fill. The shown value eases toward the real scroll position (and the number counts
// up/down with it) instead of snapping, so it stays smooth even on jumpy scrolling.
//
// It writes straight to the DOM from a requestAnimationFrame loop that only runs while the
// value is still catching up, so scrolling doesn't re-render React.
export default function ScrollProgress() {
  const { pathname } = useLocation();
  const rootRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    const label = labelRef.current;
    if (!el || !label) return undefined;

    const docEl = document.documentElement;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let shown = 0;
    let max = 0;
    let raf = 0;
    let last = 0;

    const actual = () => (max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0);

    function readMax() {
      max = Math.max(0, docEl.scrollHeight - window.innerHeight);
      el.classList.toggle('is-hidden', max < 2); // nothing to scroll (short page)
    }

    function render(now) {
      const goal = actual();
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      shown = reduced ? goal : shown + (goal - shown) * (1 - Math.exp(-dt / 90));
      if (Math.abs(goal - shown) < 0.0005) shown = goal;

      el.style.setProperty('--p', shown.toFixed(4));
      label.textContent = String(Math.round(shown * 100));

      if (shown !== goal) {
        raf = requestAnimationFrame(render);
      } else {
        raf = 0;
        last = 0;
      }
    }

    function kick() {
      if (!raf) raf = requestAnimationFrame(render);
    }

    function onResize() {
      readMax();
      kick();
    }

    readMax();
    kick();

    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', onResize);
    // Page height changes when content loads in (projects from the API) or a section expands.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
    };
  }, [pathname]);

  return (
    <div ref={rootRef} className="scroll-progress is-hidden" aria-hidden="true">
      <div className="scroll-progress-track" />
      <div className="scroll-progress-fill" />
      <div className="scroll-progress-tick" />
      <span ref={labelRef} className="scroll-progress-label">0</span>
    </div>
  );
}
