/**
 * Single source of truth for organisation facts (NAP, social profiles, geo).
 * Everything that describes "who we are" in the UI, JSON-LD, sitemap and
 * llms.txt reads from here so the entity description never drifts.
 */
export const site = {
  name: { ar: 'تكنو إنجاز', en: 'Techno Enjaz' },
  legalName: 'Techno Enjaz',
  tagline: {
    ar: 'مكتب هندسي في حماة لمشاريع الذكاء الاصطناعي والروبوتات وتطوير المواقع',
    en: 'An engineering office in Hama, Syria for AI, robotics and web development projects',
  },
  description: {
    ar: 'تكنو إنجاز مكتب هندسي في حماة، سوريا، ينفّذ مشاريع التخرج والمشاريع الهندسية في الذكاء الاصطناعي والرؤية الحاسوبية والروبوتات وأنظمة التحكم، ويطوّر المواقع والمتاجر والأنظمة السحابية، وينشر مقالات تقنية عربية معمّقة.',
    en: 'Techno Enjaz is an engineering office in Hama, Syria. We build graduation and engineering projects in artificial intelligence, computer vision, robotics and control systems, develop websites, online stores and cloud systems, and publish in-depth Arabic technical articles.',
  },
  email: 'info@technoenjaz.com',
  phone: '+963958794195',
  phoneDisplay: '+963 958 794 195',
  whatsapp: 'https://wa.me/963958794195',
  address: {
    street: {
      ar: 'ساحة العاصي، بناء الخاني، بجوار أفران السلام، الطابق الرابع',
      en: 'Al-Assi Square, Al-Khani Building, next to Al-Salam Bakeries, 4th floor',
    },
    locality: { ar: 'حماة', en: 'Hama' },
    region: { ar: 'محافظة حماة', en: 'Hama Governorate' },
    country: { ar: 'سوريا', en: 'Syria' },
    countryCode: 'SY',
    regionCode: 'SY-HM',
  },
  geo: { latitude: 35.1289918, longitude: 36.7540014 },
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=35.1289918,36.7540014',
  mapEmbedUrl: 'https://maps.google.com/maps?q=35.1289918,36.7540014&z=17&output=embed',
  social: {
    instagram: 'https://www.instagram.com/TECHNO_ENJAZ',
    facebook: 'https://www.facebook.com/share/19jb1uyhbg',
  },
  instagramHandle: '@TECHNO_ENJAZ',
  foundingLocation: 'Hama, Syria',
  areaServed: ['SY', 'Arab world'],
  knowsAbout: [
    'Artificial intelligence',
    'Computer vision',
    'Robotics',
    'Embedded systems',
    'Internet of Things',
    'Control systems',
    'Web development',
    'Mobile applications',
  ],
} as const;

export type Lang = 'ar' | 'en';
