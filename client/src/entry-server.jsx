import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { buildHeadTags } from './components/Seo';

// Used only by scripts/prerender.mjs at build time: renders one route to an HTML string plus its <head> tags.
export function render(url) {
  globalThis.__SEO__ = null;
  return new Promise((resolve, reject) => {
    let html = '';
    const sink = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString();
        cb();
      },
    });
    sink.on('finish', () => {
      const data = globalThis.__SEO__;
      resolve({ html, head: data ? buildHeadTags(data) : null, data });
    });
    const { pipe } = renderToPipeableStream(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>,
      {
        onAllReady() {
          pipe(sink);
        },
        onError(err) {
          reject(err);
        },
      }
    );
  });
}

// Project list for the build step (one prerendered page per project).
export { allProjects as projects } from './data/portfolioData';
export { default as profile } from './data/profile';
