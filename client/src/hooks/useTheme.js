import { useEffect, useState } from 'react';

// Current theme ('light' | 'dark'), read from <html data-theme>. The inline script in index.html sets
// that attribute before first paint, and ThemeToggle announces every change with a "themechange" event.
function read() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export default function useTheme() {
  const [theme, setTheme] = useState(read);
  useEffect(() => {
    const on = () => setTheme(read());
    on();
    window.addEventListener('themechange', on);
    return () => window.removeEventListener('themechange', on);
  }, []);
  return theme;
}
