import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Page transition: "curtains". When a visitor clicks a link to another page, a solid
// curtain with slanted edges sweeps in from the right, the name of the destination page
// sits across the middle while the route changes underneath, then the curtain sweeps off to
// the left to reveal the new page.
//
// Clicks are caught once, at the document level, so every internal link on the site gets the
// transition without touching the links themselves. The click's default is cancelled, which
// makes React Router's <Link> skip its own instant navigation (its own onClick, such as the
// mobile menu closing itself, still runs).
//
// Not used for: first load (the landing curtain handles that), the browser's back / forward
// buttons, external links, downloads, new-tab clicks, or visitors who prefer reduced motion.

const HOLD_MS = 250; // how long the curtain rests fully closed while the new page mounts

// Big word shown on the curtain for each destination.
function labelFor(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return 'Home';
  if (path === '/about') return 'About';
  if (path === '/projects') return 'Projects';
  if (path.startsWith('/projects/')) return 'Case study';
  if (path === '/contact') return 'Contact';
  return 'Portfolio';
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function PageTransition() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState('idle'); // idle | in | hold | out
  const [label, setLabel] = useState('');
  const pending = useRef(null); // where to go once the curtain has closed
  const phaseRef = useRef('idle');
  const here = useRef(location.pathname);
  const holdTimer = useRef(0);

  phaseRef.current = phase;
  here.current = location.pathname;

  useEffect(() => {
    function onClick(e) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // open-in-new-tab style clicks
      if (phaseRef.current !== 'idle') {
        // A transition is already running: swallow further link clicks so nothing jumps mid-way.
        if (e.target.closest && e.target.closest('a[href]')) e.preventDefault();
        return;
      }
      if (prefersReducedMotion()) return;
      if (document.documentElement.classList.contains('has-curtain')) return; // landing curtain still up

      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      if (a.hasAttribute('download')) return;
      if (a.target && a.target !== '_self') return;

      let url;
      try {
        url = new URL(a.href, window.location.href);
      } catch (err) {
        return;
      }
      if (url.origin !== window.location.origin) return; // external, mailto:, tel:, ...
      if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return; // a file (the resume PDF, images, ...)
      if (url.pathname === here.current) return; // already on that page

      e.preventDefault();
      pending.current = url.pathname + url.search + url.hash;
      setLabel(labelFor(url.pathname));
      setPhase('in');
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => () => clearTimeout(holdTimer.current), []);

  function onAnimationEnd(e) {
    if (e.target !== e.currentTarget) return;
    if (phase === 'in') {
      // Curtain is fully closed: swap the page behind it, rest a moment, then open.
      if (pending.current) navigate(pending.current);
      pending.current = null;
      setPhase('hold');
      holdTimer.current = setTimeout(() => setPhase('out'), HOLD_MS);
    } else if (phase === 'out') {
      setPhase('idle');
    }
  }

  if (phase === 'idle') return null;
  return (
    <div className={`page-transition is-${phase}`} aria-hidden="true" onAnimationEnd={onAnimationEnd}>
      <span className="page-transition-label">{label}</span>
    </div>
  );
}
