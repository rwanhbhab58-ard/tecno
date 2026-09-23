// Post-build QA for the static output in dist/.
// Checks every HTML page for SEO metadata, structured data, language/direction,
// heading outline and internal links, and cross-checks sitemap.xml and llms.txt.
// Usage: npm run build && npm run verify
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const errors = [];
const warn = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));

/** URL path served for a dist file (directory format). */
function urlPathOf(file) {
  const rel = relative(DIST, file).split(sep).join('/');
  if (rel === '404.html') return '/404/';
  return `/${rel.replace(/index\.html$/, '')}`;
}

function resolves(path) {
  const clean = decodeURIComponent(path.split('#')[0].split('?')[0]);
  if (clean === '' || clean === '/') return existsSync(join(DIST, 'index.html'));
  const target = join(DIST, clean);
  return (
    (existsSync(target) && statSync(target).isFile()) ||
    existsSync(join(target, 'index.html'))
  );
}

const attr = (html, re) => html.match(re)?.[1];
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

let origin = null;
const indexable = new Set();
const report = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const path = urlPathOf(file);
  const isEn = path.startsWith('/en/');
  const is404 = path === '/404/';
  const isArticle = /^\/articles\/[^/]+\/$/.test(path);

  const lang = attr(html, /<html[^>]*\slang="([^"]+)"/);
  const dir = attr(html, /<html[^>]*\sdir="([^"]+)"/);
  if (lang !== (isEn ? 'en' : 'ar')) fail(path, `html lang="${lang}"`);
  if (dir !== (isEn ? 'ltr' : 'rtl')) fail(path, `html dir="${dir}"`);

  const title = attr(html, /<title>([^<]*)<\/title>/);
  if (!title || title.trim().length < 10) fail(path, 'missing/short <title>');
  else if (title.length > 75) warn.push(`${path}: title is ${title.length} chars`);

  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  if (!desc || desc.length < 50) fail(path, 'missing/short meta description');

  const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/);
  if (!canonical) fail(path, 'missing canonical');
  else {
    const u = new URL(canonical);
    origin ??= u.origin;
    if (u.origin !== origin) fail(path, `canonical origin ${u.origin} != ${origin}`);
    if (!is404 && decodeURIComponent(u.pathname) !== decodeURIComponent(path)) fail(path, `canonical path ${u.pathname}`);
  }

  for (const prop of ['og:title', 'og:description', 'og:image', 'og:url', 'og:locale']) {
    if (!new RegExp(`<meta property="${prop}" content="[^"]+"`).test(html)) fail(path, `missing ${prop}`);
  }
  const ogImage = attr(html, /<meta property="og:image" content="([^"]+)"/);
  if (ogImage) {
    if (!ogImage.startsWith('http')) fail(path, 'og:image not absolute');
    else if (!resolves(new URL(ogImage).pathname)) fail(path, `og:image not found: ${ogImage}`);
  }

  const hreflangs = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
  if (!isArticle && !is404) {
    const codes = hreflangs.map((m) => m[1]).sort().join(',');
    if (codes !== 'ar,en,x-default') fail(path, `hreflang set is "${codes}"`);
    for (const [, , href] of hreflangs) if (!resolves(new URL(href).pathname)) fail(path, `hreflang target missing ${href}`);
  }

  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (is404 !== noindex) fail(path, `noindex=${noindex}`);
  if (!noindex) indexable.add(path);

  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) fail(path, `${h1s} <h1> elements`);

  const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const types = new Set();
  for (const [, json] of ldBlocks) {
    try {
      const data = JSON.parse(json);
      for (const node of data['@graph'] ?? [data]) {
        for (const t of [node['@type']].flat()) types.add(t);
      }
    } catch (e) {
      fail(path, `invalid JSON-LD: ${e.message}`);
    }
  }
  for (const t of ['Organization', 'WebSite']) if (!types.has(t)) fail(path, `JSON-LD lacks ${t}`);
  if (!is404 && path !== '/' && path !== '/en/' && !types.has('BreadcrumbList')) fail(path, 'JSON-LD lacks BreadcrumbList');
  if (isArticle) for (const t of ['Article', 'FAQPage']) if (!types.has(t)) fail(path, `JSON-LD lacks ${t}`);
  if (/\/faq\/$/.test(path) && !types.has('FAQPage')) fail(path, 'JSON-LD lacks FAQPage');
  if (/\/about\/$/.test(path) && !types.has('Person')) fail(path, 'JSON-LD lacks Person');
  if (/\/videos\/$/.test(path) && !types.has('VideoObject')) fail(path, 'JSON-LD lacks VideoObject');

  const mainText = (html.match(/<main[\s\S]*<\/main>/)?.[0] ?? '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (mainText.length < (is404 ? 100 : 600)) fail(path, `main content too short (${mainText.length} chars)`);

  for (const [, href] of html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
    const h = decode(href);
    if (h.startsWith('/') && !h.startsWith('//') && !resolves(h)) fail(path, `broken internal link ${h}`);
  }
  for (const [, src] of html.matchAll(/<img [^>]*src="([^"]+)"/g)) {
    if (src.startsWith('/') && !resolves(src)) fail(path, `missing image ${src}`);
  }
  if (/<img(?![^>]*\salt(?:=|[\s>]))[^>]*>/.test(html)) fail(path, 'img without alt attribute');

  report.push({ path, title, words: mainText.split(' ').length, types: [...types].join(' ') });
}

// sitemap.xml ↔ pages
const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const locs = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decodeURIComponent(new URL(m[1]).pathname)));
for (const loc of locs) if (!resolves(loc)) fail('sitemap.xml', `points to missing ${loc}`);
for (const p of indexable) if (!locs.has(decodeURIComponent(p))) fail('sitemap.xml', `missing indexable page ${p}`);

// robots.txt and llms.txt
const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
if (!robots.includes(`${origin}/sitemap.xml`)) fail('robots.txt', 'sitemap line missing or wrong origin');
for (const name of ['llms.txt', 'llms-full.txt']) {
  const txt = readFileSync(join(DIST, name), 'utf8');
  for (const [, url] of txt.matchAll(/\((https?:\/\/[^)\s]+)\)/g)) {
    const u = new URL(url);
    if (u.origin === origin && !resolves(u.pathname)) fail(name, `link to missing ${u.pathname}`);
  }
}

console.table(report.map(({ path, words, types }) => ({ path, words, types })));
console.log(`\n${htmlFiles.length} HTML pages · ${locs.size} sitemap URLs · origin ${origin}`);
if (warn.length) console.log(`\nWarnings:\n- ${warn.join('\n- ')}`);
if (errors.length) {
  console.error(`\n✗ ${errors.length} problem(s):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('\n✓ All checks passed.');
