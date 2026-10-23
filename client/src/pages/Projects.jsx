import { Link } from 'react-router-dom';
import { allProjects as projects } from '../data/portfolioData';
import Reveal from '../components/Reveal';
import Mask from '../components/Mask';
import { coverFor } from '../data/covers';

// Short display names for the coverflow strip — full titles are too long to
// read comfortably on a small tilted card, so each project gets a shorter tag.
const SHORT_NAMES = {
  'taskpoint-labour-marketplace': 'TaskPoint',
  'ai-smart-warehouse-delivery-management': 'AI Warehouse',
  'social-media-analytical-dashboard': 'Social Dashboard',
  'safestate-cryptography-suite': 'SafeState',
  'fluxlex-lexical-analyzer': 'FluxLEX',
  'techfix-accounting-system': 'TechFix',
  'deadlock-detection-rag-wfg': 'Deadlock Detection',
  'netflix-data-analysis': 'Netflix Analysis',
};

export default function Projects() {
  return (
    <>
      <section className="wrap" style={{ paddingBottom: 0 }}>
        <Reveal as="p" className="eyebrow-plain">
          Projects
        </Reveal>
        <Reveal
          as="h1"
          className="page-title"
        >
          <Mask>All projects</Mask>
        </Reveal>
        <Reveal as="p" style={{ color: 'var(--ink-soft)', fontSize: '16px', maxWidth: '56ch', margin: 0 }}>
          A running list of full-stack, mobile, and systems projects — spanning web platforms, secure backends, and data-driven applications.
        </Reveal>
      </section>

      <section className="wrap">
        {(
          <Reveal as="div" className="coverflow" style={{ marginBottom: '24px' }}>
            <div className="coverflow-track">
              {[...projects, ...projects].map((p, i) => (
                <Link
                  key={`${p.slug}-${i}`}
                  to={`/projects/${p.slug}`}
                  className={`coverflow-card${coverFor(p) ? ' has-cover' : ''}`}
                  style={coverFor(p) ? { '--cover': `url(${coverFor(p)})` } : undefined}
                >
                  {SHORT_NAMES[p.slug] || p.title}
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        {(
          <Reveal as="div" className="stagger">
            {projects.map((p, i) => (
              <Link key={p.slug} to={`/projects/${p.slug}`} className="project-row">
                <span className="r-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="r-title">{p.title}</span>
                <span className="r-tag">{p.category.join(' · ')}</span>
                <span className="r-year">{p.year || '—'}</span>
              </Link>
            ))}
          </Reveal>
        )}
      </section>

      <Reveal as="section" className="cta-band wrap">
        <h2><Mask>
          Interested in
          <br />
          working together?
        </Mask></h2>
        <Link to="/contact" className="cta-btn">
          Let's talk →
        </Link>
      </Reveal>
    </>
  );
}
