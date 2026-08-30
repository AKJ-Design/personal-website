/**
 * Content collections — build plan step 6.
 *
 * One collection: blog. Posts are Markdown files in src/content/blog/, one
 * file per post, slug = filename (frozen at launch per build plan §2.5 —
 * /blog/wayfare-part-1/ must never change).
 *
 * Reading time is computed from the body (src/lib/posts.ts), never typed into
 * frontmatter — plate values are claims, and a typed number drifts.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /** Publish date, shown in the meta line and used as RSS pubDate. */
    date: z.coerce.date(),
    /** The post-head eyebrow, e.g. "Case study — Wayfare · Part 1 of 2". */
    eyebrow: z.string(),
    /** Index-card and meta description text. */
    excerpt: z.string(),
    tags: z.array(z.string()),
    /** Endplate right-hand text, e.g. what's coming next. */
    next: z.string().optional(),
  }),
});

export const collections = { blog };
