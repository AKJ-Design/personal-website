// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://alexyoung.com.au',

  /* Sitemap (build plan §2.5). URLs resolve against `site`, so every entry is
     absolute against the canonical domain regardless of the host it was built
     for — which is why nothing here had to change at step 8 when the
     workers.dev preview was retired. robots.txt opened at step 8 (2026-09-02)
     and names this sitemap; see the comment at the top of public/robots.txt
     for what Cloudflare prepends to the file the domain actually serves. */
  integrations: [sitemap()],

  /* No code on this site's pages — the fenced blocks in posts are prompts,
     prose styled by the post layout's own pre rules. Shiki would inject its
     own theme as inline styles and fight them. */
  markdown: { syntaxHighlight: false },


  /* imageService: 'compile' — every image on this site is a local file known at
     build time (the photo, the six card visuals, the post screenshots), so they
     are optimised during the build and served as plain immutable assets. The
     adapter's default would instead wire a runtime Cloudflare Images binding,
     which this site would never call but which would show up as a provisioned
     resource and as a line in every deploy log. */
  adapter: cloudflare({ imageService: 'compile' }),

  /* No sessions anywhere on this site. Left at the default, the adapter
     auto-provisions a KV namespace bound as SESSION on first deploy — dead
     weight now, and actively confusing at step 7, when a *real* KV namespace
     arrives for the live strip and there are suddenly two. Disabling also keeps
     the session runtime out of the bundle. Needs Astro ≥ 7.2. */
  session: false,

  /* Fonts — build plan §2.2: "self-hosted, two files max, subset to Latin,
     font-display: swap".

     Exactly two files ship, and they are these:
       space-grotesk-latin-wght-normal.woff2   22 KB
       jetbrains-mono-latin-wght-normal.woff2  40 KB

     Both are variable (one file covers every weight), OFL-1.1, and come from
     the Fontsource npm packages rather than a CDN — so the build never reaches
     a third party and CI is reproducible. The `local` provider is used with an
     explicit package-import path rather than `npm`/`google` precisely so the
     file list is a decision, not a resolution: nothing can quietly add the
     latin-ext, vietnamese or cyrillic subsets.

     Alex's TTFs in ~/Library/Fonts are the same faces but would ship as TTF —
     several hundred KB against a 62 KB WOFF2 pair. Not used for that reason.

     Space Grotesk ships NO italic (see tokens.css). Do not add an italic
     variant here; the browser would fake an oblique. */
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Space Grotesk',
      cssVariable: '--font-space-grotesk',
      /* matches --font-display's stack in tokens.css */
      fallbacks: ['system-ui', '-apple-system', 'Helvetica Neue', 'Arial', 'sans-serif'],
      display: 'swap',
      options: {
        variants: [
          {
            src: [
              '@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
            ],
            weight: '300 700',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      /* matches --font-mono's stack in tokens.css */
      fallbacks: ['ui-monospace', 'SF Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      display: 'swap',
      options: {
        variants: [
          {
            src: [
              '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
            ],
            weight: '100 800',
            style: 'normal',
          },
        ],
      },
    },
  ],
});
