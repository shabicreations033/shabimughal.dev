import { useCallback, useEffect, useRef, useState } from 'react';

// Testimonials: shows up to three at a time (two on tablets, one on phones). The previous / next
// buttons, the arrow keys and a swipe all slide the row by one card; the row glides with the same
// easing as the rest of the site and the cards that leave the window fade out. Nothing loops:
// the buttons dim at either end. Styles: `.tslider-*` in index.css.

function perView() {
  if (typeof window === 'undefined' || !window.matchMedia) return 3;
  if (window.matchMedia('(max-width: 768px)').matches) return 1;
  if (window.matchMedia('(max-width: 1000px)').matches) return 2;
  return 3;
}

export default function TestimonialSlider({ items }) {
  const n = items.length;
  const [per, setPer] = useState(perView);
  const [index, setIndex] = useState(0);
  const drag = useRef(null);
  const max = Math.max(0, n - per);

  useEffect(() => {
    const onResize = () => setPer(perView());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    setIndex((i) => Math.min(i, max));
  }, [max]);

  const go = useCallback((d) => setIndex((i) => Math.min(max, Math.max(0, i + d))), [max]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  };
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  const from = index + 1;
  const to = Math.min(n, index + per);

  return (
    <div className="tslider" style={{ '--per': per, '--i': index }}>
      <div
        className="tslider-viewport"
        role="region"
        aria-roledescription="carousel"
        aria-label="Testimonials"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { drag.current = null; }}
      >
        <div className="tslider-track">
          {items.map((t, i) => {
            const visible = i >= index && i < index + per;
            return (
              <figure key={t.name + i} className={`testimonial-card tslider-card${visible ? '' : ' is-out'}`} aria-hidden={!visible}>
                {t.topic && <p className="tslider-topic">{t.topic}</p>}
                <blockquote>“{t.quote}”</blockquote>
                <figcaption>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <div className="tslider-controls">
        <span className="tslider-count" aria-live="polite">
          {String(from).padStart(2, '0')}{to > from ? `–${String(to).padStart(2, '0')}` : ''} / {String(n).padStart(2, '0')}
        </span>
        <div className="cert-arrows">
          <button type="button" className="cert-arrow" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous testimonials">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <button type="button" className="cert-arrow" onClick={() => go(1)} disabled={index >= max} aria-label="Next testimonials">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
