import type { Lang } from '~/data/site';
import { routes, ui, type RouteKey, type Ui } from './ui';

export const languages: readonly Lang[] = ['ar', 'en'];

export function t(lang: Lang): Ui {
  return ui[lang];
}

export function otherLang(lang: Lang): Lang {
  return lang === 'ar' ? 'en' : 'ar';
}

/** Prefixes a root-relative path with the language segment (Arabic is unprefixed). */
export function localize(lang: Lang, path: string): string {
  if (lang === 'ar') return path;
  return path === '/' ? '/en/' : `/en${path}`;
}

export function routePath(lang: Lang, key: RouteKey): string {
  return localize(lang, routes[key]);
}

export function dir(lang: Lang): 'rtl' | 'ltr' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

export function formatDate(lang: Lang, date: Date): string {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SY-u-nu-latn' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatNumber(lang: Lang, n: number): string {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-SY-u-nu-latn' : 'en-US').format(n);
}
