import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

export interface QA {
  question: string;
  answer: string;
}

const WORDS_PER_MINUTE = 200;
const FAQ_HEADING = /^## الأسئلة الشائعة\s*$/m;

export async function getArticles(): Promise<Article[]> {
  const all = await getCollection('articles');
  return all.sort(
    (a, b) =>
      b.data.publishedAt.getTime() - a.data.publishedAt.getTime() ||
      a.data.title.localeCompare(b.data.title, 'ar'),
  );
}

export function readingMinutes(article: Article): number {
  const words = (article.body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Converts inline markdown to plain text for JSON-LD and llms.txt. */
export function stripMarkdown(md: string): string {
  return md
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(\*|_)(.+?)\1/g, '$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts the "الأسئلة الشائعة" section of an article body. Each "###"
 * heading is a question and the text up to the next heading is its answer.
 */
export function extractFaq(article: Article): QA[] {
  const body = article.body ?? '';
  const start = body.search(FAQ_HEADING);
  if (start === -1) return [];
  const rest = body.slice(start).replace(FAQ_HEADING, '');
  const end = rest.search(/^## /m);
  const section = end === -1 ? rest : rest.slice(0, end);

  return section
    .split(/^### /m)
    .slice(1)
    .map((chunk) => {
      const [first = '', ...answerLines] = chunk.split('\n');
      return { question: stripMarkdown(first), answer: stripMarkdown(answerLines.join('\n')) };
    })
    .filter((qa) => qa.question && qa.answer);
}

/** Explicit editorial links first, then articles sharing the category or tags. */
export function relatedArticles(article: Article, all: Article[], limit = 3): Article[] {
  const others = all.filter((a) => a.id !== article.id);
  const picked = article.data.related
    .map((slug) => others.find((a) => a.id === slug))
    .filter((a): a is Article => a !== undefined);

  const score = (a: Article): number =>
    (a.data.category === article.data.category ? 3 : 0) +
    a.data.tags.filter((tag) => article.data.tags.includes(tag)).length;

  const fill = others
    .filter((a) => !picked.includes(a))
    .map((a) => ({ a, s: score(a) }))
    .sort((x, y) => y.s - x.s)
    .map(({ a }) => a);

  return [...picked, ...fill].slice(0, limit);
}

export function articlePath(article: Article): string {
  return `/articles/${article.id}/`;
}
