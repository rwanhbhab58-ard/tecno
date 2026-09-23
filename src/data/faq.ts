import type { Lang } from './site';
import type { RouteKey } from '~/i18n/ui';

export interface FaqItem {
  id: string;
  question: Record<Lang, string>;
  /** Answer-first: the first sentence answers the question directly. */
  answer: Record<Lang, string>;
  link?: { route: RouteKey; label: Record<Lang, string> };
}

export interface FaqGroup {
  id: string;
  title: Record<Lang, string>;
  items: readonly FaqItem[];
}

export const faqGroups: readonly FaqGroup[] = [
  {
    id: 'about',
    title: { ar: 'عن تكنو إنجاز', en: 'About Techno Enjaz' },
    items: [
      {
        id: 'what-is',
        question: { ar: 'ما هي تكنو إنجاز؟', en: 'What is Techno Enjaz?' },
        answer: {
          ar: 'تكنو إنجاز مكتب هندسي في مدينة حماة السورية ينفّذ مشاريع التخرج والمشاريع الهندسية في الذكاء الاصطناعي والرؤية الحاسوبية والروبوتات وأنظمة التحكم، ويطوّر المواقع والمتاجر والأنظمة السحابية، وينشر مقالات تقنية عربية مجانية.',
          en: 'Techno Enjaz is an engineering office in Hama, Syria. It builds graduation and engineering projects in AI, computer vision, robotics and control systems, develops websites, online stores and cloud systems, and publishes free Arabic technical articles.',
        },
        link: { route: 'about', label: { ar: 'تعرّف علينا', en: 'About us' } },
      },
      {
        id: 'location',
        question: { ar: 'أين يقع مكتب تكنو إنجاز؟', en: 'Where is the Techno Enjaz office?' },
        answer: {
          ar: 'يقع المكتب في حماة، ساحة العاصي، بناء الخاني، بجوار أفران السلام، في الطابق الرابع. يمكنك فتح الموقع مباشرة على خرائط Google من صفحة التواصل.',
          en: 'The office is in Hama, Syria: Al-Assi Square, Al-Khani Building, next to Al-Salam Bakeries, 4th floor. You can open the exact location in Google Maps from the contact page.',
        },
        link: { route: 'contact', label: { ar: 'العنوان والخريطة', en: 'Address and map' } },
      },
      {
        id: 'remote',
        question: {
          ar: 'هل تعملون مع عملاء من خارج حماة أو خارج سوريا؟',
          en: 'Do you work with clients outside Hama or outside Syria?',
        },
        answer: {
          ar: 'نعم. يمكن متابعة المشروع بالكامل عن بُعد عبر واتساب والبريد الإلكتروني، ومن أعمالنا مواقع لعملاء خارج سوريا مثل بوابة «كابلات السعودية».',
          en: 'Yes. Projects can be managed fully remotely over WhatsApp and email; our work includes websites for clients outside Syria, such as the Cable KSA portal.',
        },
        link: { route: 'webProjects', label: { ar: 'مشاريع الويب', en: 'Web projects' } },
      },
    ],
  },
  {
    id: 'projects',
    title: { ar: 'مشاريع التخرج والمشاريع الهندسية', en: 'Graduation & engineering projects' },
    items: [
      {
        id: 'graduation-help',
        question: { ar: 'هل تنفّذون مشاريع التخرج لطلاب الهندسة؟', en: 'Do you build graduation projects for engineering students?' },
        answer: {
          ar: 'نعم. نعمل على مشاريع التخرج في الذكاء الاصطناعي والرؤية الحاسوبية والروبوتات وأنظمة التحكم وتطبيقات الويب والموبايل، من تحديد الفكرة وحتى النموذج العامل والتوثيق.',
          en: 'Yes. We work on graduation projects in AI, computer vision, robotics, control systems, and web and mobile apps—from defining the idea to a working prototype and documentation.',
        },
        link: { route: 'services', label: { ar: 'الخدمات', en: 'Services' } },
      },
      {
        id: 'deliverables',
        question: { ar: 'ماذا يتضمن تسليم المشروع الهندسي؟', en: 'What does a project handover include?' },
        answer: {
          ar: 'يختلف ذلك حسب المشروع، لكن التوثيق عادةً يشمل تقريراً بصيغة PDF ومستند Word قابلاً للتعديل وعرضاً تقديمياً، إلى جانب النموذج العملي أو البرمجي. يمكنك الاطلاع على أمثلة حقيقية من ملفات التوثيق في صفحة المشاريع.',
          en: 'It depends on the project, but documentation usually includes a PDF report, an editable Word document and a slide deck, alongside the hardware or software prototype. Real documentation samples are linked on the projects page.',
        },
        link: { route: 'projects', label: { ar: 'المشاريع الهندسية', en: 'Engineering projects' } },
      },
      {
        id: 'own-idea',
        question: { ar: 'هل يمكنني اقتراح فكرة مشروعي الخاصة؟', en: 'Can I bring my own project idea?' },
        answer: {
          ar: 'نعم. أرسل لنا وصفاً مختصراً للفكرة واختصاصك وجامعتك، ونراجع معك قابلية التنفيذ والنطاق المناسب قبل البدء.',
          en: 'Yes. Send a short description of the idea, your major and university, and we will review feasibility and the right scope with you before starting.',
        },
        link: { route: 'contact', label: { ar: 'أرسل فكرتك', en: 'Send your idea' } },
      },
    ],
  },
  {
    id: 'web',
    title: { ar: 'تطوير المواقع والتطبيقات', en: 'Websites & apps' },
    items: [
      {
        id: 'web-types',
        question: { ar: 'ما أنواع المواقع التي تطوّرونها؟', en: 'What kinds of websites do you build?' },
        answer: {
          ar: 'نطوّر أنظمة إدارة الموارد والحسابات (ERP)، ومواقع الشركات، والمتاجر الإلكترونية، والمواقع الشخصية ومعارض الأعمال، وأدوات الويب التفاعلية. جميع الأمثلة المعروضة منشورة ويمكن تجربتها مباشرة.',
          en: 'We build ERP and accounting systems, company websites, online stores, personal sites and portfolios, and interactive web tools. Every example we show is live and can be tried directly.',
        },
        link: { route: 'webProjects', label: { ar: 'جرّب مشاريعنا الحية', en: 'Try our live projects' } },
      },
      {
        id: 'mobile',
        question: { ar: 'هل تطوّرون تطبيقات موبايل؟', en: 'Do you develop mobile apps?' },
        answer: {
          ar: 'نعم، نطوّر تطبيقات متعددة المنصات بتقنية Flutter تعمل على أندرويد وiOS، مثل تطبيق FocusBac لتنظيم الدراسة والتطبيق السياحي الذكي.',
          en: 'Yes, we build cross-platform Flutter apps for Android and iOS, such as the FocusBac study planner and the smart tourism guide.',
        },
      },
    ],
  },
  {
    id: 'process',
    title: { ar: 'التكلفة والمدة وطريقة البدء', en: 'Cost, timeline and getting started' },
    items: [
      {
        id: 'cost',
        question: { ar: 'كم تكلفة المشروع؟', en: 'How much does a project cost?' },
        answer: {
          ar: 'لا توجد تسعيرة ثابتة؛ تعتمد التكلفة على نوع المشروع وحجمه والمكونات المطلوبة. أرسل تفاصيل مشروعك وسنرسل لك تقديراً واضحاً قبل أي التزام.',
          en: 'There is no fixed price; cost depends on the type and size of the project and the components required. Send your project details and we will reply with a clear estimate before any commitment.',
        },
        link: { route: 'contact', label: { ar: 'اطلب تقديراً', en: 'Request an estimate' } },
      },
      {
        id: 'timeline',
        question: { ar: 'كم يستغرق تنفيذ المشروع؟', en: 'How long does a project take?' },
        answer: {
          ar: 'تختلف المدة حسب تعقيد المشروع وتوفر القطع والمتطلبات. نتفق معك على جدول زمني واضح عند تحديد النطاق، ويُفضَّل التواصل مبكراً قبل موعد التسليم الجامعي.',
          en: 'It depends on complexity, parts availability and requirements. We agree a clear schedule with you when defining the scope; contacting us early, well before your university deadline, is best.',
        },
      },
      {
        id: 'start',
        question: { ar: 'كيف أبدأ مشروعي معكم؟', en: 'How do I start a project with you?' },
        answer: {
          ar: 'راسلنا على واتساب أو عبر نموذج التواصل بوصف مختصر للمشروع، ثم نحدد معك النطاق والتكلفة والمدة، ونبدأ التنفيذ مع متابعة دورية حتى التسليم.',
          en: 'Message us on WhatsApp or through the contact form with a short description. We then agree scope, cost and timeline with you and start work, with regular updates until handover.',
        },
        link: { route: 'contact', label: { ar: 'تواصل معنا', en: 'Contact us' } },
      },
    ],
  },
  {
    id: 'contact',
    title: { ar: 'التواصل والمحتوى', en: 'Contact & content' },
    items: [
      {
        id: 'channels',
        question: { ar: 'ما طرق التواصل مع تكنو إنجاز؟', en: 'How can I contact Techno Enjaz?' },
        answer: {
          ar: 'عبر الهاتف أو واتساب على الرقم ‎+963 958 794 195، أو البريد info@technoenjaz.com، أو إنستغرام ‎@TECHNO_ENJAZ، أو صفحة فيسبوك، أو بزيارة المكتب في حماة.',
          en: 'By phone or WhatsApp on +963 958 794 195, by email at info@technoenjaz.com, on Instagram @TECHNO_ENJAZ, on Facebook, or by visiting the office in Hama.',
        },
        link: { route: 'contact', label: { ar: 'صفحة التواصل', en: 'Contact page' } },
      },
      {
        id: 'articles',
        question: { ar: 'هل المقالات التقنية في الموقع مجانية؟', en: 'Are the technical articles free?' },
        answer: {
          ar: 'نعم. جميع المقالات مجانية ومكتوبة بالعربية، وتغطي الذكاء الاصطناعي وإنترنت الأشياء وشبكات 5G والأنظمة المدمجة، مع قائمة مصادر موثوقة في نهاية كل مقال.',
          en: 'Yes. All articles are free and written in Arabic, covering AI, IoT, 5G and embedded systems, each with a list of trusted sources at the end.',
        },
        link: { route: 'articles', label: { ar: 'تصفّح المقالات', en: 'Browse articles' } },
      },
    ],
  },
];

export const allFaqItems: readonly FaqItem[] = faqGroups.flatMap((g) => g.items);

/** A short, high-intent subset for the home page. */
export const homeFaqIds = ['what-is', 'graduation-help', 'cost', 'start'] as const;
