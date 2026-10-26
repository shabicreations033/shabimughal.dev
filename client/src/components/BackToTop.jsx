import { useEffect, useState } from 'react';

// Small round button, bottom right. Appears once the visitor has scrolled a screen or so down
// and takes them back to the top of whichever page they are on.
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setShow(window.scrollY > Math.max(480, window.innerHeight * 0.6));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  function goTop() {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }

  return (
    <button
      type="button"
      className={`back-to-top ${show ? 'is-visible' : ''}`}
      onClick={goTop}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
