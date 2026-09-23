import type { RouteKey } from '~/i18n/ui';
import type { Lang } from './site';

/** One-line summaries of every section, used by llms.txt and other machine-readable indexes. */
export const pageSummaries: Record<RouteKey, Record<Lang, string>> = {
  home: {
    ar: 'نظرة عامة على تكنو إنجاز وخدماتها وأبرز مشاريعها ومقالاتها.',
    en: 'Overview of Techno Enjaz, its services, highlighted projects and articles.',
  },
  services: {
    ar: 'الخدمات: مشاريع التخرج، الذكاء الاصطناعي والرؤية الحاسوبية، الروبوتات والأنظمة المدمجة، تطوير المواقع، تطبيقات الموبايل، وطريقة العمل.',
    en: 'Services: graduation projects, AI & computer vision, robotics & embedded systems, web development, mobile apps, and how we work.',
  },
  projects: {
    ar: 'مشاريع هندسية ومشاريع تخرج موثقة مع روابط التقارير والمستندات والعروض على Google Drive، وصور النماذج المنفذة.',
    en: 'Documented engineering and graduation projects with links to reports, documents and slides on Google Drive, plus prototype photos.',
  },
  webProjects: {
    ar: 'مواقع وأنظمة ويب منشورة يمكن تجربتها: أنظمة أعمال، متاجر إلكترونية، مواقع شخصية، أدوات.',
    en: 'Live websites and web systems you can try: business systems, online stores, personal sites and tools.',
  },
  videos: {
    ar: 'فيديوهات YouTube لمشاريع منفذة: طائرة درون، ذراع لحام روبوتية، ذراع موجهة بالرؤية الحاسوبية.',
    en: 'YouTube videos of built projects: a drone, a robotic welding arm and a vision-guided robotic arm.',
  },
  articles: {
    ar: 'مقالات تقنية عربية معمّقة مع مصادر وأسئلة شائعة.',
    en: 'In-depth Arabic technical articles with sources and FAQs (English summaries on the English index).',
  },
  about: {
    ar: 'من نحن: تعريف المكتب، أرقام مختصرة، الفريق، وصور من الأنشطة.',
    en: 'About: who we are, key facts, the team and photos from our activities.',
  },
  faq: {
    ar: 'الأسئلة الشائعة: الموقع، مشاريع التخرج، المواقع، التكلفة والمدة، التواصل.',
    en: 'FAQ: location, graduation projects, websites, cost and timeline, contact.',
  },
  contact: {
    ar: 'التواصل: واتساب، هاتف، بريد، إنستغرام، فيسبوك، العنوان والخريطة، ونموذج إرسال.',
    en: 'Contact: WhatsApp, phone, email, Instagram, Facebook, address and map, and an enquiry form.',
  },
};
