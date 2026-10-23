import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SocialIcons from './SocialIcons';
import ThemeToggle from './ThemeToggle';
import ResumeButton from './ResumeButton';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="wrap site-header-bar">
          <NavLink to="/" target="_self" className="logo" aria-label="Shabi Mughal, home">
            <span className="logo-mark" aria-hidden="true" />
            <span className="logo-text" aria-hidden="true">Shabi Mughal</span>
          </NavLink>

          <nav className="nav-links">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} target="_self">
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header-actions">
            <ResumeButton className="resume-link--header" />
            <SocialIcons />
            <ThemeToggle />

            <button
              className="nav-toggle"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span />
            </button>
          </div>
        </div>
      </header>

      <nav className={`mobile-nav ${open ? 'is-open' : ''}`}>
        <ul>
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === "/"} target="_self" onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            </li>
          ))}
          <li className="mobile-nav-resume">
            <ResumeButton onClick={() => setOpen(false)} />
          </li>
        </ul>
      </nav>
    </>
  );
}
