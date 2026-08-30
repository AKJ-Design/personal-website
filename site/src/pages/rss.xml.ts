/**
 * RSS feed — build plan step 6, done-when "feed validates".
 *
 * Links resolve against Astro.site (the canonical domain), so the feed is
 * correct on the workers.dev preview and the real domain without a flag —
 * same rule as the canonical tags in Base.astro.
 */
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { publishedPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await publishedPosts();
  return rss({
    title: 'Alex Young — build log',
    description:
      'Case studies and build-in-public posts: a travel app, a knowledge base my AI tools read and write, a fitness pipeline, and the homelab under it all.',
    site: context.site!,
    items: posts.map((post) => ({
      link: `/blog/${post.id}/`,
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
    })),
    customData: '<language>en-au</language>',
  });
}
