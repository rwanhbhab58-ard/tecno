import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://technoenjaz.com')).origin;
  const body = `# Techno Enjaz — all public content may be crawled and cited, including by AI assistants.
User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
