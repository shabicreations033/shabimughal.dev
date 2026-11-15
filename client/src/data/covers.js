// Cover visuals for each project, keyed by project slug. Files live in client/public/projects/.
// A project's own `coverImage` (set in the database) wins over these if it is filled in.
const covers = {
  'taskpoint-labour-marketplace': '/projects/taskpoint-labour-marketplace.webp',
  'ai-smart-warehouse-delivery-management': '/projects/ai-smart-warehouse-delivery-management.webp',
  'social-media-analytical-dashboard': '/projects/social-media-analytical-dashboard.webp',
  'safestate-cryptography-suite': '/projects/safestate-cryptography-suite.webp',
  'fluxlex-lexical-analyzer': '/projects/fluxlex-lexical-analyzer.webp',
  'techfix-accounting-system': '/projects/techfix-accounting-system.webp',
  'deadlock-detection-rag-wfg': '/projects/deadlock-detection-rag-wfg.webp',
  'netflix-data-analysis': '/projects/netflix-data-analysis.webp',
};

export function coverFor(project) {
  return (project && (project.coverImage || covers[project.slug])) || '';
}

export default covers;

// Smaller copies of a cover (800 px / 1200 px wide) for cards and the project page. Falls back to the
// original for covers that have no resized copy (for example one set in the database).
export function coverThumb(project) {
  const src = coverFor(project);
  return /^\/projects\/[^/]+\.webp$/.test(src) ? src.replace(/\.webp$/, '-800.webp') : src;
}

export function coverSources(project) {
  const src = coverFor(project);
  if (!/^\/projects\/[^/]+\.webp$/.test(src)) return null;
  const base = src.replace(/\.webp$/, '');
  return {
    avif: `${base}-800.avif 800w, ${base}-1200.avif 1200w`,
    webp: `${base}-800.webp 800w, ${base}-1200.webp 1200w, ${src} 1600w`,
  };
}
