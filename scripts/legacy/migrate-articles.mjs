// One-time migration: converts the legacy article markdown (with an HTML-comment
// preamble, "SEO Title:" lines and an inline H1) into content-collection entries
// with typed frontmatter. Metadata that only lived in the old TS data file
// (English title/excerpt, category, dates, tags) is pulled from there.
//
// Usage: node scripts/legacy/migrate-articles.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'src/content/articles';
const legacy = readFileSync('scripts/legacy/blogArticlesData.old.ts', 'utf8');

const meta = new Map();
const re =
  /id: '([^']+)',[\s\S]*?titleEn: '([^']+)',[\s\S]*?category: '([^']+)',\s*categoryEn: '([^']+)',[\s\S]*?image: '([^']+)',[\s\S]*?publishDateEn: '([^']+)',[\s\S]*?excerpt: '([^']+)',\s*excerptEn: '([^']+)'[\s\S]*?tags: \[([^\]]+)\]/g;
for (const m of legacy.matchAll(re)) {
  const [, id, titleEn, category, categoryEn, image, dateEn, excerpt, excerptEn, tags] = m;
  meta.set(id, {
    titleEn,
    category,
    categoryEn,
    image: image.split('/').pop(),
    date: new Date(`${dateEn} UTC`).toISOString().slice(0, 10),
    excerpt,
    excerptEn,
    tags: [...tags.matchAll(/'([^']+)'/g)].map((t) => t[1].replaceAll('_', ' ')),
  });
}

const yamlString = (s) => JSON.stringify(s);

for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const slug = file.replace(/\.md$/, '');
  const m = meta.get(slug);
  if (!m) throw new Error(`No legacy metadata for ${slug}`);
  let src = readFileSync(join(dir, file), 'utf8');

  src = src.replace(/^<!--[\s\S]*?-->\s*/, '');
  const seoTitle = src.match(/^SEO Title:\s*(.+)$/m)?.[1].trim();
  const description = src.match(/^Meta Description:\s*(.+)$/m)?.[1].trim();
  const title = src.match(/^# (.+)$/m)?.[1].trim();
  if (!seoTitle || !description || !title) throw new Error(`Missing header fields in ${slug}`);

  let body = src.slice(src.indexOf(`# ${title}`) + title.length + 2).trim();

  // Related-articles section becomes structured data rendered by the layout.
  const related = [];
  const relIdx = body.search(/^## مقالات ودراسات ذات صلة.*$/m);
  if (relIdx !== -1) {
    const section = body.slice(relIdx);
    for (const r of section.matchAll(/\]\(\/articles\/([^)/]+)\/?\)/g)) related.push(r[1]);
    body = body.slice(0, relIdx).trim();
  }

  // Normalise internal links to the canonical trailing-slash form.
  body = body.replace(/\]\(\/articles\/([^)/#]+)\)/g, '](/articles/$1/)');

  const fm = [
    '---',
    `title: ${yamlString(title)}`,
    `seoTitle: ${yamlString(seoTitle)}`,
    `description: ${yamlString(description)}`,
    `excerpt: ${yamlString(m.excerpt)}`,
    `titleEn: ${yamlString(m.titleEn)}`,
    `excerptEn: ${yamlString(m.excerptEn)}`,
    `category: ${yamlString(m.category)}`,
    `categoryEn: ${yamlString(m.categoryEn)}`,
    `publishedAt: ${m.date}`,
    `cover: ${yamlString(`../../assets/articles/${m.image}`)}`,
    `tags: [${m.tags.map(yamlString).join(', ')}]`,
    `related: [${related.map(yamlString).join(', ')}]`,
    '---',
    '',
  ].join('\n');

  writeFileSync(join(dir, file), `${fm}${body}\n`);
  console.log(`migrated ${slug} (related: ${related.length})`);
}
