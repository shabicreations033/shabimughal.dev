import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Reveal from './Reveal';

// Minimal project gallery: a quiet grid of thumbnails, and a full-size viewer on click.
// Items with a `srcDark` swap image with the theme (used for the Netflix charts).
function Pic({ item, className = '', ...rest }) {
  return (
    <>
      <img className={`${className}${item.srcDark ? ' vis-light' : ''}`.trim()} src={item.src} width={item.w} height={item.h} {...rest} />
      {item.srcDark && <img className={`${className} vis-dark`.trim()} src={item.srcDark} width={item.w} height={item.h} {...rest} />}
    </>
  );
}

export default function ProjectGallery({ gallery, projectTitle }) {
  const [open, setOpen] = useState(-1);
  const lastFocus = useRef(null);
  const closeRef = useRef(null);
  const { items, layout } = gallery;
  const ratio = gallery.ratio || (layout === 'phones' ? '1 / 2' : '2 / 1');
  const count = items.length;

  const show = (i) => {
    lastFocus.current = document.activeElement;
    setOpen(i);
  };
  const close = useCallback(() => {
    setOpen(-1);
    if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
  }, []);
  const step = useCallback((d) => setOpen((i) => (i < 0 ? i : (i + d + count) % count)), [count]);

  useEffect(() => {
    if (open < 0) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    if (closeRef.current) closeRef.current.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close, step]);

  const current = open >= 0 ? items[open] : null;

  return (
    <section className="wrap pd-gallery-section" style={{ paddingTop: 0 }}>
      <Reveal as="div" className="pd-gallery-head">
        <p className="eyebrow-plain">Visuals</p>
        <span className="pd-gallery-count">{String(count).padStart(2, '0')}</span>
      </Reveal>
      <Reveal as="div" className={`pd-gallery pd-gallery-${layout}`} style={{ '--shot-ratio': ratio }}>
        {items.map((item, i) => (
          <figure key={item.src} className="pd-shot">
            <button type="button" className="pd-shot-btn" onClick={() => show(i)} aria-label={`View ${item.title} full size`}>
              <span className={`pd-shot-frame${layout !== 'phones' && (item.w / item.h < 1.45 || item.w / item.h > 2.35) ? ' is-contain' : ''}`}>
                <Pic item={item} alt={`${projectTitle}: ${item.title}`} loading="lazy" decoding="async" />
              </span>
            </button>
            <figcaption>
              <span className="pd-shot-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="pd-shot-title">{item.title}</span>
            </figcaption>
          </figure>
        ))}
      </Reveal>

      {current && createPortal(
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${projectTitle} visuals`} onClick={close}>
          <div className="lightbox-top" onClick={(e) => e.stopPropagation()}>
            <span className="lightbox-count">
              {String(open + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
            <button ref={closeRef} type="button" className="lightbox-btn" onClick={close} aria-label="Close">
              Close
            </button>
          </div>
          <div className="lightbox-stage">
            <button type="button" className="lightbox-nav prev" aria-label="Previous visual" onClick={(e) => { e.stopPropagation(); step(-1); }}>
              ←
            </button>
            <div className="lightbox-img" onClick={(e) => e.stopPropagation()}>
              <Pic key={current.src} item={current} alt={`${projectTitle}: ${current.title}`} />
            </div>
            <button type="button" className="lightbox-nav next" aria-label="Next visual" onClick={(e) => { e.stopPropagation(); step(1); }}>
              →
            </button>
          </div>
          <p className="lightbox-cap" onClick={(e) => e.stopPropagation()}>
            <strong>{current.title}</strong> {current.caption}
          </p>
        </div>,
        document.body
      )}
    </section>
  );
}
