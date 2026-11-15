import { warmHero } from '../lib/heroImage';
import { useEffect, useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { startInk } from '../lib/inkReveal';
import { startInkGL, warmInk, buildInkSprite, playInkSprite, clearInkSprite } from '../lib/inkShader';
import { inkCover, isPhoneLayout } from '../lib/inkCover';
import { runInkReveal } from '../lib/inkPolygon';

// Theme logic:
//  - First visit: follow the visitor's Windows / browser colour scheme
//    (prefers-color-scheme). index.html applies it before first paint.
//  - While the visitor has not clicked the toggle, keep following the system
//    live (e.g. Windows switching to dark at sunset).
//  - Clicking the toggle is an explicit choice: it is saved and wins from then on.
//
// Look: a round button. Light theme shows a dark circle with a moon (click to go
// dark); dark theme shows a light circle with a sun (click to go light). The
// moon turns into a sun with rays, and the new theme bleeds across the page like
// ink from the button (View Transitions API + the WebGL ink shader in lib/inkShader.js;
// lib/inkReveal.js is the plain-canvas version used when WebGL2 is missing). Phones and
// tablets play the same ink pre-rendered as a sprite sheet (polygon ink in lib/inkPolygon.js as a backup); browsers without
// View Transitions use a canvas version (lib/inkCover.js); visitors who prefer reduced motion get an
// instant switch.
const REVEAL_MS = 2400;

const NEW_BG = { light: '#ffffff', dark: '#0b0b0f' }; // background of each theme, for the canvas ink

function readSaved() {
  try {
    const v = localStorage.getItem('theme');
    return v === 'dark' || v === 'light' ? v : null;
  } catch (e) {
    return null;
  }
}

function systemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');
  // Lets components that pick content by theme (the hero photo) update in the same frame.
  window.dispatchEvent(new Event('themechange'));
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

  // Build the ink's noise texture while the browser is idle, so the first click is instant.
  useEffect(() => {
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 600));
    const id = idle(() => warmInk());
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, []);

  // Follow live system changes until the visitor makes their own choice.
  useEffect(() => {
    if (chosen || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [chosen]);

  // Another toggle on the page (the phone hero has its own) may change the theme: stay in step.
  useEffect(() => {
    const mo = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
      setChosen(readSaved() !== null);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

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

    if (prefersReducedMotion()) {
      commit();
      return;
    }

    // The ink starts at the centre of the button and runs to the farthest corner of the screen.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // No View Transitions (older iPhones, Firefox on Android): ink drawn on a canvas (lib/inkCover.js).
    if (!document.startViewTransition) {
      busy.current = true;
      const root0 = document.documentElement;
      root0.classList.add('theme-switching');
      inkCover({ x, y, color: NEW_BG[next], commit: () => flushSync(commit) }).finally(() => {
        root0.classList.remove('theme-switching');
        busy.current = false;
      });
      return;
    }

    // Phones: the same WebGL ink, pre-rendered into a sprite sheet (lib/inkShader.js). If that is
    // not possible, the polygon ink (lib/inkPolygon.js). Desktop: the live WebGL ink.
    const phone = isPhoneLayout();
    const sprite = phone ? buildInkSprite({ x, y, duration: REVEAL_MS }) : null;
    const poly = phone && !sprite;

    const root = document.documentElement;
    root.classList.add('theme-switching'); // switches the page's own colour fades off for the duration
    if (sprite) root.classList.add('ink-sprite');
    if (poly) root.classList.add('ink-poly');
    busy.current = true;

    const stopInk = phone ? null : startInkGL({ x, y, duration: REVEAL_MS }) || startInk({ x, y, duration: REVEAL_MS + 400 }); // mask is empty until the first frame

    const transition = document.startViewTransition(() => {
      flushSync(commit);
    });

    // The browser ends a view transition as soon as the animations on its snapshots end. The
    // ink is drawn by hand, so give the snapshot a do-nothing animation that lasts as long.
    transition.ready
      .then(() => {
        if (sprite) {
          if (!playInkSprite(root, sprite, REVEAL_MS)) transition.skipTransition();
          return;
        }
        if (poly) {
          if (!runInkReveal(root, { x, y })) transition.skipTransition();
          return;
        }
        root.animate(
          { opacity: [1, 1] },
          { duration: REVEAL_MS + 450, pseudoElement: '::view-transition-new(root)' }
        );
      })
      .catch(() => {});

    transition.finished.finally(() => {
      if (stopInk) stopInk();
      root.classList.remove('theme-switching', 'ink-poly', 'ink-sprite');
      clearInkSprite(root);
      busy.current = false;
    });
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? 'is-dark' : ''}`}
      onClick={toggle}
      onPointerEnter={() => warmHero(isDark ? 'light' : 'dark')}
      onFocus={() => warmHero(isDark ? 'light' : 'dark')}
      onTouchStart={(e) => {
        warmHero(isDark ? 'light' : 'dark');
        // Phones: render the ink sprite now, while the finger is still down, so the tap starts at once.
        const r = e.currentTarget.getBoundingClientRect();
        if (isPhoneLayout() && document.startViewTransition) buildInkSprite({ x: r.left + r.width / 2, y: r.top + r.height / 2, duration: REVEAL_MS });
      }}
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
