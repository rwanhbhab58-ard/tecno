import type { APIRoute } from 'astro';
import { routes, type RouteKey } from '~/i18n/ui';
import { localize } from '~/i18n/utils';
import { articlePath, getArticles } from '~/lib/articles';

const xmlEscape = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL('https://technoenjaz.com')).origin;
  const url = (path: string): string => xmlEscape(new URL(path, `${origin}/`).href);
  const articles = await getArticles();
  const latest = articles.reduce(
    (max, a) => Math.max(max, (a.data.updatedAt ?? a.data.publishedAt).getTime()),
    0,
  );
  const latestIso = new Date(latest).toISOString().slice(0, 10);

  const entries: string[] = [];

  for (const key of Object.keys(routes) as RouteKey[]) {
    const ar = localize('ar', routes[key]);
    const en = localize('en', routes[key]);
    const lastmod = key === 'home' || key === 'articles' ? `\n    <lastmod>${latestIso}</lastmod>` : '';
    const alternates = [
      `<xhtml:link rel="alternate" hreflang="ar" href="${url(ar)}"/>`,
      `<xhtml:link rel="alternate" hreflang="en" href="${url(en)}"/>`,
      `<xhtml:link rel="alternate" hreflang="x-default" href="${url(ar)}"/>`,
    ].join('\n    ');
    for (const loc of [ar, en]) {
      entries.push(`  <url>\n    <loc>${url(loc)}</loc>${lastmod}\n    ${alternates}\n  </url>`);
    }
  }

  for (const a of articles) {
    const lastmod = (a.data.updatedAt ?? a.data.publishedAt).toISOString().slice(0, 10);
    entries.push(`  <url>\n    <loc>${url(articlePath(a))}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`);
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
