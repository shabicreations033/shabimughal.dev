// Build step 3 of 3 (see package.json "build"): renders every route to static HTML.
//
//   vite build                                  -> dist/ (the client app + index.html template)
//   vite build --ssr src/entry-server.jsx       -> dist-ssr/ (the same app, for Node)
//   node scripts/prerender.mjs                  -> dist/<route>.html, 404.html, sitemap.xml
//
// Each page ships with its real content, <title>, description, canonical, Open Graph tags and
// JSON-LD in the HTML itself, so search engines and link previews do not need to run JavaScript.
// The browser then replaces that markup with the live React app.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { render, projects, profile } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const SITE = 'https://shabimughal.dev';

function page({ html, head }) {
  let out = template;
  if (head) {
    out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${head.title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</title>`);
    out = out.replace(/\s*<meta name="description"[^>]*>/, '');
    out = out.replace('<!--seo-head-->', head.tags);
  }
  return out.replace('<!--app-html-->', html);
}

function write(file, content) {
  const target = path.join(dist, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

const routes = ['/', '/about', '/projects', '/contact', ...projects.map((p) => `/projects/${p.slug}`)];
const today = new Date().toISOString().slice(0, 10);
const urls = [];

for (const route of routes) {
  const result = await render(route);
  write(route === '/' ? 'index.html' : `${route.slice(1)}.html`, page(result));
  const cover = result.data && result.data.image && result.data.image !== '/og-image.png' ? result.data.image : null;
  urls.push({ loc: SITE + (route === '/' ? '/' : route), image: cover, title: result.data && result.data.title });
  console.log('prerendered', route);
}

// Real 404 page: Vercel serves 404.html with a 404 status for any address that has no file.
const notFound = await render('/__not-found__');
let nf = page(notFound);
nf = nf.replace(/<link rel="canonical"[^>]*>\s*/, '');
write('404.html', nf);
console.log('prerendered 404');

// Sitemap with lastmod and the project cover images.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>${
      u.image
        ? `
    <image:image>
      <image:loc>${u.image.startsWith('http') ? u.image : SITE + u.image}</image:loc>${u.title ? `
      <image:title>${u.title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</image:title>` : ''}
    </image:image>`
        : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>
`;
write('sitemap.xml', sitemap);
// llms.txt: a plain-text summary of the site for AI assistants, generated from the same data.
const llms = `# ${profile.name}

> ${profile.bio} Based in ${profile.location}.

## Pages
- [Home](${SITE}/): overview and highlighted work
- [About](${SITE}/about): skills, education, experience and certifications
- [Projects](${SITE}/projects): all case studies
- [Contact](${SITE}/contact): email, WhatsApp and social links

## Projects
${projects.map((p) => `- [${p.title}](${SITE}/projects/${p.slug}): ${p.shortDescription.replace(/\s+/g, ' ')}`).join('\n')}

## Contact
- Email: ${profile.email}
- LinkedIn: ${profile.socials.linkedin}
- GitHub: ${profile.socials.github}
`;
write('llms.txt', llms);
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log('sitemap.xml written');
