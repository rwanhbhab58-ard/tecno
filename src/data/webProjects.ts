import type { ImageMetadata } from 'astro';
import type { Lang } from './site';

import hisabErp from '~/assets/web-projects/hisab-erp.jpg';
import projectforge from '~/assets/web-projects/projectforge.jpg';
import interactiveCv from '~/assets/web-projects/interactive-cv.jpg';
import taimaAlwani from '~/assets/web-projects/taima-alwani.jpg';
import rebuildDn9 from '~/assets/web-projects/rebuild-dn9.jpg';
import khazamaStore from '~/assets/web-projects/khazama-store.jpg';
import modeya from '~/assets/web-projects/modeya.jpg';
import dermocean from '~/assets/web-projects/dermocean.jpg';
import wpuCover from '~/assets/web-projects/wpu-cover.jpg';
import md2pdf from '~/assets/web-projects/md-2-pdf.jpg';
import cablexperts from '~/assets/web-projects/cablexperts.jpg';
import cableksa from '~/assets/web-projects/cableksa.jpg';
import arduinoLab from '~/assets/web-projects/arduino-lab.jpg';

export type WebCategory = 'business' | 'identity' | 'store' | 'tool';

export const webCategories: Record<WebCategory, Record<Lang, string>> = {
  business: { ar: 'أنظمة ومنصات أعمال', en: 'Business systems' },
  identity: { ar: 'هويات ومواقع شخصية', en: 'Personal sites & portfolios' },
  store: { ar: 'متاجر إلكترونية', en: 'Online stores' },
  tool: { ar: 'أدوات ومختبرات', en: 'Tools & labs' },
};

export interface WebProject {
  id: string;
  category: WebCategory;
  url: string;
  image: ImageMetadata;
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
  description: Record<Lang, string>;
  highlights: Record<Lang, readonly string[]>;
}

export function displayDomain(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '');
}

export const webProjects: readonly WebProject[] = [
  {
    id: 'hisab-erp',
    category: 'business',
    url: 'https://hisab-erp.pages.dev/login',
    image: hisabErp,
    title: { ar: 'نظام حساب ERP السحابي', en: 'Hisab cloud ERP' },
    summary: {
      ar: 'نظام سحابي لإدارة الحسابات والموارد',
      en: 'Cloud system for accounting and resource management',
    },
    description: {
      ar: 'نظام متكامل لإدارة الحسابات والموارد الإدارية للشركات، مع الفواتير الإلكترونية وإدارة المخزون والمبيعات لحظياً.',
      en: 'An integrated ERP for company accounting and administration, with electronic invoicing and real-time inventory and sales tracking.',
    },
    highlights: {
      ar: ['إدارة سحابية', 'فوترة إلكترونية', 'حسابات ومخزون'],
      en: ['Cloud ERP', 'E-invoicing', 'Finance & stock'],
    },
  },
  {
    id: 'projectforge',
    category: 'business',
    url: 'https://projectforge-e3q.pages.dev/',
    image: projectforge,
    title: { ar: 'منصة ProjectForge', en: 'ProjectForge' },
    summary: {
      ar: 'مساحة عمل لتنسيق الفرق البرمجية والهندسية',
      en: 'Workspace for engineering and software teams',
    },
    description: {
      ar: 'منصة لتنسيق فرق التطوير البرمجي والهندسي وجدولة المهام وتتبع الإنجاز عبر لوحات تفاعلية.',
      en: 'A platform for coordinating engineering teams, scheduling tasks and tracking progress on interactive boards.',
    },
    highlights: {
      ar: ['إدارة المشاريع', 'لوحات كانبان', 'مزامنة المهام'],
      en: ['Project management', 'Kanban boards', 'Task sync'],
    },
  },
  {
    id: 'cablexperts',
    category: 'business',
    url: 'https://cabltexperts.com/',
    image: cablexperts,
    title: { ar: 'منصة خبراء الكابلات', en: 'Cable Experts' },
    summary: {
      ar: 'بوابة حلول وتوريدات كابلات الطاقة والاتصالات',
      en: 'Power and telecom cable supply portal',
    },
    description: {
      ar: 'موقع لشركة متخصصة في توريد كابلات الجهد العالي والمتوسط والاتصالات للمشاريع الكبرى، مع المواصفات الفنية.',
      en: 'Website for a company supplying high- and medium-voltage and telecom cables to large projects, including technical specifications.',
    },
    highlights: {
      ar: ['كابلات صناعية', 'مواصفات هندسية', 'توريدات'],
      en: ['Industrial cables', 'Engineering specs', 'Supply'],
    },
  },
  {
    id: 'cableksa',
    category: 'business',
    url: 'https://cableksa.com/',
    image: cableksa,
    title: { ar: 'كابلات السعودية', en: 'Cable KSA' },
    summary: {
      ar: 'بوابة أنظمة ومواصفات الكابلات',
      en: 'Cable systems and specifications portal',
    },
    description: {
      ar: 'بوابة لتوريدات وأنظمة الكابلات في المملكة العربية السعودية توفّر كتالوجات فنية ومواصفات قياسية.',
      en: 'A portal for cable supply and systems in Saudi Arabia, with technical catalogues and standard specifications.',
    },
    highlights: {
      ar: ['بنية تحتية', 'كتالوج فني', 'مواصفات قياسية'],
      en: ['Infrastructure', 'Technical catalogue', 'Standards'],
    },
  },
  {
    id: 'khazama-store',
    category: 'store',
    url: 'https://khazama-store.abdalganih2.workers.dev/',
    image: khazamaStore,
    title: { ar: 'متجر خزامة', en: 'Khazama store' },
    summary: {
      ar: 'متجر إلكتروني سريع يعمل على الحافة السحابية',
      en: 'Fast e-commerce store running on the edge',
    },
    description: {
      ar: 'متجر رقمي يعمل على الحافة السحابية (Cloudflare Workers) لتقديم تجربة تسوق سريعة وآمنة.',
      en: 'An online store running on the cloud edge (Cloudflare Workers) for a fast and secure shopping experience.',
    },
    highlights: {
      ar: ['حوسبة طرفية', 'تسوق رقمي', 'أمان'],
      en: ['Edge computing', 'Online shopping', 'Security'],
    },
  },
  {
    id: 'modeya',
    category: 'store',
    url: 'https://modeya.abdalgani.com/',
    image: modeya,
    title: { ar: 'منصة Modeya للأزياء', en: 'Modeya fashion' },
    summary: { ar: 'متجر رقمي للأزياء', en: 'Fashion online store' },
    description: {
      ar: 'منصة تسوق مخصصة للأزياء والتصميم العصري، مع استعراض المنتجات وسلة شراء متقدمة.',
      en: 'A shopping platform for fashion lines, with product browsing and an advanced cart and checkout.',
    },
    highlights: {
      ar: ['أزياء', 'تجارة إلكترونية', 'سلة شراء'],
      en: ['Fashion', 'E-commerce', 'Checkout'],
    },
  },
  {
    id: 'dermocean',
    category: 'store',
    url: 'https://dermocean-preview.pages.dev/',
    image: dermocean,
    title: { ar: 'منصة Dermocean', en: 'Dermocean' },
    summary: {
      ar: 'منصة لمنتجات العناية بالبشرة',
      en: 'Skincare products platform',
    },
    description: {
      ar: 'واجهة رقمية لمنتجات العناية بالبشرة مع عرض علمي للمكونات والحلول الجلدية.',
      en: 'A digital storefront for skincare products with a scientific breakdown of ingredients and formulas.',
    },
    highlights: {
      ar: ['عناية بالبشرة', 'كتالوج منتجات', 'تجربة مستخدم'],
      en: ['Skincare', 'Product catalogue', 'UX'],
    },
  },
  {
    id: 'interactive-cv',
    category: 'identity',
    url: 'https://cv.abdalgani.com/',
    image: interactiveCv,
    title: { ar: 'السيرة الذاتية التفاعلية', en: 'Interactive CV' },
    summary: { ar: 'سيرة مهنية ومعرض أعمال تفاعلي', en: 'Interactive résumé and portfolio' },
    description: {
      ar: 'واجهة تفاعلية تستعرض المسار المهني والخبرات والمشاريع الهندسية بأسلوب بصري حديث.',
      en: 'An interactive site presenting a professional journey, skills and engineering projects in a modern visual style.',
    },
    highlights: {
      ar: ['تفاعل ثلاثي الأبعاد', 'سيرة ذاتية', 'معرض أعمال'],
      en: ['3D interaction', 'Résumé', 'Portfolio'],
    },
  },
  {
    id: 'taima-alwani',
    category: 'identity',
    url: 'https://taima-alwani.pages.dev/',
    image: taimaAlwani,
    title: { ar: 'موقع تيماء علواني', en: 'Taima Alwani portfolio' },
    summary: { ar: 'هوية رقمية وأعمال إبداعية', en: 'Digital identity and creative work' },
    description: {
      ar: 'موقع شخصي ومهني بتصميم عصري يعرض الهوية الرقمية والأعمال الإبداعية والخبرات.',
      en: 'A personal, professional site with a modern design showcasing digital identity, creative work and expertise.',
    },
    highlights: {
      ar: ['هوية رقمية', 'تصميم عصري', 'معرض أعمال'],
      en: ['Digital identity', 'Modern design', 'Showcase'],
    },
  },
  {
    id: 'rebuild-dn9',
    category: 'identity',
    url: 'https://abdalgani-rebuild-dn9.pages.dev/',
    image: rebuildDn9,
    title: { ar: 'بوابة الأعمال والمشاريع', en: 'Projects gateway' },
    summary: { ar: 'بوابة لتطبيقات الويب الحديثة', en: 'Hub of modern web applications' },
    description: {
      ar: 'منصة تستعرض تطبيقات ونماذج برمجية مبنية بتقنيات الويب الحديثة عالية الأداء.',
      en: 'A portal presenting applications and prototypes built with modern, high-performance web technologies.',
    },
    highlights: {
      ar: ['تطبيقات ويب', 'معمارية سحابية', 'أداء عالٍ'],
      en: ['Web apps', 'Cloud architecture', 'Performance'],
    },
  },
  {
    id: 'arduino-lab',
    category: 'tool',
    url: 'https://arduino-lab.pages.dev/',
    image: arduinoLab,
    title: { ar: 'مختبر آردوينو التفاعلي', en: 'Arduino virtual lab' },
    summary: {
      ar: 'بيئة محاكاة لاختبار الدوائر الإلكترونية',
      en: 'Simulation environment for electronic circuits',
    },
    description: {
      ar: 'بيئة محاكاة في المتصفح لتجربة وبرمجة دوائر الآردوينو والحساسات واختبار الأكواد افتراضياً قبل التنفيذ على العتاد.',
      en: 'An in-browser simulator to wire and program Arduino circuits and sensors and test code virtually before building the hardware.',
    },
    highlights: {
      ar: ['محاكاة إلكترونية', 'حساسات', 'دوائر تفاعلية'],
      en: ['Circuit simulation', 'Sensors', 'Interactive circuits'],
    },
  },
  {
    id: 'wpu-cover',
    category: 'tool',
    url: 'https://wpu-cover.pages.dev/',
    image: wpuCover,
    title: { ar: 'مصمم أغلفة الأبحاث والكتب', en: 'Report & book cover designer' },
    summary: {
      ar: 'أداة لتوليد أغلفة الأبحاث والكتب',
      en: 'Generator for report and book covers',
    },
    description: {
      ar: 'أداة تفاعلية لتصميم أغلفة الكتب والأبحاث والمشاريع الجامعية وتصديرها بجودة طباعية.',
      en: 'An interactive tool for designing covers for books, research papers and university projects, exported at print quality.',
    },
    highlights: {
      ar: ['أغلفة أبحاث', 'توليد تصاميم', 'تصدير للطباعة'],
      en: ['Report covers', 'Design generator', 'Print export'],
    },
  },
  {
    id: 'md-2-pdf',
    category: 'tool',
    url: 'https://md-2-pdf.pages.dev/',
    image: md2pdf,
    title: { ar: 'محوّل Markdown إلى PDF', en: 'Markdown to PDF converter' },
    summary: {
      ar: 'تحويل المستندات إلى ملفات جاهزة للطباعة',
      en: 'Turns documents into print-ready files',
    },
    description: {
      ar: 'أداة تحوّل مستندات Markdown والنصوص إلى ملفات PDF منسّقة وجاهزة للطباعة والمشاركة.',
      en: 'Converts Markdown and text documents into formatted PDF files ready to print and share.',
    },
    highlights: {
      ar: ['Markdown', 'تصدير PDF', 'أدوات مكتبية'],
      en: ['Markdown', 'PDF export', 'Productivity'],
    },
  },
];
