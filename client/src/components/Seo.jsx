import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import profile from '../data/profile';

// Sets the page title, description, canonical address, share tags and structured data for the
// current route.
//
// Two places read this:
//  1. The build step (scripts/prerender.mjs) renders every route to static HTML. While it does,
//     this component records its props in `globalThis.__SEO__` and `buildHeadTags()` turns them into
//     <head> markup, so crawlers and link previews (LinkedIn, WhatsApp, Slack, X) see the real tags
//     without running JavaScript.
//  2. In the browser the effect below keeps the tags correct when the visitor moves between pages.

const SITE = profile.siteUrl.replace(/\/$/, '');
export const DEFAULT_IMAGE = '/og-image.png';

// Keep a description within search-result length. Prefer ending on a full sentence; otherwise cut at a
// word and close with a full stop, so no "…" shows up in the snippet.
export function shorten(text, max = 158) {
  if (!text || text.length <= max) return text || '';
  const head = text.slice(0, max);
  const stop = Math.max(head.lastIndexOf('. '), head.lastIndexOf('! '), head.lastIndexOf('? '));
  if (stop > max * 0.6) return head.slice(0, stop + 1);
  const cut = head.slice(0, head.lastIndexOf(' ')).replace(/[,;:\u2013\u2014\-.\s]+$/, '');
  return cut + '.';
}

export function canonicalFor(pathname) {
  return SITE + (pathname === '/' ? '/' : pathname.replace(/\/$/, ''));
}

function absolute(src) {
  if (!src) return SITE + DEFAULT_IMAGE;
  return /^https?:/.test(src) ? src : SITE + src;
}

// Everything the head needs, as a plain list of tags.
export function seoTags({ title, description, noindex = false, image, imageAlt, type = 'website', pathname = '/' }) {
  const url = canonicalFor(pathname);
  const desc = shorten(description);
  const img = absolute(image);
  return {
    title,
    url,
    meta: [
      ['name', 'description', desc],
      ['name', 'robots', noindex ? 'noindex, follow' : 'index, follow'],
      ['property', 'og:type', type],
      ['property', 'og:site_name', profile.name],
      ['property', 'og:title', title],
      ['property', 'og:description', desc],
      ['property', 'og:url', url],
      ['property', 'og:image', img],
      ...(/(-og\.jpg|og-image\.png)$/.test(img) ? [['property', 'og:image:width', '1200'], ['property', 'og:image:height', '630']] : []),
      ['property', 'og:image:alt', imageAlt || title],
      ['property', 'og:locale', 'en_US'],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', title],
      ['name', 'twitter:description', desc],
      ['name', 'twitter:image', img],
      ['name', 'twitter:image:alt', imageAlt || title],
    ],
  };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const jsonSafe = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

// <head> markup for the build step.
export function buildHeadTags(data) {
  const t = seoTags(data);
  const lines = [`<link rel="canonical" href="${esc(t.url)}" />`];
  for (const [attr, key, value] of t.meta) lines.push(`<meta ${attr}="${key}" content="${esc(value)}" />`);
  if (data.jsonLd && data.jsonLd.length) lines.push(`<script type="application/ld+json" data-seo="ld">${jsonSafe(data.jsonLd)}</script>`);
  return { title: t.title, description: t.meta[0][2], tags: lines.join('\n  ') };
}

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
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

function setJsonLd(data) {
  let el = document.head.querySelector('script[data-seo="ld"]');
  if (!data || !data.length) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-seo', 'ld');
    document.head.appendChild(el);
  }
  el.textContent = jsonSafe(data);
}

export default function Seo({ title, description, noindex = false, image, type = 'website', jsonLd }) {
  const { pathname } = useLocation();

  // Build step: remember what this page wants in its head.
  if (typeof document === 'undefined') {
    globalThis.__SEO__ = { title, description, noindex, image, type, jsonLd, pathname };
  }

  const ld = jsonLd ? JSON.stringify(jsonLd) : '';
  useEffect(() => {
    const t = seoTags({ title, description, noindex, image, type, pathname });
    document.title = t.title;
    setCanonical(t.url);
    for (const [attr, key, value] of t.meta) setMeta(attr, key, value);
    setJsonLd(ld ? JSON.parse(ld) : null);
  }, [title, description, noindex, image, type, pathname, ld]);

  return null;
}
