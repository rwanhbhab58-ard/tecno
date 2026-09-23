/**
 * Builds /llms.txt (concise index, llmstxt.org format) and /llms-full.txt
 * (expanded facts) from the same data that renders the site, so the machine
 * description can never drift from what visitors see.
 */
import { site } from '~/data/site';
import { services } from '~/data/services';
import { projects, projectCategories, driveFileUrl, driveFolderUrl } from '~/data/projects';
import { webProjects } from '~/data/webProjects';
import { videos } from '~/data/media';
import { team } from '~/data/team';
import { allFaqItems } from '~/data/faq';
import { pageSummaries } from '~/data/pageIndex';
import { navOrder } from '~/i18n/ui';
import { routePath, t } from '~/i18n/utils';
import { articlePath, extractFaq, getArticles } from './articles';

function contactBlock(): string {
  return [
    `- Name: ${site.name.en} (${site.name.ar})`,
    `- Type: Engineering office / professional service`,
    `- Address: ${site.address.street.en}, ${site.address.locality.en}, ${site.address.country.en}`,
    `- Address (Arabic): ${site.address.street.ar}، ${site.address.locality.ar}، ${site.address.country.ar}`,
    `- Coordinates: ${site.geo.latitude}, ${site.geo.longitude} (${site.address.regionCode})`,
    `- Phone / WhatsApp: ${site.phoneDisplay} (${site.whatsapp})`,
    `- Email: ${site.email}`,
    `- Instagram: ${site.instagramHandle} (${site.social.instagram})`,
    `- Facebook: ${site.social.facebook}`,
    `- Languages: Arabic (primary), English`,
  ].join('\n');
}

export async function buildLlmsTxt(origin: string): Promise<string> {
  const u = (p: string): string => new URL(p, `${origin}/`).href;
  const articles = await getArticles();
  const en = t('en');

  const pages = navOrder
    .map((key) => `- [${en.nav[key]}](${u(routePath('ar', key))}): ${pageSummaries[key].en} English version: ${u(routePath('en', key))}`)
    .join('\n');

  const articleLinks = articles
    .map((a) => `- [${a.data.title}](${u(articlePath(a))}): ${a.data.titleEn}. ${a.data.excerptEn}`)
    .join('\n');

  return `# ${site.name.en} (${site.name.ar})

> ${site.description.en}

${site.description.ar}

## Key facts
${contactBlock()}

## Services
${services.map((s) => `- ${s.title.en} (${s.title.ar}): ${s.summary.en}`).join('\n')}

## Pages
${pages}

## Articles (Arabic)
${articleLinks}

## Optional
- [Full details for LLMs](${u('/llms-full.txt')}): every project, website, video, article summary and FAQ answer in plain text.
- [Sitemap](${u('/sitemap.xml')})
`;
}

export async function buildLlmsFullTxt(origin: string): Promise<string> {
  const u = (p: string): string => new URL(p, `${origin}/`).href;
  const articles = await getArticles();

  const projectLines = projects
    .map((p) => {
      const docs = [
        p.docs.pdf && `report ${driveFileUrl(p.docs.pdf)}`,
        p.docs.docx && `document ${driveFileUrl(p.docs.docx)}`,
        p.docs.pptx && `slides ${driveFileUrl(p.docs.pptx)}`,
        p.docs.folder && `folder ${driveFolderUrl(p.docs.folder)}`,
      ]
        .filter(Boolean)
        .join('; ');
      return `### ${p.title.en}\n- Arabic title: ${p.title.ar}\n- Field: ${projectCategories[p.category].en}\n- Summary: ${p.description.en}\n- Documentation: ${docs}\n- Page: ${u(`/projects/#${p.id}`)}`;
    })
    .join('\n\n');

  const webLines = webProjects
    .map((w) => `### ${w.title.en} (${w.title.ar})\n- Live URL: ${w.url}\n- Summary: ${w.description.en}`)
    .join('\n\n');

  const videoLines = videos
    .map((v) => `- ${v.title.en} (${v.title.ar}) — https://www.youtube.com/watch?v=${v.youtubeId} — ${v.description.en}`)
    .join('\n');

  const articleBlocks = articles
    .map((a) => {
      const faq = extractFaq(a)
        .map((qa) => `  - Q: ${qa.question}\n    A: ${qa.answer}`)
        .join('\n');
      return `### ${a.data.title}\n- English title: ${a.data.titleEn}\n- URL: ${u(articlePath(a))}\n- Category: ${a.data.categoryEn} (${a.data.category})\n- Published: ${a.data.publishedAt.toISOString().slice(0, 10)}\n- Summary (ar): ${a.data.description}\n- Summary (en): ${a.data.excerptEn}${faq ? `\n- FAQ (Arabic):\n${faq}` : ''}`;
    })
    .join('\n\n');

  const faqLines = allFaqItems
    .map((f) => `### ${f.question.en}\n${f.answer.en}\n\n(ar) ${f.question.ar}\n${f.answer.ar}`)
    .join('\n\n');

  return `# ${site.name.en} (${site.name.ar}) — full reference

> ${site.description.en}

Canonical website: ${origin}/ (Arabic) and ${origin}/en/ (English).

## Organisation
${contactBlock()}

## Team
${team.map((m) => `- ${m.name.en} (${m.name.ar}) — ${m.role.en}. ${m.bio.en}`).join('\n')}

## Services
${services.map((s) => `### ${s.title.en} (${s.title.ar})\n${s.summary.en}\n${s.points.en.map((p) => `- ${p}`).join('\n')}`).join('\n\n')}

## Engineering projects (${projects.length})
${projectLines}

## Live web projects (${webProjects.length})
${webLines}

## Videos
${videoLines}

## Articles (${articles.length}, written in Arabic)
${articleBlocks}

## Frequently asked questions
${faqLines}
`;
}
