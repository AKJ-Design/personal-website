/**
 * The one source for post listings. Home's writing index, /blog/, the About
 * plate's shipped count, RSS and the OG endpoints all read the blog
 * collection through here, so no number or link can drift from the posts
 * that actually exist.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

/** Word count at ~200 wpm, computed from the body — never typed. */
export function readingTime(body: string): string {
  const words = body
    .replace(/<[^>]+>/g, ' ') // raw HTML blocks (figures, disclosures)
    .replace(/[#>*`_]|\[|\]|\(|\)/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
}

/** ISO yyyy-mm-dd, the form the mock and the cards use. */
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export interface PostMeta {
  href: string;
  date: string;
  readingTime: string;
  title: string;
  excerpt: string;
}

export function postMeta(post: CollectionEntry<'blog'>): PostMeta {
  return {
    href: `/blog/${post.id}/`,
    date: isoDate(post.data.date),
    readingTime: readingTime(post.body ?? ''),
    title: post.data.title,
    excerpt: post.data.excerpt,
  };
}

/** All posts, newest first. */
export async function publishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
