import { useRef, useState } from 'react';
import profile from '../data/profile';

// Two-sided personal branding card. Mouse: hover flips it. Touch / keyboard: tap or Enter flips it.
const LOGO_VIEWBOX = '-20 -3 700 740';
const LOGO_PATHS = ['M220 146 L219 147 L220 196 L495 196 L512 199 L532 207 L547 217 L561 230 L574 248 L584 272 L588 299 L587 317 L584 331 L573 355 L566 365 L550 381 L540 388 L518 398 L501 402 L491 402 L490 403 L220 403 L219 407 L219 436 L220 437 L219 452 L220 453 L221 452 L230 453 L250 453 L251 452 L265 452 L266 453 L280 453 L281 452 L315 452 L316 453 L318 452 L418 452 L419 453 L459 452 L460 453 L496 453 L512 456 L529 462 L546 472 L560 484 L573 500 L581 515 L586 529 L589 545 L589 574 L587 585 L577 610 L567 625 L559 634 L546 645 L526 656 L506 662 L490 664 L220 664 L219 665 L220 692 L219 693 L220 712 L219 713 L220 714 L497 714 L520 711 L536 707 L552 701 L573 690 L591 677 L606 662 L623 638 L636 608 L641 587 L642 567 L643 566 L642 541 L639 523 L634 506 L623 482 L612 465 L599 450 L573 429 L592 414 L607 398 L615 387 L629 360 L638 327 L639 286 L637 271 L627 238 L621 225 L603 199 L586 182 L570 170 L542 156 L513 148 L494 146Z M104 33 L88 43 L71 57 L53 78 L44 92 L33 115 L24 148 L22 166 L23 194 L27 216 L33 234 L43 254 L55 271 L67 284 L85 298 L84 300 L69 311 L55 325 L40 345 L28 368 L18 402 L16 416 L17 459 L24 487 L37 514 L53 535 L63 545 L80 558 L93 566 L111 574 L142 582 L160 584 L421 584 L422 583 L422 536 L421 535 L161 535 L141 531 L130 527 L110 516 L99 507 L88 495 L81 485 L75 473 L69 455 L67 442 L67 420 L69 413 L69 407 L74 390 L80 377 L90 362 L101 350 L120 336 L136 328 L149 324 L166 321 L421 321 L422 318 L421 312 L422 276 L421 272 L164 272 L144 269 L132 265 L120 259 L107 250 L95 238 L85 224 L78 209 L73 189 L73 158 L82 128 L98 103 L119 84 L140 73 L164 67 L421 67 L422 66 L422 20 L421 19 L422 17 L421 16 L159 16 L133 21 L116 27Z'];

function LogoSvg({ size }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} width={size} height={size} fill="currentColor" fillRule="evenodd" aria-hidden="true">
      {LOGO_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

const host = profile.siteUrl.replace(/^https?:\/\//, '');
const REST = { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, opacity: 0 };

export default function ContactCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState(REST);
  const cardRef = useRef(null);
  const mouseDown = useRef(false);

  const isMouse = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function handleMouseMove(e) {
    if (!cardRef.current || !isMouse()) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTilt({
      rotateX: ((y - rect.height / 2) / (rect.height / 2)) * -5,
      rotateY: ((x - rect.width / 2) / (rect.width / 2)) * 5,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      opacity: 0.07,
    });
  }

  function handleMouseLeave() {
    if (!isMouse()) return;
    setTilt((t) => ({ ...t, rotateX: 0, rotateY: 0, opacity: 0 }));
    setIsFlipped(false);
  }

  const glare = { opacity: tilt.opacity, background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, var(--ink), transparent 65%)` };
  const stopFlip = (e) => e.stopPropagation();

  return (
    <div
      ref={cardRef}
      className="bcard-scene"
      onPointerDown={(e) => { mouseDown.current = e.pointerType === 'mouse'; }}
      onClick={() => {
        // With a mouse, hover already flips the card; a click must not undo it.
        if (isMouse() && mouseDown.current) return;
        setIsFlipped((f) => !f);
      }}
      onMouseEnter={() => { if (isMouse()) setIsFlipped(true); }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label="Personal branding card. Press to flip it."
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsFlipped((f) => !f);
        }
      }}
    >
      <div className="bcard-tilt" style={{ transform: tilt.opacity ? `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)` : 'none' }}>
        <div className={`bcard-inner ${isFlipped ? 'is-flipped' : ''}`}>
          {/* ================= FRONT (01 / 02) ================= */}
          <div className="bcard-face bcard-front" aria-hidden={isFlipped}>
            <div className="bcard-glare" style={glare} />
            <div className="bcard-bar">
              <span>PERSONAL BRANDING</span>
            </div>

            <div className="bcard-body-front">
              <div className="bcard-portrait-col">
                <img src="/shabi-hero-light.webp" alt={profile.name} className="bcard-portrait-img bcard-portrait-img--light" />
                <img src="/shabi-hero-dark.webp" alt="" aria-hidden="true" className="bcard-portrait-img bcard-portrait-img--dark" />
              </div>

              <div className="bcard-info-col">
                <div className="bcard-sm-badge"><LogoSvg size={18} /></div>
                <h3 className="bcard-name">{profile.name}</h3>
                <p className="bcard-role">{profile.title}</p>
                <div className="bcard-mid-divider" />
                <p className="bcard-motto">Bold ideas, flawless execution.</p>
                <p className="bcard-location">{profile.location}</p>
                <a href={profile.siteUrl} target="_blank" rel="noopener noreferrer" tabIndex={isFlipped ? -1 : 0} onClick={stopFlip} className="bcard-link">
                  {host} <span>↗</span>
                </a>
              </div>
            </div>

            <div className="bcard-bar">
              <span>{profile.name.toUpperCase()}</span>
              <span>FULL STACK ENGINEERING</span>
            </div>
          </div>

          {/* ================= BACK (02 / 02) ================= */}
          <div className="bcard-face bcard-back" aria-hidden={!isFlipped}>
            <div className="bcard-glare" style={glare} />
            <div className="bcard-bar">
              <span>PERSONAL SIGNATURE</span>
            </div>

            <div className="bcard-body-back">
              <div className="bcard-back-logo"><LogoSvg size={44} /></div>
              <div className="bcard-short-rule" />
              <h4 className="bcard-back-name">{profile.name.toUpperCase()}</h4>
              <p className="bcard-back-title">{profile.title.toUpperCase()}</p>
            </div>

            <div className="bcard-bar">
              <span>DESIGN · DEVELOPMENT · ARCHITECTURE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
