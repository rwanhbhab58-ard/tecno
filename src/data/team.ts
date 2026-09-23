import type { ImageMetadata } from 'astro';
import type { Lang } from './site';
import abdulghani from '~/assets/team/abdulghani.jpg';

export interface TeamMember {
  id: string;
  name: Record<Lang, string>;
  role: Record<Lang, string>;
  bio: Record<Lang, string>;
  skills: Record<Lang, readonly string[]>;
  photo: ImageMetadata;
}

/**
 * Only verified people are listed. The previous site padded this list with
 * stock-photo placeholders; those were removed on purpose.
 */
export const team: readonly TeamMember[] = [
  {
    id: 'abdulghani',
    name: { ar: 'م. عبد الغني', en: 'Eng. Abdulghani' },
    role: { ar: 'مدير الفريق التقني', en: 'Technical Team Director' },
    bio: {
      ar: 'يقود الاستراتيجية التقنية في تكنو إنجاز، ويشرف على تخطيط المشاريع وتوزيع المهام، ويوجّه المهندسين والمطورين في مشاريع الذكاء الاصطناعي والأنظمة المدمجة وتطوير الويب.',
      en: 'Leads technical strategy at Techno Enjaz, oversees project planning and task allocation, and mentors engineers and developers across AI, embedded systems and web development projects.',
    },
    skills: {
      ar: ['قيادة الفرق التقنية', 'معمارية الأنظمة والذكاء الاصطناعي', 'إدارة المشاريع', 'التوجيه والإشراف'],
      en: ['Technical leadership', 'AI & systems architecture', 'Project management', 'Mentoring'],
    },
    photo: abdulghani,
  },
];
