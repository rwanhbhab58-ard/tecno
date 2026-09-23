import type { Lang } from './site';

export type ProjectCategory = 'ai' | 'vision' | 'robotics' | 'web' | 'mobile';

export const projectCategories: Record<ProjectCategory, Record<Lang, string>> = {
  ai: { ar: 'ذكاء اصطناعي', en: 'Artificial intelligence' },
  vision: { ar: 'رؤية حاسوبية', en: 'Computer vision' },
  robotics: { ar: 'روبوتات وأنظمة تحكم', en: 'Robotics & control' },
  web: { ar: 'تطبيقات ويب', en: 'Web applications' },
  mobile: { ar: 'تطبيقات موبايل', en: 'Mobile apps' },
};

/** Google Drive documentation. A project either has individual files or a shared folder. */
export interface ProjectDocs {
  pdf?: string;
  docx?: string;
  pptx?: string;
  folder?: string;
}

export interface EngineeringProject {
  id: string;
  category: ProjectCategory;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  tags: Record<Lang, readonly string[]>;
  docs: ProjectDocs;
}

export function driveFileUrl(id: string): string {
  return `https://drive.google.com/file/d/${id}/view`;
}

export function driveFolderUrl(id: string): string {
  return `https://drive.google.com/drive/folders/${id}`;
}

export const projects: readonly EngineeringProject[] = [
  {
    id: 'wanted-persons-recognition',
    category: 'vision',
    title: {
      ar: 'التعرف على الأشخاص المطلوبين باستخدام التعلم العميق',
      en: 'Wanted persons recognition using deep learning',
    },
    description: {
      ar: 'منظومة أمنية تعتمد على الشبكات العصبية الالتفافية لتحديد ومطابقة وجوه الأشخاص المطلوبين فورياً عبر بث كاميرات المراقبة الحية.',
      en: 'A security system that uses convolutional neural networks to identify and match the faces of wanted individuals in real time from live CCTV streams.',
    },
    tags: {
      ar: ['تعلم عميق', 'رؤية حاسوبية', 'أمن المراقبة', 'شبكات عصبية'],
      en: ['Deep learning', 'Computer vision', 'Surveillance', 'Neural networks'],
    },
    docs: {
      pdf: '1edEWYRLqtgSVRw0Eq7NmCldb_fxzi5OW',
      docx: '1mJkkwOQ0PFAeyu7UVamO5BW4kzI3MfoE',
      pptx: '1GkF6h9BidlT4Rk4WZjNtM_-hdzOy7Dm8',
    },
  },
  {
    id: 'breast-cancer-ai',
    category: 'ai',
    title: {
      ar: 'تشخيص سرطان الثدي باستخدام الذكاء الاصطناعي',
      en: 'Breast cancer diagnosis using artificial intelligence',
    },
    description: {
      ar: 'نموذج مساعد للكوادر الطبية يعتمد على تعلم الآلة ومعالجة الصور الإشعاعية لتصنيف الأورام الخبيثة والحميدة ودعم الكشف المبكر.',
      en: 'A clinical decision-support model using machine learning and medical image analysis to classify benign and malignant tumours and support early detection.',
    },
    tags: {
      ar: ['ذكاء اصطناعي طبي', 'تعلم آلة', 'تشخيص أورام', 'معالجة صور'],
      en: ['Medical AI', 'Machine learning', 'Tumour diagnosis', 'Image processing'],
    },
    docs: {
      pdf: '1VrYznMsLRQ_gwD5UM9jBSiI624H-JkyO',
      docx: '1Zkngyqb4vj5T5gfApVMWqDj4nAWbnFC-',
      pptx: '1vlqwCOU7f4c40O4BhDniJAHJK5m5_UR3',
    },
  },
  {
    id: 'facial-attendance',
    category: 'vision',
    title: {
      ar: 'تسجيل الحضور والغياب الذكي عبر التعرف على الوجه',
      en: 'Smart attendance tracking via facial recognition',
    },
    description: {
      ar: 'نظام لأتمتة تفقد الحضور في القاعات والمحاضرات عبر التعرف البيومتري على الوجوه مع كشف التلاعب وإصدار تقارير فورية للإدارة.',
      en: 'Automates attendance in classrooms and lecture halls using biometric face recognition with spoof detection and instant reports for administrators.',
    },
    tags: {
      ar: ['رؤية حاسوبية', 'تسجيل حضور', 'كشف التلاعب', 'بيومترية'],
      en: ['Computer vision', 'Attendance', 'Spoof detection', 'Biometrics'],
    },
    docs: {
      pdf: '19pKSp0cYDPD_1zqP9cPLpLqrZ25z4Huc',
      docx: '1qA2p8S8UoB2BwwVbLcJPKXhErwqqYwBQ',
      pptx: '16tDQ0l92wkMWr9u5NBB1LSvjUTNxJSN8',
    },
  },
  {
    id: 'smart-robotic-arm',
    category: 'robotics',
    title: {
      ar: 'ذراع ذكية لفرز وتصنيف المنتجات بمعالجة الصورة',
      en: 'Smart robotic arm for product sorting with image processing',
    },
    description: {
      ar: 'منظومة صناعية تجمع ذراعاً ميكانيكية متعددة المحاور وكاميرا رقمية للتعرف على المنتجات وفرزها آلياً على خطوط الإنتاج.',
      en: 'An industrial cell combining a multi-axis robotic arm with a camera to recognise, inspect and sort products automatically on a production line.',
    },
    tags: {
      ar: ['روبوتات', 'أتمتة صناعية', 'معالجة صور', 'ميكاترونيكس'],
      en: ['Robotics', 'Industrial automation', 'Image processing', 'Mechatronics'],
    },
    docs: {
      pdf: '1CUXwNt3zoE44c_zc0flbUN11DhPMzYfZ',
      pptx: '15yk-1MTOtw8435TeihT_ej1pUZptVYlZ',
    },
  },
  {
    id: 'bank-vault-security',
    category: 'robotics',
    title: {
      ar: 'نظام أمني ذكي للتحكم في الدخول إلى خزينة بنك',
      en: 'Smart access control system for a bank vault',
    },
    description: {
      ar: 'بنية أمنية متعددة المستويات تعتمد على مطابقة الوجه والمستشعرات لحماية المواقع البنكية الحساسة وتوثيق محاولات الدخول فورياً.',
      en: 'A multi-layer security system combining face verification and sensors to protect sensitive banking areas and log access attempts in real time.',
    },
    tags: {
      ar: ['أنظمة تحكم', 'أمن بنكي', 'بصمة وجه', 'حساسات'],
      en: ['Control systems', 'Bank security', 'Face verification', 'Sensors'],
    },
    docs: {
      pdf: '1t_BEU0HM4LR1iT_fVK52qPILA3nBT_LZ',
      docx: '1anZypriAX6upaVHJAMka8Xagt6zboCP0',
      pptx: '111DPWXqP1pxK727BZYM7sCkdg_oEof0v',
    },
  },
  {
    id: 'ai-technical-chatbot',
    category: 'ai',
    title: {
      ar: 'روبوت دردشة تقني ذكي ومساعد صوتي',
      en: 'Technical chatbot and voice assistant',
    },
    description: {
      ar: 'وكيل محادثة يقدّم إجابات تقنية واستشارات هندسية عبر معالجة اللغات الطبيعية مع دعم الأوامر الصوتية.',
      en: 'A conversational agent that answers technical and engineering questions using natural language processing, with voice command support.',
    },
    tags: {
      ar: ['ذكاء اصطناعي', 'معالجة لغات طبيعية', 'روبوت محادثة', 'مساعد صوتي'],
      en: ['AI', 'NLP', 'Chatbot', 'Voice assistant'],
    },
    docs: {
      pdf: '14ohPtWmGQizM39irdd7EvvTH2nBXFv_L',
      docx: '1o85lu5ganVvn1Mfr5gnGXRT1ErnM_E96',
      pptx: '18Giu9Cc7x1dbtrbPCZpGrYLVZuNMh-50',
    },
  },
  {
    id: 'chemical-fluid-mixing',
    category: 'robotics',
    title: {
      ar: 'محطة أتمتة خلط السوائل الكيميائية والمراقبة الصناعية',
      en: 'Automated chemical fluid mixing and monitoring station',
    },
    description: {
      ar: 'منظومة للتحكم الدقيق بنسب خلط السوائل ودرجات الحرارة ومعدلات التدفق عبر مستشعرات ووحدات تحكم رقمية وواجهة SCADA للمراقبة.',
      en: 'Precise control of mixing ratios, temperature and flow rates using industrial sensors, digital controllers and a SCADA monitoring interface.',
    },
    tags: {
      ar: ['أنظمة تحكم', 'أتمتة صناعية', 'SCADA', 'مستشعرات'],
      en: ['Control systems', 'Industrial automation', 'SCADA', 'Sensors'],
    },
    docs: {
      pdf: '1prsxpaD2gPt_nGNBrPNr6YiPP_Mwv_HL',
      docx: '1DsK2EFN9skWxbwW5e46M-0niClNJoSJK',
    },
  },
  {
    id: 'campus-face-id',
    category: 'vision',
    title: {
      ar: 'تطبيق جامعي للتعرف البيومتري على وجوه الطلاب',
      en: 'University campus biometric student identification',
    },
    description: {
      ar: 'منظومة تربط الكاميرات بقاعدة بيانات مركزية للتعرف الفوري على هوية الطلاب وإدارة الدخول الآمن إلى المرافق.',
      en: 'Connects campus cameras to a central database to identify students instantly and manage secure access to facilities.',
    },
    tags: {
      ar: ['رؤية حاسوبية', 'هوية بيومترية', 'قواعد بيانات', 'أنظمة ذكية'],
      en: ['Computer vision', 'Biometric ID', 'Databases', 'Smart systems'],
    },
    docs: {
      pdf: '1uaf9OpfyGOLZl5TNU1DZa3XgNSdEUNzt',
      docx: '1g3eJk6rECQWsGW8aVkVmASm-JyCsoFkA',
    },
  },
  {
    id: 'weapon-detection-ai',
    category: 'vision',
    title: {
      ar: 'نظام الكشف المبكر عن الأسلحة بالذكاء الاصطناعي',
      en: 'AI weapon detection system for public safety',
    },
    description: {
      ar: 'خوارزمية تحلّل بث كاميرات المراقبة للكشف التلقائي عن الأسلحة وإطلاق إنذارات مبكرة لغرف التحكم.',
      en: 'Analyses CCTV feeds to detect weapons automatically and send early alerts to control rooms.',
    },
    tags: {
      ar: ['رؤية حاسوبية', 'كشف كائنات', 'أمن وسلامة', 'تنبيه فوري'],
      en: ['Computer vision', 'Object detection', 'Public safety', 'Alerts'],
    },
    docs: { folder: '1GsAvNzIBXdzGaC_JQXAvhet-PZ-HVwGZ' },
  },
  {
    id: 'cybershield-security',
    category: 'ai',
    title: {
      ar: 'CyberShield: فحص الملفات والروابط بالذكاء الاصطناعي',
      en: 'CyberShield: AI-powered file and URL scanning',
    },
    description: {
      ar: 'تطبيق دفاع سيبراني يستخدم تعلم الآلة والتحليل السلوكي لكشف البرمجيات الخبيثة وروابط التصيد قبل فتحها.',
      en: 'A cyber-defence app that uses machine learning and behavioural analysis to flag malware and phishing links before they are opened.',
    },
    tags: {
      ar: ['أمن سيبراني', 'ذكاء اصطناعي', 'حماية بيانات', 'كشف تهديدات'],
      en: ['Cybersecurity', 'AI', 'Data protection', 'Threat detection'],
    },
    docs: { folder: '1_0Vu1ur1fRK-zDW9l6fmUmr_pThI48Mc' },
  },
  {
    id: 'projectforge-platform',
    category: 'web',
    title: {
      ar: 'منصة ProjectForge لإدارة المشاريع وبناء الفرق',
      en: 'ProjectForge: project planning and team-building platform',
    },
    description: {
      ar: 'بيئة عمل سحابية تسهّل تشكيل الفرق وتوزيع المهام وتتبع الإنجاز وتوثيق المشاريع الهندسية.',
      en: 'A cloud workspace for forming teams, assigning tasks, tracking milestones and documenting engineering projects.',
    },
    tags: {
      ar: ['تطبيقات ويب', 'إدارة مشاريع', 'منصات سحابية', 'فرق عمل'],
      en: ['Web app', 'Project management', 'Cloud platform', 'Teams'],
    },
    docs: { folder: '1GiZkOaMzmw0DrMbXYsjrbiP0IWAyZjIv' },
  },
  {
    id: 'bci-eeg-control',
    category: 'robotics',
    title: {
      ar: 'التحكم بالأجهزة عبر إشارات الدماغ (EEG)',
      en: 'Brain–computer interface (EEG) for device control',
    },
    description: {
      ar: 'واجهة تعالج إشارات النشاط الدماغي بمعالجة الإشارات والذكاء الاصطناعي لتمكين التحكم بالأجهزة دون لمس، لمساعدة ذوي الاحتياجات الخاصة.',
      en: 'Processes EEG signals with signal processing and AI to enable hands-free device control for people with disabilities.',
    },
    tags: {
      ar: ['واجهة دماغ وحاسوب', 'إشارات عصبية', 'معالجة إشارات', 'تعلم آلة'],
      en: ['BCI', 'EEG', 'Signal processing', 'Machine learning'],
    },
    docs: { folder: '1zsHKfZ_0OnHgpq3mQjNrAC0XqIezMxkA' },
  },
  {
    id: 'biomimetic-hand',
    category: 'robotics',
    title: {
      ar: 'ذراع روبوتية تحاكي حركة اليد البشرية بالرؤية الحاسوبية',
      en: 'Robotic hand that mimics human hand motion via computer vision',
    },
    description: {
      ar: 'نظام يتتبع معالم اليد والأصابع بالكاميرا دون حساسات سلكية وينقل الحركة فورياً إلى ذراع روبوتية.',
      en: 'Tracks hand and finger landmarks with a camera—no wired sensors—and mirrors the motion on a robotic hand in real time.',
    },
    tags: {
      ar: ['روبوتات', 'ميكاترونيكس', 'تتبع حركة', 'رؤية حاسوبية'],
      en: ['Robotics', 'Mechatronics', 'Motion tracking', 'Computer vision'],
    },
    docs: { folder: '1PcXk8FeoGCPrkb-VwMq5VXvQ_z--jU1f' },
  },
  {
    id: 'dental-pathology-ai',
    category: 'ai',
    title: {
      ar: 'تشخيص أمراض الفم والأسنان بالذكاء الاصطناعي',
      en: 'Dental and oral disease diagnosis with AI',
    },
    description: {
      ar: 'نظام طبي يحلّل صور الأسنان والأشعة بالشبكات العصبية لكشف التسوس وأمراض اللثة مبكراً ودعم التشخيص السريري.',
      en: 'Analyses dental photos and X-rays with neural networks to detect caries and gum disease early and support clinical diagnosis.',
    },
    tags: {
      ar: ['ذكاء اصطناعي طبي', 'طب أسنان', 'تصوير إشعاعي', 'تشخيص آلي'],
      en: ['Medical AI', 'Dentistry', 'Radiography', 'Automated diagnosis'],
    },
    docs: { folder: '1-AvRZ62CH8nAo2u3RDt1GSCDEzQIE3Kd' },
  },
  {
    id: 'smart-tourism-app',
    category: 'mobile',
    title: {
      ar: 'تطبيق سياحي ذكي مع مرشد سياحي افتراضي',
      en: 'Smart tourism app with a virtual tour guide',
    },
    description: {
      ar: 'تطبيق هاتف يوفّر خرائط تفاعلية وجولات سياحية ومرشداً افتراضياً يعتمد على الذكاء الاصطناعي وتحديد الموقع.',
      en: 'A mobile app with interactive maps, guided tours and an AI tour guide based on the visitor’s location.',
    },
    tags: {
      ar: ['تطبيقات موبايل', 'سياحة ذكية', 'خرائط تفاعلية', 'Flutter'],
      en: ['Mobile app', 'Smart tourism', 'Interactive maps', 'Flutter'],
    },
    docs: { folder: '1fMc_BwC8jzLs6VUb4v0MKXehsXoVHCfU' },
  },
  {
    id: 'focusbac-app',
    category: 'mobile',
    title: {
      ar: 'تطبيق FocusBac للإنتاجية وتنظيم الدراسة',
      en: 'FocusBac: study planning and productivity app',
    },
    description: {
      ar: 'تطبيق مبني بـ Flutter يساعد الطلاب على إدارة الوقت وتنظيم جداول الدراسة وتطبيق تقنية بومودورو مع إحصائيات تقدّم.',
      en: 'A Flutter app that helps students manage time, plan study schedules and use the Pomodoro technique, with progress statistics.',
    },
    tags: {
      ar: ['تطبيقات موبايل', 'Flutter', 'إنتاجية', 'تنظيم وقت'],
      en: ['Mobile app', 'Flutter', 'Productivity', 'Time management'],
    },
    docs: { folder: '1yxjQ4eePI3SDBTSbgcg8StDjS-Lx7ud2' },
  },
  {
    id: 'calorie-vision-counter',
    category: 'vision',
    title: {
      ar: 'حساب السعرات الحرارية بالرؤية الحاسوبية',
      en: 'Calorie estimation with computer vision',
    },
    description: {
      ar: 'يلتقط صورة الوجبة ويتعرف على مكوناتها ويقدّر الحصص والقيمة الغذائية والسعرات الحرارية.',
      en: 'Takes a photo of a meal, recognises its components and estimates portions, nutritional value and calories.',
    },
    tags: {
      ar: ['رؤية حاسوبية', 'تغذية ذكية', 'تعرف على الأطعمة', 'ذكاء اصطناعي'],
      en: ['Computer vision', 'Smart nutrition', 'Food recognition', 'AI'],
    },
    docs: { folder: '1MK6ghtMMgEiEnEyOi_j7cd4nl7KAgcDZ' },
  },
  {
    id: 'smart-security-surveillance',
    category: 'robotics',
    title: {
      ar: 'نظام مراقبة وحماية أمني ذكي',
      en: 'Smart security surveillance and alert system',
    },
    description: {
      ar: 'منصة تربط المستشعرات وكاميرات المراقبة لتحليل المشهد وكشف التسلل وتنبيه غرف العمليات على مدار الساعة.',
      en: 'Links sensors and cameras to analyse scenes, detect intrusions and alert operations rooms around the clock.',
    },
    tags: {
      ar: ['أمن ومراقبة', 'حساسات', 'حماية محيطية', 'تنبيهات'],
      en: ['Surveillance', 'Sensors', 'Perimeter protection', 'Alerts'],
    },
    docs: { folder: '10U5XWxGN65uKJz1MQfiF1Wzsv9FvYrVP' },
  },
  {
    id: 'code-review-assistant',
    category: 'web',
    title: {
      ar: 'مساعد برمجي لتحليل الشيفرات وتحسين جودتها',
      en: 'Code analysis and quality assistant',
    },
    description: {
      ar: 'أداة مدعومة بالذكاء الاصطناعي تفحص الشيفرات وتكشف الثغرات الأمنية ومشكلات الأداء وتقترح تحسينات للبنية.',
      en: 'An AI-assisted tool that reviews code, flags security and performance issues and suggests structural improvements.',
    },
    tags: {
      ar: ['تطبيقات ويب', 'ذكاء اصطناعي', 'مراجعة الكود', 'فحص أمان'],
      en: ['Web app', 'AI', 'Code review', 'Security scanning'],
    },
    docs: { folder: '1N_NmRcYYaClmBF6cfsTJE-ttGsAXF1Ij' },
  },
  {
    id: 'reconnaissance-robot',
    category: 'robotics',
    title: {
      ar: 'روبوت استكشاف ميداني للمهام الخاصة',
      en: 'Field reconnaissance and exploration robot',
    },
    description: {
      ar: 'روبوت مجنزر يناور في البيئات الصعبة ويزوّد المشغّل ببث فيديو حي وقراءات المستشعرات عن بُعد عبر وصلة لاسلكية.',
      en: 'A tracked robot for rough terrain that streams live video and sensor readings to the operator over a wireless link.',
    },
    tags: {
      ar: ['روبوتات', 'أنظمة تحكم', 'استكشاف ميداني', 'اتصالات لاسلكية'],
      en: ['Robotics', 'Control systems', 'Field exploration', 'Wireless'],
    },
    docs: { folder: '16qyg83GH2UevzbX3yUccmP3GcrFy0Ki7' },
  },
  {
    id: 'interactive-learning-robot',
    category: 'ai',
    title: {
      ar: 'روبوت تفاعلي لتعليم الأطفال بالذكاء الاصطناعي',
      en: 'Interactive educational robot for children',
    },
    description: {
      ar: 'روبوت يتواصل مع الأطفال صوتياً وبصرياً لتقديم أنشطة تعليمية وألعاب ذكاء ومتابعة مدى تفاعل الطفل.',
      en: 'A robot that talks and reacts to children to deliver learning activities and puzzles while tracking engagement.',
    },
    tags: {
      ar: ['ذكاء اصطناعي', 'روبوتات تعليمية', 'تفاعل إنسان-آلة', 'تعليم ذكي'],
      en: ['AI', 'Educational robotics', 'HRI', 'Smart learning'],
    },
    docs: { folder: '1MEIYC6GluMPrp7QiC4_CVi-c_ws5fHi3' },
  },
];
