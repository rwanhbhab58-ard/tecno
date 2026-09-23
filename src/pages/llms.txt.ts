import type { APIRoute } from 'astro';
import { buildLlmsTxt } from '~/lib/llms';

export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL('https://technoenjaz.com')).origin;
  return new Response(await buildLlmsTxt(origin), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
