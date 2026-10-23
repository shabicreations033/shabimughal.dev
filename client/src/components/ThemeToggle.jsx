import { useEffect, useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

// Theme logic:
//  - First visit: follow the visitor's Windows / browser colour scheme
//    (prefers-color-scheme). index.html applies it before first paint.
//  - While the visitor has not clicked the toggle, keep following the system
//    live (e.g. Windows switching to dark at sunset).
//  - Clicking the toggle is an explicit choice: it is saved and wins from then on.
//
// Look: a round button. Light theme shows a dark circle with a moon (click to go
// dark); dark theme shows a light circle with a sun (click to go light). The
// moon turns into a sun with rays, and the new theme spreads across the page as
// a circle that grows out of the button (View Transitions API). Browsers
// without it, and visitors who prefer reduced motion, just get an instant switch.
const REVEAL_MS = 800;
const REVEAL_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

function readSaved() {
  try {
    const v = localStorage.getItem('theme');
    return v === 'dark' || v === 'light' ? v : null;
  } catch (e) {
    return null;
  }
}

function systemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => readSaved() || systemTheme());
  const [chosen, setChosen] = useState(() => readSaved() !== null);
  const busy = useRef(false);
  const maskId = useId().replace(/:/g, '');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Follow live system changes until the visitor makes their own choice.
  useEffect(() => {
    if (chosen || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [chosen]);

  function toggle(e) {
    if (busy.current) return; // let the current reveal finish before starting another

    const next = theme === 'dark' ? 'light' : 'dark';

    const commit = () => {
      applyTheme(next);
      setTheme(next);
      setChosen(true);
      try {
        localStorage.setItem('theme', next);
      } catch (err) {
        // localStorage unavailable (private browsing, etc.): choice just won't persist
      }
    };

    if (!document.startViewTransition || prefersReducedMotion()) {
      commit();
      return;
    }

    // The reveal grows from the centre of the button to the farthest corner of the screen.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const root = document.documentElement;
    root.classList.add('theme-switching'); // switches the page's own colour fades off for the duration
    busy.current = true;

    const transition = document.startViewTransition(() => {
      flushSync(commit);
    });

    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: REVEAL_MS, easing: REVEAL_EASE, pseudoElement: '::view-transition-new(root)' }
        );
      })
      .catch(() => {});

    transition.finished.finally(() => {
      root.classList.remove('theme-switching');
      busy.current = false;
    });
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? 'is-dark' : ''}`}
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
    >
      <svg className="theme-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          {/* The "bite" that turns the full disc into a crescent; it slides away to leave the sun's core. */}
          <mask id={`tt-${maskId}`} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <rect width="24" height="24" fill="#fff" />
            <circle className="tt-bite" cx="17.8" cy="7.2" r="6.2" fill="#000" />
          </mask>
        </defs>
        <circle className="tt-core" cx="12" cy="12" r="9" fill="currentColor" mask={`url(#tt-${maskId})`} />
        <g className="tt-rays" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
          {RAY_ANGLES.map((a) => (
            <line key={a} x1="12" y1="2.6" x2="12" y2="4.7" transform={`rotate(${a} 12 12)`} />
          ))}
        </g>
      </svg>
    </button>
  );
}
