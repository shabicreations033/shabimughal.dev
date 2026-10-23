import { useEffect, useRef, useState } from 'react';

// A themeable dropdown replacing native <select> — needed because a real
// <select>'s open option list is rendered by the OS/browser itself, so CSS
// can't reach it (that's why the popup always shows system blue-highlight
// and system font no matter what the page's styles say). This version is
// plain divs, so every pixel is styleable and matches the site's theme.
export default function CustomSelect({ name, value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectOption(opt) {
    onChange({ target: { name, value: opt } });
    setIsOpen(false);
  }

  return (
    <div className="custom-select" ref={wrapperRef}>
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setIsOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={value ? '' : 'custom-select-placeholder'}>{value || placeholder}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={`custom-select-chevron ${isOpen ? 'is-open' : ''}`}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <ul className="custom-select-list" role="listbox">
          {options.map((opt) => (
            <li
              key={opt}
              role="option"
              aria-selected={opt === value}
              className={`custom-select-option ${opt === value ? 'is-selected' : ''}`}
              onClick={() => selectOption(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
