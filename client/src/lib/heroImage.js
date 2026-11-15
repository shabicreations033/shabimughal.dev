// The home-page portrait comes in two versions (one per theme). Only the one for the current theme
// is loaded; the other is fetched when the visitor reaches for the theme switch, so the swap is instant.
export const HERO = {
  light: { base: '/shabi-hero-light', full: 1145 },
  dark: { base: '/shabi-hero-dark', full: 1145 },
};

const warmed = new Set();
export function warmHero(theme) {
  if (typeof window === 'undefined' || warmed.has(theme)) return;
  warmed.add(theme);
  const img = new Image();
  img.decoding = 'async';
  img.srcset = `${HERO[theme].base}-480.webp 480w, ${HERO[theme].base}-768.webp 768w, ${HERO[theme].base}.webp 1145w`;
  img.sizes = '(max-width: 600px) 72vw, 46vw';
  img.src = `${HERO[theme].base}.webp`;
}
