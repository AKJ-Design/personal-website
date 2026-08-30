/**
 * Published writing, newest first — the same array feeds the home "Writing"
 * index and the /about plate's shipped count, so a number on either page can't
 * drift from the list itself. Step 6 replaces this with the blog content
 * collection; keep the shape in sync with PostCard's props until then.
 */
export interface Post {
  href: string;
  date: string;
  readingTime: string;
  title: string;
  excerpt: string;
}

export const POSTS: Post[] = [
  {
    href: '/blog/wayfare-part-1/',
    date: '2026-08-15',
    readingTime: '9 min',
    title: 'From "find me flights" to a travel app — Part 1',
    excerpt:
      'The very first thing I ever asked Claude to do was find me flights to Bangkok. Two months later, that throwaway prompt has somehow become a native iOS travel app.',
  },
];
