import profile from '../data/profile';
import { coverFor } from '../data/covers';

// JSON-LD (structured data) for each page. One shared "graph": the Person and the WebSite have fixed
// @ids, so every page points at the same entities and search engines tie them together.
const SITE = profile.siteUrl.replace(/\/$/, '');
const PERSON_ID = `${SITE}/#person`;
const SITE_ID = `${SITE}/#website`;
const abs = (src) => (!src ? undefined : /^https?:/.test(src) ? src : SITE + src);

const KNOWN_LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'C++', 'C#', 'Dart', 'Java'];

export function personNode() {
  const s = profile.skills;
  const knows = [...new Set([...s.core, ...s.frontend, ...s.backend, ...s.database, ...s.firebase, ...s.languages, ...s.mobile])];
  const same = [profile.socials.linkedin, profile.socials.github].filter(Boolean);
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    url: SITE + '/',
    jobTitle: profile.title,
    description: profile.bio,
    image: abs('/shabi-hero-light.webp'),
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: profile.location.split(',')[0].trim(), addressCountry: 'PK' },
    knowsAbout: knows,
    alumniOf: profile.education.map((e) => ({ '@type': 'EducationalOrganization', name: e.institution })),
    sameAs: same,
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE + '/',
    name: `${profile.name} | ${profile.title}`,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  };
}

export function breadcrumbNode(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: SITE + t.path,
    })),
  };
}

export function projectNode(project) {
  const langs = project.technologies.filter((t) => KNOWN_LANGUAGES.includes(t));
  return {
    '@type': 'CreativeWork',
    '@id': `${SITE}/projects/${project.slug}#project`,
    url: `${SITE}/projects/${project.slug}`,
    name: project.title,
    description: project.shortDescription,
    image: abs(coverFor(project)),
    author: { '@id': PERSON_ID },
    creator: { '@id': PERSON_ID },
    dateCreated: project.year || undefined,
    keywords: project.technologies.join(', '),
    genre: project.category.join(', '),
    programmingLanguage: langs.length ? langs : undefined,
    isPartOf: { '@id': SITE_ID },
  };
}

// Home page: the whole entity graph.
export const homeGraph = () => [{ '@context': 'https://schema.org', '@graph': [personNode(), websiteNode()] }];

// Any other page: its breadcrumb (plus extra nodes), pointing at the same Person and WebSite.
export const pageGraph = (trail, ...extra) => [
  { '@context': 'https://schema.org', '@graph': [breadcrumbNode(trail), ...extra] },
];
