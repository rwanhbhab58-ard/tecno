import type { ImageMetadata } from 'astro';
import type { Lang } from './site';

import droneNano from '~/assets/videos/video-drone-nano.png';
import armWelding from '~/assets/videos/video-arm-welding.png';
import armVision from '~/assets/videos/video-arm-vision.png';

import g01 from '~/assets/gallery/project-01.png';
import g02 from '~/assets/gallery/project-02.png';
import g03 from '~/assets/gallery/project-03.png';
import g04 from '~/assets/gallery/project-04.png';
import g05 from '~/assets/gallery/project-05.png';
import g06 from '~/assets/gallery/project-06.png';
import g07 from '~/assets/gallery/project-07.png';
import g08 from '~/assets/gallery/project-08.png';
import g09 from '~/assets/gallery/project-09.png';
import g10 from '~/assets/gallery/project-10.png';
import g11 from '~/assets/gallery/project-11.png';
import g12 from '~/assets/gallery/project-12.png';
import g13 from '~/assets/gallery/project-13.png';
import g14 from '~/assets/gallery/project-14.png';

import moment1 from '~/assets/moments/moment1.jpg';
import moment2 from '~/assets/moments/moment2.jpg';
import moment3 from '~/assets/moments/moment3.jpg';
import moment4 from '~/assets/moments/moment4.jpg';

export interface Video {
  id: string;
  youtubeId: string;
  /** ISO 8601 duration for VideoObject. */
  duration: string;
  durationLabel: string;
  cover: ImageMetadata;
  title: Record<Lang, string>;
  tag: Record<Lang, string>;
  description: Record<Lang, string>;
}

export const videos: readonly Video[] = [
  {
    id: 'drone-esp-cam',
    youtubeId: '4Sew-i8sB2s',
    duration: 'PT1M7S',
    durationLabel: '1:07',
    cover: droneNano,
    title: {
      ar: 'طائرة درون بمتحكم Arduino وبث مباشر عبر ESP-CAM',
      en: 'Arduino drone with live ESP-CAM streaming',
    },
    tag: { ar: 'طائرات مسيّرة', en: 'Drones' },
    description: {
      ar: 'طائرة درون تعتمد على تثبيت الجايروسكوب والتحكم اللاسلكي RF433 وبث الفيديو الحي عبر ESP-CAM.',
      en: 'A quadcopter combining gyro stabilisation, RF433 wireless control and live video streaming over ESP-CAM.',
    },
  },
  {
    id: 'argon-welding-arm',
    youtubeId: 'L2ya6z4tZhg',
    duration: 'PT1M12S',
    durationLabel: '1:12',
    cover: armWelding,
    title: {
      ar: 'ذراع روبوتية للّحام الدقيق بغاز الأرجون',
      en: 'Robotic arm for precision argon welding',
    },
    tag: { ar: 'روبوتات صناعية', en: 'Industrial robotics' },
    description: {
      ar: 'ذراع روبوتية متعددة المحاور مبرمجة للأتمتة الصناعية ولحام المعادن بدقة باستخدام غاز الأرجون.',
      en: 'A multi-axis robotic arm programmed for industrial automation and precise argon welding of metals.',
    },
  },
  {
    id: 'vision-guided-arm',
    youtubeId: 'poKdf5HdaAM',
    duration: 'PT16S',
    durationLabel: '0:16',
    cover: armVision,
    title: {
      ar: 'التحكم بذراع روبوتية بالرؤية الحاسوبية (Python وOpenCV)',
      en: 'Vision-guided robotic arm with Python and OpenCV',
    },
    tag: { ar: 'رؤية حاسوبية', en: 'Computer vision' },
    description: {
      ar: 'ربط خوارزميات الرؤية الحاسوبية في Python مع متحكم Arduino لتتبع الأجسام وتوجيه الذراع لالتقاطها ذاتياً.',
      en: 'Connects Python computer-vision code to an Arduino controller to track objects and guide the arm to pick them up autonomously.',
    },
  },
];

export interface GalleryItem {
  image: ImageMetadata;
  alt: Record<Lang, string>;
}

export const gallery: readonly GalleryItem[] = [
  { image: g01, alt: { ar: 'روبوت سداسي الأرجل مع ذراع مناولة', en: 'Hexapod robot with a manipulator arm' } },
  { image: g02, alt: { ar: 'روبوت مساعد تفاعلي ناطق', en: 'Interactive talking companion robot' } },
  { image: g03, alt: { ar: 'مركبة استكشافية مع كاميرات رؤية محيطية', en: 'Exploration rover with surround-view cameras' } },
  { image: g04, alt: { ar: 'منظومة عيون أنيماترونية بمحركات دقيقة', en: 'Animatronic robotic eyes driven by micro servos' } },
  { image: g05, alt: { ar: 'محطة عمل هندسية لتطوير الأنظمة والبرمجيات', en: 'Engineering workstation for systems development' } },
  { image: g06, alt: { ar: 'خط فرز صناعي ذكي مع ذراع آلية', en: 'Smart conveyor sorting line with a robotic arm' } },
  { image: g07, alt: { ar: 'ذراع مناولة متعددة المحاور للفرز الدقيق', en: 'Multi-axis pick-and-place robotic arm' } },
  { image: g08, alt: { ar: 'روبوت استكشاف ميداني بنظام تعليق وقياس عن بعد', en: 'All-terrain rover with suspension and telemetry' } },
  { image: g09, alt: { ar: 'روبوت ثنائي الأرجل', en: 'Bipedal walking robot' } },
  { image: g10, alt: { ar: 'ذراع روبوتية صناعية على محور خطي', en: 'Industrial robotic arm on a linear rail' } },
  { image: g11, alt: { ar: 'منظومة واجهة الدماغ والحاسوب EEG', en: 'EEG brain–computer interface setup' } },
  { image: g12, alt: { ar: 'روبوت مجنزر للمراقبة الميدانية', en: 'Tracked inspection robot' } },
  { image: g13, alt: { ar: 'تتبع إيماءات اليد ومعالم الوجه بالرؤية الحاسوبية', en: 'Hand-gesture and facial-landmark tracking with computer vision' } },
  { image: g14, alt: { ar: 'كشك خدمة ذاتية تفاعلي', en: 'Interactive self-service kiosk' } },
];

export const moments: readonly GalleryItem[] = [
  { image: moment1, alt: { ar: 'مهندس من تكنو إنجاز يشرح مشروعاً لطالبات خلال معرض', en: 'A Techno Enjaz engineer explaining a project to students at an exhibition' } },
  { image: moment2, alt: { ar: 'مهندس يختبر دارة ذراع روبوتية صغيرة بجهاز قياس خلال معرض المشاريع', en: 'An engineer testing a small robotic-arm circuit with a multimeter at a project exhibition' } },
  { image: moment3, alt: { ar: 'طالبة بجانب مجسّم منزل ذكي ومشروعها على الحاسوب', en: 'A student standing next to her smart-home model and laptop demo' } },
  { image: moment4, alt: { ar: 'طالبات يتناقشن حول مشروع إلكتروني على طاولة العرض', en: 'Students discussing an electronics project at a demo table' } },
];
