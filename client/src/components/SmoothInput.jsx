import { useCallback, useEffect, useRef, useState } from 'react';

// Text field with a "smooth caret": the browser's blinking caret is hidden and
// replaced by a thin line that glides to each new position as you type, delete
// or move with the arrow keys / mouse. Works for <input> and <textarea>.
//
// How it works: the caret's pixel position can't be read from the DOM, so an
// invisible "mirror" copy of the field is built with identical text styling,
// filled with the text before the caret, and a marker span at the end tells us
// the x / y. The caret element is then moved there with a CSS transform
// transition (see .smooth-caret in index.css).
//
// Props: `as` ('input' | 'textarea'), plus any normal input/textarea props.

const MIRROR_PROPS = [
  'direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
  'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderStyle',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust',
  'lineHeight', 'fontFamily', 'textAlign', 'textTransform', 'textIndent', 'textDecoration',
  'letterSpacing', 'wordSpacing', 'tabSize',
];

function measureCaret(el, isTextarea, wrapper) {
  const pos = el.selectionStart ?? el.value.length;
  const cs = window.getComputedStyle(el);

  const mirror = document.createElement('div');
  MIRROR_PROPS.forEach((p) => {
    mirror.style[p] = cs[p];
  });
  Object.assign(mirror.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    visibility: 'hidden',
    pointerEvents: 'none',
    whiteSpace: isTextarea ? 'pre-wrap' : 'pre',
    wordWrap: isTextarea ? 'break-word' : 'normal',
    overflow: 'hidden',
  });

  mirror.textContent = el.value.substring(0, pos);
  const marker = document.createElement('span');
  marker.textContent = '​'; // zero-width, keeps the line box alive at the end of the text
  mirror.appendChild(marker);
  wrapper.appendChild(mirror);

  const border = {
    left: parseFloat(cs.borderLeftWidth) || 0,
    top: parseFloat(cs.borderTopWidth) || 0,
  };
  const fontSize = parseFloat(cs.fontSize) || 16;
  const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.3;

  const x = marker.offsetLeft + border.left - el.scrollLeft;
  const y = marker.offsetTop + border.top - el.scrollTop;
  wrapper.removeChild(mirror);

  // Caret is a little shorter than the line, centred on it.
  const height = Math.round(Math.min(lineHeight, fontSize * 1.25));
  const top = y + (lineHeight - height) / 2;

  // Hide the caret when it has scrolled out of the visible box of the field.
  const visible =
    x >= border.left - 1 &&
    x <= el.clientWidth + border.left + 1 &&
    top >= border.top - 1 &&
    top + height <= el.clientHeight + border.top + 1;

  return { x, y: top, height, visible };
}

export default function SmoothInput({ as = 'input', className = '', onFocus, onBlur, onChange, ...rest }) {
  const isTextarea = as === 'textarea';
  const Tag = isTextarea ? 'textarea' : 'input';
  const wrapperRef = useRef(null);
  const fieldRef = useRef(null);
  const typingTimer = useRef(null);
  const rafRef = useRef(0);
  const justFocused = useRef(true);

  const [caret, setCaret] = useState({ x: 0, y: 0, height: 20, visible: false, instant: false });
  const [focused, setFocused] = useState(false);
  const [typing, setTyping] = useState(false);

  const update = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = fieldRef.current;
      const wrapper = wrapperRef.current;
      if (!el || !wrapper || document.activeElement !== el) return;
      // A highlighted range shows the normal selection; only a single point gets the caret.
      if (el.selectionStart !== el.selectionEnd) {
        setCaret((c) => (c.visible ? { ...c, visible: false } : c));
        return;
      }
      const next = measureCaret(el, isTextarea, wrapper);
      // Right after focus, place the caret without gliding in from its last position.
      setCaret({ ...next, instant: justFocused.current });
      justFocused.current = false;
    });
  }, [isTextarea]);

  // Keep the caret solid (not blinking) while the visitor is actively typing or moving it.
  const markActive = useCallback(() => {
    setTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setTyping(false), 520);
  }, []);

  useEffect(() => {
    if (!focused) return undefined;
    const el = fieldRef.current;

    const onSelection = () => {
      if (document.activeElement === el) {
        markActive();
        update();
      }
    };
    document.addEventListener('selectionchange', onSelection);
    el.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    if (ro) ro.observe(el);

    return () => {
      document.removeEventListener('selectionchange', onSelection);
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (ro) ro.disconnect();
    };
  }, [focused, update, markActive]);

  useEffect(
    () => () => {
      clearTimeout(typingTimer.current);
      cancelAnimationFrame(rafRef.current);
    },
    []
  );

  function handleFocus(e) {
    justFocused.current = true;
    setFocused(true);
    update();
    if (onFocus) onFocus(e);
  }

  function handleBlur(e) {
    setFocused(false);
    setCaret((c) => ({ ...c, visible: false }));
    if (onBlur) onBlur(e);
  }

  function handleChange(e) {
    markActive();
    update();
    if (onChange) onChange(e);
  }

  return (
    <div ref={wrapperRef} className={`smooth-caret-wrap${focused ? ' is-focused' : ''}`}>
      <Tag
        ref={fieldRef}
        className={`smooth-caret-field ${className}`.trim()}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...rest}
      />
      <span
        className={`smooth-caret${caret.visible && focused ? ' is-on' : ''}${typing ? ' is-typing' : ''}${caret.instant ? ' is-instant' : ''}`}
        aria-hidden="true"
        style={{ transform: `translate(${caret.x}px, ${caret.y}px)`, height: `${caret.height}px` }}
      />
    </div>
  );
}
