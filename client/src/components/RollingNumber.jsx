import { useEffect, useState } from 'react';
import useReveal from '../hooks/useReveal';

// Slot-machine style counter. Every digit sits on its own vertical reel of stacked 0-9 digits;
// when the number scrolls into view the reels spin up and settle on the right digit one after
// another, left to right, with the edges of each reel fading out while it moves (like an
// odometer). The width of each column is taken from its final digit, so the finished number
// is spaced like normal text even though the font's digits differ in width.
//
// Props:
//   value   number (or numeric string) to land on
//   suffix  static text after the number, e.g. "+"
//   delay   ms to wait after it comes into view (use to stagger several counters)
//
// Visitors who prefer reduced motion see the final number straight away.

const SPIN_BASE_MS = 1500; // how long the leftmost reel takes to settle
const SPIN_STEP_MS = 260; // each reel further right takes this much longer
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'; // fast start, long smooth landing

function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function Reel({ digit, index, play, delay, instant }) {
  // Reels further right do more full laps before landing.
  const laps = Math.min(4, 2 + index);
  const total = (laps + 1) * 10;
  const target = laps * 10 + digit;
  const duration = SPIN_BASE_MS + index * SPIN_STEP_MS;
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (play && !instant) setRolling(true);
  }, [play, instant]);

  return (
    <span className={`roll-col${rolling ? ' is-rolling' : ''}`}>
      <span className="roll-ghost">{digit}</span>
      <span
        className="roll-reel"
        style={{
          transform: `translateY(${play ? -target : 0}em)`,
          transitionDuration: instant ? '0ms' : `${duration}ms`,
          transitionDelay: instant ? '0ms' : `${delay}ms`,
          transitionTimingFunction: EASE,
        }}
        onTransitionEnd={() => setRolling(false)}
      >
        {Array.from({ length: total }, (_, n) => (
          <span key={n} className="roll-cell">
            {n % 10}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function RollingNumber({ value, suffix = '', delay = 0, className = '' }) {
  const [ref, inView] = useReveal();
  const text = String(value);
  const instant = reducedMotion();

  // Index among the digit characters only (so "1,234" reels count 0..3, skipping the comma).
  let digitIndex = -1;

  return (
    <span ref={ref} className={`roll-num ${className}`.trim()} role="img" aria-label={`${text}${suffix}`}>
      {text.split('').map((ch, i) => {
        if (!/\d/.test(ch)) {
          return (
            <span key={`s${i}`} className="roll-static" aria-hidden="true">
              {ch}
            </span>
          );
        }
        digitIndex += 1;
        return (
          <Reel key={`d${i}`} digit={Number(ch)} index={digitIndex} play={inView} delay={delay} instant={instant} />
        );
      })}
      {suffix && (
        <span className="roll-static" aria-hidden="true">
          {suffix}
        </span>
      )}
    </span>
  );
}
