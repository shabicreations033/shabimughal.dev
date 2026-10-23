import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { allProjects } from '../data/portfolioData';
import Reveal from '../components/Reveal';
import RollingNumber from '../components/RollingNumber';
import TestimonialSlider from '../components/TestimonialSlider';
import CertCarousel from '../components/CertCarousel';
import Mask from '../components/Mask';
import SocialIcons from '../components/SocialIcons';
import { whenCurtainLifts } from '../components/PageCurtain';
import profile from '../data/profile';
import { coverFor } from '../data/covers';

export default function Home() {
  const [ready, setReady] = useState(false);
  const projects = allProjects.slice(0, 4);
  const totalProjects = allProjects.length;

  useEffect(() => {
    // On first landing, wait for the splash to finish and the page curtain to start lifting; otherwise play straight away.
    let t;
    let cancelled = false;
    whenCurtainLifts().then(() => {
      if (!cancelled) t = setTimeout(() => setReady(true), 250);
    });
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  // Hero headline = job title, split over two lines; watermark = the name.
  const years = new Date().getFullYear() - profile.stats.careerStartYear;
  const projectCount = totalProjects;
  const titleWords = profile.title.split(' ');
  const mid = Math.ceil(titleWords.length / 2);
  const titleLines = [titleWords.slice(0, mid).join(' '), titleWords.slice(mid).join(' ')].filter(Boolean);

  return (
    <>
      <section className={`hero ${ready ? 'is-ready' : ''}`}>
        <div className="wrap hero-stage">
          <div className="hero-watermark">
            <div className="hero-watermark-track">
              {Array(16).fill(profile.name).map((text, i) => (
                <span key={i}>
                  {text} <span className="hero-watermark-dot">•</span>
                </span>
              ))}
            </div>
          </div>

          <h1 className="hero-name" aria-label={profile.title}>
            {titleLines.map((line) => (
              <span className="word" key={line} aria-hidden="true">
                <span>{line}</span>
              </span>
            ))}
          </h1>

          <div className="hero-portrait">
            <img src="/shabi-hero-light.png" alt="Shabi Mughal" />
          </div>

          <SocialIcons />

          <div className="hero-role">
            <p className="hero-tagline">// {profile.name}</p>
            <p>Bold Ideas,<br />Flawless Execution.</p>
          </div>
        </div>

        <div className="wrap hero-scroll-cue">
          <span className="line" /> Scroll to explore
        </div>
      </section>

      <Reveal as="section" className="intro wrap">
        <h2><Mask>
          I architect scalable platforms across web and mobile — bridging complex system
          design with secure, user-facing applications.
        </Mask></h2>
        <div className="intro-meta">
          <dl>
            <dt>Based in</dt>
            <dd>{profile.location}</dd>
            <dt>Focus</dt>
            <dd>System architecture, full-stack platforms, data</dd>
            <dt>Availability</dt>
            <dd>{profile.availability}</dd>
          </dl>
          <Link to="/about" className="intro-cta">
            More about me →
          </Link>
        </div>
      </Reveal>

      <Reveal as="section" className="wrap stats-strip stagger" aria-label="At a glance">
        <div className="stat">
          <RollingNumber className="stat-num" value={years} suffix="+" />
          <span className="stat-label">years of project experience</span>
        </div>
        <div className="stat">
          <RollingNumber className="stat-num" value={projectCount} delay={120} />
          <span className="stat-label">projects built</span>
        </div>
        <div className="stat">
          <RollingNumber className="stat-num" value={profile.stats.stacks.length} delay={240} />
          <span className="stat-label">stacks: {profile.stats.stacks.join(', ')}</span>
        </div>
      </Reveal>

      <section className="wrap">
        <Reveal as="div" className="section-head">
          <h2><Mask>Highlighted work</Mask></h2>
          <span className="count">{String(allProjects.length).padStart(2, '0')} projects</span>
        </Reveal>

          <Reveal as="div" className="project-grid stagger">
            {projects.map((p, i) => (
              <Link key={p.slug} to={`/projects/${p.slug}`} className="project-card">
                <div className="thumb" style={coverFor(p) ? { '--cover': `url(${coverFor(p)})` } : undefined} />
                <span className="p-index">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="p-title">{p.title}</h3>
                  <div className="p-tags">
                    {p.category.slice(0, 2).map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </div>
                </div>
                <span className="p-arrow">↗</span>
              </Link>
            ))}
          </Reveal>
      </section>

      <section className="wrap" id="services">
        <Reveal as="div" className="section-head">
          <h2><Mask>Services</Mask></h2>
          <span className="count">{String(profile.services.length).padStart(2, '0')} offerings</span>
        </Reveal>
        <Reveal as="p" style={{ color: 'var(--ink-soft)', fontSize: '16px', maxWidth: '56ch', margin: '0 0 32px' }}>
          {profile.servicesIntro}
        </Reveal>
        <Reveal as="div" className="service-grid stagger">
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

      <section className="wrap" id="process">
        <Reveal as="div" className="section-head">
          <h2><Mask>How I work</Mask></h2>
          <span className="count">{String(profile.process.length).padStart(2, '0')} steps</span>
        </Reveal>
        <Reveal as="div" className="process-grid stagger">
          {profile.process.map((step, i) => (
            <div key={step.title} className="process-step">
              <span className="p-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="wrap" id="certifications">
        <Reveal as="div" className="section-head">
          <h2><Mask>Certifications</Mask></h2>
          <span className="count">{String(profile.certifications.length).padStart(2, '0')} credentials</span>
        </Reveal>
        <Reveal as="div">
          <CertCarousel items={profile.certifications} />
        </Reveal>
      </section>

      <section className="wrap" id="testimonials">
        <Reveal as="div" className="section-head">
          <h2><Mask>Testimonials</Mask></h2>
          <span className="count">{String(profile.testimonials.length).padStart(2, '0')} voices</span>
        </Reveal>
        <Reveal as="div">
          <TestimonialSlider items={profile.testimonials} />
        </Reveal>
      </section>

      <Reveal as="section" className="cta-band wrap">
        <h2><Mask>
          Let's build
          <br />
          something great.
        </Mask></h2>
        <Link to="/contact" className="cta-btn">
          Get in touch →
        </Link>
      </Reveal>
    </>
  );
}
