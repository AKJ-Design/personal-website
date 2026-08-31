# site/ — the Astro build

The code. `../design/` and `../content/` are the receipts it was built from; the operating
notes and build-phase status live in [`../README.md`](../README.md).

```bash
npm install
npm run dev      # http://localhost:4321 — NOTE: Astro 7 backgrounds this
npm run build    # scripts/generate-og.mjs first, then astro build → dist/client/
```

`astro dev` returns immediately and leaves the server running in the background. Use
`npx astro dev status`, `npx astro dev logs` and `npx astro dev stop` — not Ctrl-C.

## Layout

```
src/styles/tokens.css     verbatim copy of ../design/tokens.css — never edit here
src/styles/base.css       the mocks' base layer + the font bridge (see below)
src/styles/replay.css     GENERATED chat-replay timeline — edit scripts/generate-replay.mjs, re-run, copy over
src/styles/delivery.css   the delivered-then-opened figure — small, hand-maintained
src/layouts/Base.astro    html shell: head, canonical, OG/twitter meta, fonts, header + footer
src/components/           Header, Footer, Card, PostCard, Strip
src/content.config.ts     blog collection schema — filenames are the frozen slugs
src/content/blog/         one Markdown file per post (write-a-post recipe in ../README.md)
src/lib/posts.ts          the one source for post listings: home, /blog/, About plate, RSS, OG
src/data/                 projects array + the social URLs (footer and Person sameAs share these)
src/pages/blog/           post layout + writing index; rss.xml.ts beside them in pages/
src/assets/               images that get optimised at build (photo derivatives, card visuals)
public/images/            post screenshots and diagrams, served as-is (pre-sized by hand)
public/og/                GENERATED at build by scripts/generate-og.mjs — gitignored
```

## Three things that are not obvious

**1 · Tokens are a copy, not a source.** `src/styles/tokens.css` is byte-identical to
`../design/tokens.css` (build plan §2.2: the design repo stays the receipt, the build copy
ships). If a component needs a value the tokens don't have, that is the *system* being wrong —
change `../design/tokens.css` and re-copy, don't patch here:

```bash
cp ../design/tokens.css src/styles/tokens.css && diff -q ../design/tokens.css src/styles/tokens.css
```

**2 · The font bridge in `base.css` is load-bearing.** Astro's Fonts API emits `@font-face`
rules under a *hashed* family name (`"Space Grotesk-3eccb524…"`), not the plain
`"Space Grotesk"` that `tokens.css` names. Without the two-line rebind at the top of
`base.css`, every heading silently falls back to `system-ui` — no error, no warning, just the
wrong typeface. If the display face ever looks like the body face, look there first.

Two font files ship, both Latin-subset variable WOFF2 from the OFL Fontsource packages
(22 KB + 40 KB). `--font-body` is deliberately the system stack, so body copy never waits on a
download.

**3 · `wrangler deploy` does not read `wrangler.jsonc` directly.** The adapter writes a
resolved copy to `dist/client/wrangler.json` and points wrangler at it through
`.wrangler/deploy/config.json` ("redirected configuration"). That is why `assets.directory`
reads `./dist` while the real assets sit in `dist/client/`. Edit `wrangler.jsonc`; never the
generated one. To see what will actually be uploaded:

```bash
npx wrangler deploy --dry-run
```

## Deliberately off

Both are adapter defaults, both turned off in `astro.config.mjs`, both would otherwise show up
as provisioned Cloudflare resources this site never calls:

- `session: false` — no sessions anywhere. Left on, the adapter auto-provisions a KV namespace
  bound as `SESSION`, which would sit confusingly beside the *real* KV namespace the live strip
  gets at step 7.
- `imageService: 'compile'` — every image is a local file known at build time, so images are
  optimised during the build instead of through a runtime Cloudflare Images binding.

`npx wrangler deploy --dry-run` should say **"No bindings found"** until step 7 adds KV.
