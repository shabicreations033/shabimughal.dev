import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import profile from '../data/profile';

export default function Services() {
  return (
    <>
      <section className="wrap" style={{ paddingBottom: 0 }}>
        <Reveal as="p" className="eyebrow-plain">
          Services
        </Reveal>
        <Reveal
          as="h1"
          style={{ fontSize: 'clamp(32px,5.4vw,58px)', fontWeight: 600, letterSpacing: '-0.03em', margin: '0 0 8px' }}
        >
          What I can build for you
        </Reveal>
        <Reveal as="p" style={{ color: 'var(--ink-soft)', fontSize: '1rem', maxWidth: '56ch', margin: 0 }}>
          {profile.servicesIntro}
        </Reveal>
      </section>

      <section className="wrap">
        <Reveal as="div" className="service-grid">
          {profile.services.map((s, i) => (
            <article key={s.title} className="service-card">
              <span className="s-index">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <div className="service-tags">
                {s.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              {s.examples?.map((ex) => (
                <Link key={ex.slug} to={`/projects/${ex.slug}`} className="service-example">
                  See it in action: {ex.label} →
                </Link>
              ))}
            </article>
          ))}
        </Reveal>
      </section>

      <section className="wrap">
        <Reveal as="div" className="section-head">
          <h2>How I work</h2>
          <span className="count">{String(profile.process.length).padStart(2, '0')} steps</span>
        </Reveal>
        <Reveal as="div" className="process-grid">
          {profile.process.map((step, i) => (
            <div key={step.title} className="process-step">
              <span className="p-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <Reveal as="section" className="cta-band wrap">
        <h2>
          Have a project
          <br />
          in mind?
        </h2>
        <Link to="/contact" className="cta-btn">
          Let's talk →
        </Link>
      </Reveal>
    </>
  );
}
