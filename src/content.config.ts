import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/articles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      seoTitle: z.string(),
      description: z.string().max(260),
      excerpt: z.string(),
      titleEn: z.string(),
      excerptEn: z.string(),
      category: z.string(),
      categoryEn: z.string(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      cover: image(),
      tags: z.array(z.string()),
      related: z.array(z.string()).default([]),
    }),
});

export const collections = { articles };
