import profile from '../data/profile';

const githubSvg = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.6 2.8 5.5 3.1 5.5 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.1 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </svg>
);

const icons = {
  github: githubSvg,
  githubTaskpoint: githubSvg,
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 11v5M8 8v.01M12 16v-5M12 11c0-1.3.9-2 2-2s2 .8 2 2v5" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="1" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.8a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.8.1 4.1 4.1 0 0 0 3.8 2.9A8.3 8.3 0 0 1 2 18.6a11.6 11.6 0 0 0 6.3 1.9c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1" />
    </svg>
  ),
};

// Display labels — falls back to a capitalized key if a name isn't listed here,
// but anything with a compound key (like githubTaskpoint) needs an explicit entry
// so it doesn't render as one smashed-together word.
const LABELS = {
  github: 'GitHub',
  githubTaskpoint: 'Featured Project: TaskPoint',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  twitter: 'Twitter',
};

// Some accounts (like a second GitHub for a specific project) only make sense
// with a text label to disambiguate them — shown in the footer/contact list,
// but skipped in the icon-only hero row where two identical glyphs would look
// like a rendering bug rather than two different links.
const ICON_ONLY_EXCLUDE = ['githubTaskpoint'];

export default function SocialIcons({ variant = 'circle' }) {
  const allLinks = Object.entries(profile.socials).filter(([, url]) => url);
  const links = variant === 'circle' ? allLinks.filter(([key]) => !ICON_ONLY_EXCLUDE.includes(key)) : allLinks;

  if (links.length === 0) return null;

  if (variant === 'text') {
    return (
      <div className="footer-links">
        {links.map(([key, url]) => (
          <a key={key} href={url} target="_blank" rel="noreferrer">
            {LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1)}
          </a>
        ))}
      </div>
    );
  }

  return (
    <ul className="hero-social">
      {links.map(([key, url]) => (
        <li key={key}>
          <a href={url} target="_blank" rel="noreferrer" aria-label={LABELS[key] || key}>
            {icons[key]}
          </a>
        </li>
      ))}
    </ul>
  );
}
