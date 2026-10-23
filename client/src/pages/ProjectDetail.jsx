import { Link, useParams } from 'react-router-dom';
import { getProjectBySlug, getNeighbors } from '../data/portfolioData';
import Reveal from '../components/Reveal';
import Mask from '../components/Mask';
import { coverFor } from '../data/covers';
import { galleryFor } from '../data/gallery';
import ProjectGallery from '../components/ProjectGallery';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const neighbors = getNeighbors(slug);

  if (!project)
    return (
      <div className="wrap state-msg">
        <p>Couldn't find that project.</p>
        <Link to="/projects" className="intro-cta" style={{ marginTop: '16px', display: 'inline-flex' }}>
          ← Back to all projects
        </Link>
      </div>
    );

  return (
    <>
      <section className="wrap pd-hero">
        <Reveal as="p" className="eyebrow-plain">
          Case study
        </Reveal>
        <Reveal as="h1" className="pd-title">
          <Mask>{project.title}</Mask>
        </Reveal>
        <Reveal as="dl" className="pd-meta">
          <div>
            <dt>Client</dt>
            <dd>{project.client || '—'}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{project.category.join(', ')}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{project.year || '—'}</dd>
          </div>
          <div>
            <dt>Live link</dt>
            <dd>
              {project.liveLink ? (
                <a href={project.liveLink} target="_blank" rel="noreferrer">
                  View ↗
                </a>
              ) : (
                '—'
              )}
            </dd>
          </div>
        </Reveal>
      </section>

      <section className="wrap" style={{ paddingTop: 0 }}>
        <Reveal as="div" className="pd-cover reveal-clip">
          {coverFor(project) ? (
            <img className="pd-cover-img" src={coverFor(project)} alt={`${project.title} cover illustration`} loading="eager" />
          ) : (
            <div className="grayscale-fill" />
          )}
        </Reveal>
        <Reveal as="div" className="pd-body">
          <div>
            <h3>Overview</h3>
            <p>{project.overview}</p>
            <h3>Approach</h3>
            <p>{project.approach}</p>
          </div>
          <div>
            <h3>Outcome</h3>
            <p>{project.outcome}</p>
            <h3>Technologies</h3>
            <div className="pd-tech">
              {project.technologies.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {(project.problem || project.solution) && (
        <section className="wrap pd-ps-section" style={{ paddingTop: 0 }}>
          <Reveal as="div" className="pd-ps stagger">
            {project.problem && (
              <div className="pd-ps-card">
                <span className="pd-ps-label">The problem</span>
                <h3>What needed solving</h3>
                <p>{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div className="pd-ps-card">
                <span className="pd-ps-label">The solution</span>
                <h3>How it was solved</h3>
                <p>{project.solution}</p>
              </div>
            )}
          </Reveal>
        </section>
      )}

      {galleryFor(project) && <ProjectGallery gallery={galleryFor(project)} projectTitle={project.title} />}

      <section className="wrap">
        <div className="pd-nav">
          {neighbors.prev && (
            <Link to={`/projects/${neighbors.prev.slug}`}>
              <span className="dir">Previous</span>
              <span className="title">← {neighbors.prev.title}</span>
            </Link>
          )}
          {neighbors.next && (
            <Link to={`/projects/${neighbors.next.slug}`} className="next">
              <span className="dir">Next</span>
              <span className="title">{neighbors.next.title} →</span>
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
