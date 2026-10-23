import { useEffect } from 'react';

// Eased mouse-wheel scrolling: instead of the page jumping by a fixed step per wheel notch,
// the scroll position glides toward where the wheel is pointing (same idea as Lenis, no
// dependency). Everything else is left alone: touch screens keep their native momentum,
// keyboard / scrollbar dragging / anchor jumps stay native, pinch-zoom is untouched, and
// scrollable boxes inside the page (a long textarea, the dropdown list) still scroll themselves.
// Skipped entirely for visitors who prefer reduced motion.

const TIME_CONSTANT = 95; // ms: smaller = snappier, larger = floatier

function insideScrollable(el, dy) {
  const root = document.documentElement;
  for (let n = el; n && n !== document.body && n !== root; n = n.parentElement) {
    if (n.nodeType !== 1) continue;
    const overflowY = window.getComputedStyle(n).overflowY;
    if ((overflowY === 'auto' || overflowY === 'scroll') && n.scrollHeight > n.clientHeight) {
      const atTop = n.scrollTop <= 0;
      const atBottom = n.scrollTop + n.clientHeight >= n.scrollHeight - 1;
      if ((dy < 0 && !atTop) || (dy > 0 && !atBottom)) return true;
    }
  }
  return false;
}

export default function useSmoothScroll() {
  useEffect(() => {
    const mq = (q) => window.matchMedia && window.matchMedia(q).matches;
    if (mq('(prefers-reduced-motion: reduce)') || mq('(pointer: coarse)')) return undefined;

    const root = document.documentElement;
    root.classList.add('smooth-scroll'); // turns off the CSS scroll-behavior so frames land instantly

    let target = window.scrollY;
    let current = target;
    let raf = 0;
    let last = 0;

    const maxScroll = () => Math.max(0, root.scrollHeight - window.innerHeight);
    const clamp = (v) => Math.min(Math.max(v, 0), maxScroll());

    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    }

    function tick(now) {
      // Something else moved the page (keyboard, scrollbar drag, route change): let go.
      if (Math.abs(window.scrollY - current) > 2) {
        target = current = window.scrollY;
        stop();
        return;
      }
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      const diff = target - current;
      if (Math.abs(diff) < 0.3) {
        current = target;
        window.scrollTo(0, current);
        stop();
        return;
      }
      current += diff * (1 - Math.exp(-dt / TIME_CONSTANT));
      window.scrollTo(0, current);
      raf = requestAnimationFrame(tick);
    }

    function onWheel(e) {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey) return; // pinch-zoom / browser zoom
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // horizontal gesture
      if (insideScrollable(e.target, e.deltaY)) return;

      e.preventDefault();
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 32; // lines
      else if (e.deltaMode === 2) dy *= window.innerHeight; // pages

      if (!raf) target = current = window.scrollY;
      target = clamp(target + dy);
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function onScroll() {
      if (!raf) target = current = window.scrollY;
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      stop();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      root.classList.remove('smooth-scroll');
    };
  }, []);
}
