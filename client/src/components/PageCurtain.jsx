import { useEffect, useRef, useState } from 'react';

// Landing-page splash + reveal, pure CSS. On the first visit to the home page ("/") the screen opens on
// the curtain colour with the logo drawing itself as an outline and filling in, then sliding left as
// "SHABI MUGHAL" appears beside it: every letter outline starts drawing at once (first as scattered dots,
// then as strokes that run round each letter), and the letters then fill in solid, while a thin
// progress line fills along the bottom. The finished lockup rests in the centre, then the screen breaks
// into vertical bars that lift away one after another, right to left, uncovering the home page from the
// bottom up. Plays once, never on other pages or in-site navigation, and is skipped for visitors who
// prefer reduced motion.
//
// Timing: every splash delay / duration is a multiple of one unit, `--t` on ".curtain" in index.css.
// The bars start LIFT_AT of those units after the splash begins (the lockup is finished by about 3.3).
// Size: the lockup is sized by one font-size on ".curtain-lockup" (about 19% of the screen width).

const LIFT_AT = 4.1; // in --t units
const BARS = 5;

// The logo (public/logo.png) and the name "SHABI MUGHAL" (Urbanist 600, from public/fonts) traced to vector
// outlines, so both can be drawn with a stroke and then filled.
const LOGO_PATH =
  "M220 146 L219 147 L220 196 L495 196 L512 199 L532 207 L547 217 L561 230 L574 248 L584 272 L588 299 L587 317 L584 331 L573 355 L566 365 L550 381 L540 388 L518 398 L501 402 L491 402 L490 403 L220 403 L219 407 L219 436 L220 437 L219 452 L220 453 L221 452 L230 453 L250 453 L251 452 L265 452 L266 453 L280 453 L281 452 L315 452 L316 453 L318 452 L418 452 L419 453 L459 452 L460 453 L496 453 L512 456 L529 462 L546 472 L560 484 L573 500 L581 515 L586 529 L589 545 L589 574 L587 585 L577 610 L567 625 L559 634 L546 645 L526 656 L506 662 L490 664 L220 664 L219 665 L220 692 L219 693 L220 712 L219 713 L220 714 L497 714 L520 711 L536 707 L552 701 L573 690 L591 677 L606 662 L623 638 L636 608 L641 587 L642 567 L643 566 L642 541 L639 523 L634 506 L623 482 L612 465 L599 450 L573 429 L592 414 L607 398 L615 387 L629 360 L638 327 L639 286 L637 271 L627 238 L621 225 L603 199 L586 182 L570 170 L542 156 L513 148 L494 146Z M104 33 L88 43 L71 57 L53 78 L44 92 L33 115 L24 148 L22 166 L23 194 L27 216 L33 234 L43 254 L55 271 L67 284 L85 298 L84 300 L69 311 L55 325 L40 345 L28 368 L18 402 L16 416 L17 459 L24 487 L37 514 L53 535 L63 545 L80 558 L93 566 L111 574 L142 582 L160 584 L421 584 L422 583 L422 536 L421 535 L161 535 L141 531 L130 527 L110 516 L99 507 L88 495 L81 485 L75 473 L69 455 L67 442 L67 420 L69 413 L69 407 L74 390 L80 377 L90 362 L101 350 L120 336 L136 328 L149 324 L166 321 L421 321 L422 318 L421 312 L422 276 L421 272 L164 272 L144 269 L132 265 L120 259 L107 250 L95 238 L85 224 L78 209 L73 189 L73 158 L82 128 L98 103 L119 84 L140 73 L164 67 L421 67 L422 66 L422 20 L421 19 L422 17 L421 16 L159 16 L133 21 L116 27Z";

// Each letter shape (and each counter inside a letter) is its own sub-path, so they all draw in parallel.
const WORD_PATH =
  "M618.8 26Q504.2 26 398.2 -10.1Q292.2 -46.1 213 -113.5Q133.7 -180.8 100 -274.2L295.2 -346.6Q312.1 -298.6 360.4 -261.5Q408.7 -224.5 476.3 -203.2Q544 -182 618.8 -182Q699.5 -182 769.7 -207.8Q840 -233.7 883.3 -279.9Q926.7 -326.1 926.7 -388.4Q926.7 -451.7 881.5 -492.7Q836.4 -533.7 765.7 -557.7Q694.9 -581.7 618.8 -594.3Q471.9 -618 355.5 -664.2Q239 -710.4 171.5 -793.3Q104 -876.3 104 -1008.7Q104 -1134 175.7 -1227Q247.4 -1320 364.9 -1371.6Q482.4 -1423.1 618.8 -1423.1Q731.6 -1423.1 837.5 -1387.6Q943.4 -1352.2 1023.6 -1284.6Q1103.7 -1217.1 1138.7 -1120.9L942.4 -1050Q925.5 -1098.5 877.2 -1135.4Q828.9 -1172.2 761.5 -1193Q694.1 -1213.7 618.8 -1213.7Q539.5 -1214.7 469.5 -1188.4Q399.6 -1162 355.8 -1115.8Q312 -1069.6 312 -1008.7Q312 -934 352.9 -894.8Q393.8 -855.7 463.3 -837.2Q532.8 -818.7 618.8 -804Q757 -781.8 874.6 -731Q992.1 -680.2 1063.4 -595.6Q1134.7 -511.1 1134.7 -388.4Q1134.7 -263.7 1063.2 -170.4Q991.7 -77.1 874.4 -25.5Q757.2 26 618.8 26ZM2260.4 -1400H2468.4V0H2260.4V-646H1627V0H1419V-1400H1627V-854H2260.4ZM3236.6 -1400H3480.3L3989.4 0H3768.6L3671.9 -266H3045.5L2948.8 0H2728ZM3121.6 -474H3595.3L3358 -1124.3ZM4249 0V-1400H4746.2Q4853.7 -1400 4941.3 -1356Q5028.8 -1311.9 5080.4 -1229.2Q5132.1 -1146.5 5132.1 -1031.8Q5132.1 -976.3 5114.2 -922.4Q5096.3 -868.4 5063.1 -827.3Q5029.9 -786.1 4983.1 -769Q5047.2 -753 5089.7 -711.6Q5132.1 -670.2 5157.1 -615Q5182 -559.8 5192.4 -501Q5202.7 -442.2 5202.7 -389.5Q5202.7 -276.6 5148.8 -188.6Q5095 -100.7 5004.7 -50.3Q4914.5 0 4804.8 0ZM4457 -179.8H4784.9Q4849 -179.8 4901.3 -212.1Q4953.5 -244.3 4984.8 -300.6Q5016 -356.8 5016 -427.9Q5016 -490 4984.8 -545.3Q4953.5 -600.6 4901.3 -634.9Q4849 -669.3 4784.9 -669.3H4457ZM4457 -846.2H4724Q4806.5 -846.2 4865.3 -896.3Q4924.1 -946.4 4924.1 -1033.3Q4924.1 -1126.3 4865.3 -1172.8Q4806.5 -1219.3 4724 -1219.3H4457ZM5493 0V-1400H5701V0ZM6571 0 6842.4 -1400H7009.9L7368.7 -456.7L7726.4 -1400H7893.9L8165.9 0H7953.6L7772.5 -937.1L7438.2 -52.9H7298.1L6963.8 -937.1L6782.7 0ZM9020.5 26Q8852.5 26 8727.7 -56Q8602.9 -138 8534.5 -276.5Q8466 -415 8466 -584V-1400H8674V-584Q8674 -474.3 8714.6 -382.8Q8755.2 -291.3 8832.7 -236.6Q8910.2 -182 9020.5 -182Q9132.9 -182 9209.9 -236.7Q9286.9 -291.4 9326.5 -382.9Q9366.1 -474.4 9366.1 -584V-1400H9574.1V-584Q9574.1 -457 9535.1 -346.5Q9496.1 -236 9423.3 -152Q9350.4 -68 9248.5 -21Q9146.5 26 9020.5 26ZM10522.6 26Q10377.3 26 10251.8 -30.7Q10126.3 -87.4 10032.7 -187.9Q9939.2 -288.4 9886.6 -420.1Q9834 -551.8 9834 -701.4Q9834 -857.8 9890.1 -989.8Q9946.1 -1121.8 10043.2 -1219.5Q10140.2 -1317.1 10264.7 -1370.8Q10389.2 -1424.6 10526.3 -1424.6Q10680.9 -1424.6 10823.8 -1352.5Q10966.6 -1280.5 11072.6 -1136.6L10886.8 -1036.3Q10814.9 -1126 10719.4 -1172Q10623.9 -1218 10524 -1218Q10427.1 -1218 10340.2 -1178.7Q10253.2 -1139.3 10186.1 -1068.5Q10119.1 -997.7 10080.5 -903.2Q10042 -808.7 10042 -697.7Q10042 -590.7 10079.7 -497.1Q10117.4 -403.4 10183.7 -332.7Q10250.1 -261.9 10337.8 -222Q10425.4 -182 10525.4 -182Q10599 -182 10667 -206Q10734.9 -230 10793.4 -274.5Q10851.9 -319.1 10896 -381.1Q10940 -443.1 10965.8 -519.1H10668.6V-702.6H11210Q11211.7 -552.5 11158.6 -420.6Q11105.5 -288.7 11010.8 -188.2Q10916.1 -87.7 10791.2 -30.8Q10666.4 26 10522.6 26ZM12311.4 -1400H12519.4V0H12311.4V-646H11678V0H11470V-1400H11678V-854H12311.4ZM13287.6 -1400H13531.3L14040.4 0H13819.6L13722.9 -266H13096.5L12999.8 0H12779ZM13172.6 -474H13646.3L13409 -1124.3ZM14300 0V-1400H14508V-208H15111.5V0Z";

const LOGO_CONTOURS = LOGO_PATH.split(/(?=M)/).filter(Boolean);
const WORD_CONTOURS = WORD_PATH.split(/(?=M)/).filter(Boolean);

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Decided once, when the page first loads.
let curtainPending = typeof window !== 'undefined' && window.location.pathname === '/' && !prefersReducedMotion();
if (curtainPending) document.documentElement.classList.add('has-curtain');

// True while the curtain is still on screen.
export function curtainIsPending() {
  return curtainPending;
}

// Resolves when the bars start to lift (immediately if there is no curtain); the hero waits for it.
let resolveLift;
const liftPromise = new Promise((resolve) => {
  resolveLift = resolve;
});
export function whenCurtainLifts() {
  return curtainPending ? liftPromise : Promise.resolve();
}

export default function PageCurtain() {
  const [active, setActive] = useState(curtainPending);
  const [lifting, setLifting] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const unit = parseFloat(getComputedStyle(rootRef.current).getPropertyValue('--t')) || 1; // seconds
    const id = setTimeout(() => {
      document.documentElement.classList.add('curtain-lifting');
      setLifting(true);
      resolveLift();
    }, LIFT_AT * unit * 1000);
    return () => clearTimeout(id);
  }, [active]);

  if (!active) return null;
  return (
    <div
      ref={rootRef}
      className={`curtain${lifting ? ' is-lifting' : ''}`}
      aria-hidden="true"
      onAnimationEnd={(e) => {
        // done when the last bar (the leftmost one) has finished lifting
        if (e.animationName !== 'curtainBar' || e.target.dataset.last !== 'true') return;
        curtainPending = false;
        document.documentElement.classList.remove('has-curtain', 'curtain-lifting');
        setActive(false);
      }}
    >
      {Array.from({ length: BARS }, (_, i) => (
        <span
          key={i}
          className="curtain-bar"
          data-last={i === 0 ? 'true' : 'false'}
          style={{ left: `${(i * 100) / BARS}%`, width: `calc(${100 / BARS}% + 1px)`, '--i': BARS - 1 - i }}
        />
      ))}

      <div className="curtain-lockup">
        <div className="curtain-row">
          <svg className="curtain-mark" viewBox="0 0 658 730">
            <path className="curtain-mark-fill" d={LOGO_PATH} fillRule="evenodd" />
            {LOGO_CONTOURS.map((d, k) => (
              <path key={k} className="curtain-mark-stroke" d={d} pathLength="1" />
            ))}
          </svg>
          <svg className="curtain-word" viewBox="-30 -1440 15271 1480">
            <path className="curtain-word-fill" d={WORD_PATH} />
            {WORD_CONTOURS.map((d, k) => (
              <path key={k} className="curtain-word-stroke" d={d} pathLength="1" />
            ))}
          </svg>
        </div>
      </div>

      <div className="curtain-line">
        <span />
      </div>
    </div>
  );
}
