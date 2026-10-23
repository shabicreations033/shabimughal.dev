import profile from '../data/profile';

// Download button for the resume PDF. Renders nothing if no resume is configured.
export default function ResumeButton({ className = '', onClick }) {
  if (!profile.resume) return null;
  return (
    <a
      href={profile.resume}
      download="Muhammad-Shoaib-Saleem-Resume.pdf"
      className={`resume-link ${className}`.trim()}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v12m0 0-5-5m5 5 5-5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
      </svg>
      Resume
    </a>
  );
}
