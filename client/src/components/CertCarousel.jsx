import { useCallback, useEffect, useRef, useState } from 'react';
import useReveal from '../hooks/useReveal';

// Certifications carousel for the Home page.
//
// One featured certificate at a time on a flat surface card: its details on the left and its
// preview on the right. Changing slide swings the old preview off along a curve and the next one
// in from the opposite side (like riding a wheel), while the text cross-fades. Below sits a row of round thumbnails, the active one
// opening into a pill with its name, plus previous / next buttons.
//
// Plays by itself every few seconds (pauses on hover, focus and when the tab is hidden), works
// with the arrow keys and with swipes. Reduced-motion visitors get a plain cross-fade, no autoplay.
// Content comes from profile.certifications (see data/profile.js).

const AUTOPLAY_MS = 5600;

// Where a certificate's link goes and what it says: its verify page if one is set, otherwise the PDF copy.
export function certLink(c) {
  if (c.verifyUrl) return { href: c.verifyUrl, label: c.verifyLabel || 'View certificate ↗' };
  return { href: `/certificates/${c.slug}.pdf`, label: c.viewLabel || 'View certificate ↗' };
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function CertCarousel({ items }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false); // hover / keyboard focus pauses autoplay
  const [tabVisible, setTabVisible] = useState(true);
  const [ref, inView] = useReveal();
  const swipe = useRef(null);
  const reduced = useRef(prefersReducedMotion());

  const go = useCallback((i) => setActive(((i % n) + n) % n), [n]);
  const next = useCallback(() => setActive((a) => (a + 1) % n), [n]);
  const prev = useCallback(() => setActive((a) => (a - 1 + n) % n), [n]);

  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Autoplay: a fresh timer after every slide change, so manual clicks restart the countdown.
  useEffect(() => {
    if (!inView || hold || !tabVisible || reduced.current || n < 2) return undefined;
    const id = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, inView, hold, tabVisible, next, n]);

  function onKeyDown(e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  }

  function onPointerDown(e) {
    if (e.pointerType === 'mouse') return; // mouse users have the buttons; keep text selectable
    swipe.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp(e) {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? next : prev)();
  }

  // Position of each slide on the wheel: the active one in front, the one just left behind it
  // (exited), everything else waiting on the entry side.
  const stateOf = (i) => {
    const rel = (i - active + n) % n;
    if (rel === 0) return 'is-active';
    if (rel === n - 1) return 'is-before';
    return 'is-after';
  };

  return (
    <div
      ref={ref}
      className="cert-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Certifications"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      onKeyDown={onKeyDown}
    >
      <div className="cert-stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <div className="cert-copy" aria-live="polite">
          {items.map((c, i) => {
            const link = certLink(c);
            const on = i === active;
            return (
              <article
                key={c.slug}
                className={`cert-slide${on ? ' is-active' : ''}`}
                aria-hidden={!on}
                inert={on ? undefined : ''}
                aria-label={`${i + 1} of ${n}`}
              >
                <p className="cert-eyebrow">
                  {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')} · {c.issuer}
                </p>
                <h3 className="cert-title">{c.title}</h3>
                <p className="cert-kind">{c.kind}</p>
                <p className="cert-details">{c.details}</p>
                <dl className="cert-meta">
                  {c.issued && (
                    <div>
                      <dt>Issued</dt>
                      <dd>{c.issued}</dd>
                    </div>
                  )}
                  {c.credentialId && (
                    <div>
                      <dt>Credential ID</dt>
                      <dd>{c.credentialId}</dd>
                    </div>
                  )}
                  {c.via && c.via !== c.issuer && (
                    <div>
                      <dt>Via</dt>
                      <dd>{c.via}</dd>
                    </div>
                  )}
                </dl>
                <a className="cert-link" href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </article>
            );
          })}
        </div>

        <div className="cert-visual" aria-hidden="true">
          {items.map((c, i) => (
            <div key={c.slug} className={`cert-orbit ${stateOf(i)}`}>
              <img className="cert-img" src={`/certificates/${c.slug}.webp`} alt="" width={c.width} height={c.height} draggable="false" />
            </div>
          ))}
        </div>
      </div>

      <div className="cert-nav">
        <div className="cert-thumbs" role="tablist" aria-label="Choose a certificate">
          {items.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`${c.issuer}: ${c.title}`}
              className={`cert-thumb${i === active ? ' is-active' : ''}`}
              onClick={() => go(i)}
            >
              <span className="cert-thumb-label">{c.name}</span>
            </button>
          ))}
        </div>
        <div className="cert-arrows">
          <button type="button" className="cert-arrow" onClick={prev} aria-label="Previous certificate">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" className="cert-arrow" onClick={next} aria-label="Next certificate">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
