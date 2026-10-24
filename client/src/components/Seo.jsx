import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import profile from '../data/profile';

// Sets the page title, description, canonical address and share tags for the current route.
// Google runs the site's JavaScript, so it reads these per page. (Link previews on LinkedIn or
// WhatsApp do not run JavaScript, so they always show the tags written in index.html.)

function setMeta(selector, attr, key, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// Cut a long description at a word boundary so search results do not truncate it mid-word.
export function shorten(text, max = 158) {
  if (!text || text.length <= max) return text || '';
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '') + '…';
}

export default function Seo({ title, description, noindex = false }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const base = profile.siteUrl.replace(/\/$/, '');
    const url = base + (pathname === '/' ? '/' : pathname.replace(/\/$/, ''));
    const desc = shorten(description);

    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', desc);
    setCanonical(url);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc);
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
  }, [title, description, noindex, pathname]);

  return null;
}
