import { Link, useParams } from 'react-router-dom';
import { getProjectBySlug, getNeighbors } from '../data/portfolioData';
import Seo from '../components/Seo';
import { pageGraph, projectNode } from '../lib/schema';
import Reveal from '../components/Reveal';
import Mask from '../components/Mask';
import { coverFor, coverOg, coverSources } from '../data/covers';
import metaDescriptions from '../data/metaDescriptions';
import { galleryFor } from '../data/gallery';
import ProjectGallery from '../components/ProjectGallery';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const neighbors = getNeighbors(slug);

  if (!project)
    return (
      <div className="wrap state-msg">
        <Seo title="Project not found | Shabi Mughal" description="This project does not exist." noindex />
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Couldn't find that project.</h1>
        <Link to="/projects" className="intro-cta" style={{ marginTop: '16px', display: 'inline-flex' }}>
          ← Back to all projects
        </Link>
      </div>
    );

  return (
    <>
      <Seo
        title={`${project.title} | Shabi Mughal`}
        description={metaDescriptions[project.slug] || project.shortDescription}
        image={coverOg(project)}
        type="article"
        jsonLd={pageGraph(
          [{ name: 'Home', path: '/' }, { name: 'Projects', path: '/projects' }, { name: project.title, path: `/projects/${project.slug}` }],
          projectNode(project)
        )}
      />
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
            <picture>
              {coverSources(project) && <source type="image/avif" srcSet={coverSources(project).avif} sizes="(max-width: 1440px) 100vw, 1440px" />}
              <img
                className="pd-cover-img"
                src={coverFor(project)}
                srcSet={coverSources(project) ? coverSources(project).webp : undefined}
                sizes="(max-width: 1440px) 100vw, 1440px"
                width="1600"
                height="900"
                alt={`${project.title} cover illustration`}
                loading="eager"
                fetchpriority="high"
              />
            </picture>
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
