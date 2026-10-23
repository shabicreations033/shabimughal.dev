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
