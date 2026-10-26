import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import Mask from '../components/Mask';
import { certLink } from '../components/CertCarousel';
import profile from '../data/profile';

const LANGUAGE_ICONS = {
  JavaScript: 'javascript',
  Python: 'python',
  'C++': 'cplusplus',
  'C#': 'csharp',
  HTML5: 'html5',
  CSS3: 'css3',
  'React.js': 'reactjs',
  Bootstrap: 'bootstrap',
  'Chart.js': 'chartjs',
  'Node.js': 'nodejs',
  'Express.js': 'expressjs',
  'REST APIs': 'restapis',
  MongoDB: 'mongodb',
  Flutter: 'flutter',
  Dart: 'dart',
};

function TechIcon({ name }) {
  const slug = LANGUAGE_ICONS[name];
  return <img src={`/icons/${slug}.png`} alt="" aria-hidden="true" className="lang-float-icon" loading="lazy" decoding="async" />;
}

const skillGroups = [
  { label: 'Frontend', items: profile.skills.frontend },
  { label: 'Backend', items: profile.skills.backend },
  { label: 'Database', items: profile.skills.database },
  { label: 'Firebase', items: profile.skills.firebase },
  { label: 'APIs & Services', items: profile.skills.apis },
  { label: 'Mobile', items: profile.skills.mobile },
  { label: 'Tools', items: profile.skills.tools },
];

// Combined, deduplicated list for the floating marquee — languages plus
// the frontend/backend/database/mobile stack, matching the reference image.
const MARQUEE_ITEMS = [...new Set([
  ...profile.skills.languages,
  ...profile.skills.frontend,
  ...profile.skills.backend,
  ...profile.skills.database,
  ...profile.skills.mobile,
])];

export default function About() {
  return (
    <>
      <Seo
        title={`About | ${profile.name}, ${profile.title}`}
        description={`Skills, education, certifications and experience of ${profile.name}, a ${profile.title} based in ${profile.location}.`}
      />
      <section className="wrap" style={{ paddingBottom: 0 }}>
        <Reveal as="p" className="eyebrow-plain">
          About
        </Reveal>
        <Reveal as="div" className="split-block">
          <div className="about-portrait">
            <img
              src="/shabi-about-nobg.webp"
              decoding="async"
              alt="Shabi Mughal"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
            />
          </div>
          <div>
            <Reveal as="h1" className="page-title page-title--long">
              <Mask>{profile.aboutHeadline}</Mask>
            </Reveal>
            {profile.aboutBio.map((para, i) => (
              <p key={i} style={{ color: 'var(--ink-soft)', fontSize: '1rem', maxWidth: '60ch', marginBottom: '16px' }}>
                {para}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="wrap">
        <Reveal as="div" className="section-head">
          <h2><Mask>Core skills</Mask></h2>
          <span className="count">{profile.skills.core.length} areas</span>
        </Reveal>
        <Reveal as="div" className="skill-tags" style={{ marginBottom: '56px' }}>
          {profile.skills.core.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </Reveal>

        <Reveal as="div" style={{ marginBottom: '56px' }}>
          <h3 className="about-label" style={{ color: 'var(--ink-faint)', margin: '0 0 16px' }}>Tech stack</h3>
          <div className="lang-marquee">
            <div className="lang-marquee-track">
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <div className="lang-float-card" key={`${item}-${i}`}>
                  <TechIcon name={item} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="div" className="split-block" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
          {skillGroups.map((group) => (
            <div key={group.label}>
              <h3 className="about-label" style={{ color: 'var(--ink-faint)', margin: '0 0 12px' }}>{group.label}</h3>
              <ul className="tool-list" style={{ gridTemplateColumns: '1fr' }}>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="wrap">
        <Reveal as="div" className="section-head">
          <h2><Mask>Education</Mask></h2>
          <span className="count">{profile.education.length} degrees</span>
        </Reveal>
        <Reveal as="div">
          {profile.education.map((edu) => (
            <div className="timeline-item" key={edu.degree}>
              <span className="t-year">{edu.years}</span>
              <div>
                <h3>{edu.degree}</h3>
                <p>{edu.institution}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="wrap" id="certifications">
        <Reveal as="div" className="section-head">
          <h2><Mask>Certifications &amp; Trainings</Mask></h2>
          <span className="count">{String(profile.certifications.length).padStart(2, '0')} credentials</span>
        </Reveal>
        <Reveal as="div" className="cert-grid stagger">
          {profile.certifications.map((c) => {
            const link = certLink(c);
            return (
              <article className="cert-card" key={c.slug}>
                <p className="cert-card-field">{c.field}</p>
                <h3>{c.title}</h3>
                <p className="cert-card-meta">{[c.issuer, c.kind].filter(Boolean).join(' · ')}</p>
                <dl className="cert-card-facts">
                  {c.issued && (
                    <div>
                      <dt>Issued</dt>
                      <dd>{c.issued}</dd>
                    </div>
                  )}
                  {c.via && (
                    <div>
                      <dt>Platform</dt>
                      <dd>{c.via}</dd>
                    </div>
                  )}
                </dl>
                <a className="cert-card-link" href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </article>
            );
          })}
        </Reveal>
      </section>

      <section className="wrap">
        <Reveal as="div" className="section-head">
          <h2><Mask>Experience</Mask></h2>
          <span className="count">Project-based</span>
        </Reveal>
        <Reveal as="div">
          {profile.experience.map((exp) => (
            <div className="timeline-item" key={exp.role}>
              <span className="t-year">{exp.years}</span>
              <div>
                <h3>{exp.role}</h3>
                <p>{exp.description}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      <Reveal as="section" className="cta-band wrap">
        <h2><Mask>
          Like what
          <br />
          you see?
        </Mask></h2>
        <Link to="/contact" className="cta-btn">
          Get in touch →
        </Link>
      </Reveal>
    </>
  );
}
