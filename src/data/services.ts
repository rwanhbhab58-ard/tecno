import type { Lang } from './site';
import type { ProjectCategory } from './projects';
import type { IconName } from '~/lib/icons';

export interface Service {
  id: string;
  icon: IconName;
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
  points: Record<Lang, readonly string[]>;
  /** Project categories that demonstrate this service. */
  projectCategories: readonly ProjectCategory[];
  /** Article slugs that go deeper into the underlying technology. */
  articles: readonly string[];
}

export const services: readonly Service[] = [
  {
    id: 'graduation-projects',
    icon: 'graduation',
    title: { ar: 'مشاريع التخرج والمشاريع الهندسية', en: 'Graduation & engineering projects' },
    summary: {
      ar: 'نرافق طلاب الهندسة والباحثين من الفكرة إلى النموذج العامل والتوثيق الكامل.',
      en: 'We support engineering students and researchers from idea to working prototype and full documentation.',
    },
    points: {
      ar: [
        'اختيار الفكرة وتحديد نطاق المشروع ومتطلباته',
        'تصميم وتنفيذ النموذج العملي أو البرمجي',
        'التوثيق: تقرير PDF ومستند Word قابل للتعديل وعرض تقديمي',
        'التجهيز للعرض والمناقشة',
      ],
      en: [
        'Choosing the idea and defining scope and requirements',
        'Designing and building the hardware or software prototype',
        'Documentation: PDF report, editable Word document and slides',
        'Preparing for the presentation and defence',
      ],
    },
    projectCategories: ['ai', 'vision', 'robotics', 'web', 'mobile'],
    articles: ['internet-of-things-iot', 'embedded-serial-protocols', 'ai-image-classification'],
  },
  {
    id: 'ai-computer-vision',
    icon: 'eye',
    title: { ar: 'الذكاء الاصطناعي والرؤية الحاسوبية', en: 'AI & computer vision' },
    summary: {
      ar: 'أنظمة تتعرف على الوجوه والأجسام وتصنّف الصور الطبية وتفهم اللغة.',
      en: 'Systems that recognise faces and objects, classify medical images and understand language.',
    },
    points: {
      ar: [
        'التعرف على الوجه وكشف الأجسام في بث الكاميرات',
        'تصنيف الصور الطبية بالتعلم العميق',
        'روبوتات المحادثة ومعالجة اللغة العربية',
        'تحليل تعابير الوجه والإيماءات',
      ],
      en: [
        'Face recognition and object detection on camera streams',
        'Medical image classification with deep learning',
        'Chatbots and Arabic language processing',
        'Facial expression and gesture analysis',
      ],
    },
    projectCategories: ['ai', 'vision'],
    articles: ['ai-image-classification', 'facial-expression-recognition-ai', 'next-token-prediction'],
  },
  {
    id: 'robotics-embedded-iot',
    icon: 'cpu',
    title: { ar: 'الروبوتات والأنظمة المدمجة وإنترنت الأشياء', en: 'Robotics, embedded systems & IoT' },
    summary: {
      ar: 'أذرع روبوتية وروبوتات متحركة وأنظمة تحكم وحساسات متصلة مبنية على Arduino وESP وغيرها.',
      en: 'Robotic arms, mobile robots, control systems and connected sensors built on Arduino, ESP and more.',
    },
    points: {
      ar: [
        'أذرع روبوتية للفرز واللحام والمناولة',
        'روبوتات استكشاف وطائرات مسيّرة مع بث فيديو',
        'أنظمة تحكم صناعية ومراقبة بالحساسات',
        'واجهات الدماغ والحاسوب (EEG)',
      ],
      en: [
        'Robotic arms for sorting, welding and handling',
        'Exploration robots and drones with video streaming',
        'Industrial control and sensor-based monitoring',
        'Brain–computer interfaces (EEG)',
      ],
    },
    projectCategories: ['robotics'],
    articles: ['internet-of-things-iot', 'embedded-serial-protocols', '5g-iot'],
  },
  {
    id: 'web-development',
    icon: 'globe',
    title: { ar: 'تطوير المواقع والمتاجر والأنظمة السحابية', en: 'Websites, stores & cloud systems' },
    summary: {
      ar: 'مواقع شركات ومتاجر إلكترونية وأنظمة إدارة وأدوات ويب سريعة ومنشورة على الإنترنت.',
      en: 'Company websites, online stores, management systems and web tools—fast and deployed live.',
    },
    points: {
      ar: [
        'أنظمة إدارة الموارد والحسابات (ERP)',
        'متاجر إلكترونية ومواقع شركات',
        'مواقع شخصية ومعارض أعمال',
        'أدوات ويب ومختبرات محاكاة تفاعلية',
      ],
      en: [
        'Resource and accounting systems (ERP)',
        'Online stores and company websites',
        'Personal sites and portfolios',
        'Web tools and interactive simulation labs',
      ],
    },
    projectCategories: ['web'],
    articles: ['model-context-protocol-mcp'],
  },
  {
    id: 'mobile-apps',
    icon: 'phone',
    title: { ar: 'تطبيقات الموبايل', en: 'Mobile apps' },
    summary: {
      ar: 'تطبيقات هاتف متعددة المنصات مبنية بـ Flutter للتعليم والسياحة والإنتاجية.',
      en: 'Cross-platform Flutter apps for education, tourism and productivity.',
    },
    points: {
      ar: ['تطبيقات Flutter لأندرويد وiOS', 'خرائط تفاعلية وتحديد الموقع', 'تكامل مع خدمات الذكاء الاصطناعي'],
      en: ['Flutter apps for Android and iOS', 'Interactive maps and geolocation', 'Integration with AI services'],
    },
    projectCategories: ['mobile'],
    articles: ['smart-ai-ride-pooling'],
  },
];
