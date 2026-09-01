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
src/lib/strip.ts          the live strip's KV contract + degrade rule (step 7)
src/data/                 projects array + the social URLs (footer and Person sameAs share these)
src/pages/blog/           post layout + writing index; rss.xml.ts beside them in pages/
src/assets/               images. The /about photo is optimised at build; everything home
                          renders is PRE-SIZED (see §4)
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

**4 · Home is the one on-demand route, and that changes how its images work.**
`src/pages/index.astro` sets `export const prerender = false` so the strip can read
its snapshot from KV per request. Everything else on the site is still a static file.

Two consequences that are not obvious and cost time to rediscover:

- **Bindings come from `cloudflare:workers`, not `Astro.locals.runtime.env`.** Astro 6
  removed the latter — its getter now *throws*. Because the strip has a deliberate
  degrade path, that throw presented as a perfectly calm "snapshot unavailable" page.
  A clean fallback will hide a bug from you; the `catch` in `index.astro` logs to the
  Worker console for exactly that reason.
- **`astro:assets` only pre-optimises images on routes it prerenders.** Left as
  `<Image>`, every visual on the front page resolved to `/_image?href=…` at request
  time — a Worker invocation each, no immutable caching — and with
  `imageService: 'compile'` the passthrough endpoint *ignores the resize*, so a 240 px
  slot was served a 640 px JPEG. The fix was to move the resizing to author time:
  `src/assets/**` now holds files already at their display size, imported as ESM (so
  they keep hashed filenames and the `_headers` immutable rule) and rendered with a
  plain `<img>`. The flagship shot got smaller doing it — 78 KB JPEG → 16 KB WebP at
  twice the density. Re-derive with `sharp` if a slot size changes; the originals are
  the receipts in `../design/`.

## The live strip (step 7)

Values are **pushed**, never pulled. `home-lab/scripts/strip-snapshot.sh` runs hourly
under launchd on the MacBook and writes a JSON snapshot to KV key `strip`; this Worker
reads it. Cloudflare has no route into the tailnet, which is the point.

```bash
npx wrangler kv key get --binding STRIP --remote strip     # what the site is reading
npx wrangler kv key put --binding STRIP --remote strip --path snapshot.json
npx wrangler kv key delete --binding STRIP --remote strip  # exercise the no-data row
```

`--remote` is not optional. Without it wrangler reads the **local** miniflare store,
which is a different, empty namespace — the values look missing when they are fine.
KV is eventually consistent, so allow up to a minute for a write to show up.

The degrade rule lives in `src/lib/strip.ts`: fresh under 24 h, stale over it (the dot
turns `--warn` and stops pulsing), and no data at all renders em dashes rather than the
mock's numbers — inventing a service count while the pipeline is down would be exactly
the kind of untrue claim `decisions.md` forbids.

## Deliberately off

Both are adapter defaults, both turned off in `astro.config.mjs`, both would otherwise show up
as provisioned Cloudflare resources this site never calls:

- `session: false` — no sessions anywhere. Left on, the adapter auto-provisions a KV namespace
  bound as `SESSION`, which would sit confusingly beside the *real* KV namespace the live strip
  gets at step 7.
- `imageService: 'compile'` — every image is a local file known at build time, so images are
  optimised during the build instead of through a runtime Cloudflare Images binding.

`npx wrangler deploy --dry-run` should list **exactly two** bindings and no others:

```
env.STRIP    KV Namespace     the live strip's snapshot (step 7)
env.ASSETS   Assets           the static files
```

If `SESSION` or `IMAGES` ever appears, one of the two settings above has been
re-enabled and an unused Cloudflare resource is being provisioned on every deploy.
