/**
 * schema.org JSON-LD builders. Every page emits one @graph whose nodes are
 * linked by stable @id values, so search and answer engines can resolve the
 * organisation, website, page, breadcrumbs and main entity as one entity graph.
 */
import { site, type Lang } from '~/data/site';
import { team } from '~/data/team';
import type { QA } from './articles';

export type JsonLd = Record<string, unknown>;

export interface Crumb {
  name: string;
  path: string;
}

export const ids = {
  organization: (origin: string) => `${origin}/#organization`,
  website: (origin: string) => `${origin}/#website`,
  logo: (origin: string) => `${origin}/#logo`,
  person: (origin: string, id: string) => `${origin}/about/#${id}`,
};

export function abs(origin: string, path: string): string {
  return new URL(path, `${origin}/`).href;
}

export function organizationNode(origin: string, lang: Lang, logoUrl: string): JsonLd {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ids.organization(origin),
    name: site.name[lang],
    alternateName: site.name[lang === 'ar' ? 'en' : 'ar'],
    legalName: site.legalName,
    url: `${origin}/`,
    description: site.description[lang],
    logo: {
      '@type': 'ImageObject',
      '@id': ids.logo(origin),
      url: logoUrl,
      contentUrl: logoUrl,
      caption: site.name[lang],
    },
    image: { '@id': ids.logo(origin) },
    email: site.email,
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street[lang],
      addressLocality: site.address.locality[lang],
      addressRegion: site.address.region[lang],
      addressCountry: site.address.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    hasMap: site.mapUrl,
    areaServed: [
      { '@type': 'Country', name: 'Syria' },
      { '@type': 'Place', name: 'Arab world' },
    ],
    knowsAbout: site.knowsAbout,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: site.phone,
        email: site.email,
        availableLanguage: ['ar', 'en'],
        areaServed: 'SY',
      },
    ],
    sameAs: [site.social.instagram, site.social.facebook],
    employee: team.map((m) => ({ '@id': ids.person(origin, m.id) })),
  };
}

export function websiteNode(origin: string, lang: Lang): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': ids.website(origin),
    url: `${origin}/`,
    name: site.name[lang],
    alternateName: site.name[lang === 'ar' ? 'en' : 'ar'],
    description: site.tagline[lang],
    inLanguage: ['ar', 'en'],
    publisher: { '@id': ids.organization(origin) },
  };
}

export function personNodes(origin: string, lang: Lang, photoUrls: Record<string, string>): JsonLd[] {
  return team.map((m) => ({
    '@type': 'Person',
    '@id': ids.person(origin, m.id),
    name: m.name[lang],
    alternateName: m.name[lang === 'ar' ? 'en' : 'ar'],
    jobTitle: m.role[lang],
    description: m.bio[lang],
    knowsAbout: m.skills[lang],
    ...(photoUrls[m.id] ? { image: photoUrls[m.id] } : {}),
    worksFor: { '@id': ids.organization(origin) },
  }));
}

export function breadcrumbNode(origin: string, canonical: string, crumbs: Crumb[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonical}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(origin, c.path),
    })),
  };
}

export type PageType =
  | 'WebPage'
  | 'CollectionPage'
  | 'AboutPage'
  | 'ContactPage'
  | 'FAQPage'
  | 'ItemPage';

export function webPageNode(opts: {
  origin: string;
  canonical: string;
  lang: Lang;
  title: string;
  description: string;
  type: PageType;
  imageUrl: string;
  hasBreadcrumb: boolean;
  datePublished?: Date | undefined;
  dateModified?: Date | undefined;
}): JsonLd {
  return {
    '@type': opts.type,
    '@id': `${opts.canonical}#webpage`,
    url: opts.canonical,
    name: opts.title,
    description: opts.description,
    inLanguage: opts.lang,
    isPartOf: { '@id': ids.website(opts.origin) },
    about: { '@id': ids.organization(opts.origin) },
    primaryImageOfPage: { '@type': 'ImageObject', url: opts.imageUrl },
    ...(opts.hasBreadcrumb ? { breadcrumb: { '@id': `${opts.canonical}#breadcrumb` } } : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished.toISOString() } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified.toISOString() } : {}),
  };
}

/** FAQ entities. On /faq/ they belong to the FAQPage itself; on articles they are a separate node. */
export function faqEntities(items: QA[]): JsonLd[] {
  return items.map((qa) => ({
    '@type': 'Question',
    name: qa.question,
    acceptedAnswer: { '@type': 'Answer', text: qa.answer },
  }));
}

export function faqPageNode(canonical: string, lang: Lang, items: QA[], asWebPage: boolean): JsonLd {
  return {
    '@type': 'FAQPage',
    '@id': asWebPage ? `${canonical}#webpage` : `${canonical}#faq`,
    inLanguage: lang,
    mainEntity: faqEntities(items),
  };
}

export function articleNode(opts: {
  origin: string;
  canonical: string;
  headline: string;
  description: string;
  imageUrl: string;
  datePublished: Date;
  dateModified: Date;
  section: string;
  keywords: readonly string[];
  wordCount: number;
}): JsonLd {
  return {
    '@type': 'Article',
    '@id': `${opts.canonical}#article`,
    headline: opts.headline,
    description: opts.description,
    image: [opts.imageUrl],
    datePublished: opts.datePublished.toISOString(),
    dateModified: opts.dateModified.toISOString(),
    inLanguage: 'ar',
    articleSection: opts.section,
    keywords: opts.keywords.join(', '),
    wordCount: opts.wordCount,
    mainEntityOfPage: { '@id': `${opts.canonical}#webpage` },
    isPartOf: { '@id': ids.website(opts.origin) },
    author: { '@id': ids.organization(opts.origin) },
    publisher: { '@id': ids.organization(opts.origin) },
  };
}

export function itemListNode(canonical: string, name: string, items: { name: string; url: string }[]): JsonLd {
  return {
    '@type': 'ItemList',
    '@id': `${canonical}#list`,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: it.url,
    })),
  };
}

export function videoNode(opts: {
  canonical: string;
  id: string;
  youtubeId: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  origin: string;
}): JsonLd {
  // uploadDate is intentionally omitted: it is unknown and must not be invented.
  return {
    '@type': 'VideoObject',
    '@id': `${opts.canonical}#${opts.id}`,
    name: opts.name,
    description: opts.description,
    thumbnailUrl: [opts.thumbnailUrl, `https://i.ytimg.com/vi/${opts.youtubeId}/hqdefault.jpg`],
    duration: opts.duration,
    contentUrl: `https://www.youtube.com/watch?v=${opts.youtubeId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${opts.youtubeId}`,
    publisher: { '@id': ids.organization(opts.origin) },
  };
}
