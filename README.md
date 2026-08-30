# personal-website

Alex Young's personal site — portfolio (case studies), build-in-public blog, and front door.
Astro on Cloudflare, static, no CMS. **Build phase started 2026-08-27** — steps 0–2 done
(domain live on Cloudflare, `hello@` routing). No site code yet; scaffold is step 3.

The governing plans live in `personal-plans/`: `website-design-plan.md` (design phase, exited
2026-08-23) and `website-build-plan.md` (rev 1, accepted 2026-08-27). Progress state is recorded in the brain
(`Obsidian-Brain/state/projects-backlog.md`).

## Layout

```
research/     Step 1 — reference sites, Alex's notes, and the synthesis (design brief)
design/       Step 2+ — directions, decisions log; later: mocks and the mini design system
content/      §5 real copy, written before pixels: home, about, case studies, post #1 outline
```

## Design phase — complete (2026-08-23)

- [x] Step 1 — references collected + synthesised (`research/references.md`)
- [x] Decisions logged: photo (small, not front-centre), case-study set × 4, blog-post style
      (`design/decisions.md`)
- [x] Step 2 — **direction chosen: B "Engineered (live)"**, forest-green accent thread, A/C
      killed (`design/directions.md`)
- [x] **Domain** — `alexyoung.com.au` registered 2026-08-15 (Hostinger, ABN active). Not yet
      connected to Cloudflare — nameserver cutover is build-phase work
- [x] §5 content — Wayfare Part 1 (v2, 2026-08-15), About and home (2026-08-23) all in Alex's
      voice. QuietNine post dropped from the launch set (2026-08-23). Two accuracy gates remain
      flagged inside `content/about.md` (App Store claim, `hello@` routing)
- [ ] Step 3 — **in progress (2026-08-15):** first mocks of home + the Wayfare post in
      `design/mocks/` (self-contained HTML, zero JS, tokens inlined), verified at desktop +
      phone widths; **About mock added 2026-08-23** (`about.html`, rev 2 with real photo); iterate next
- [x] Step 4 — **design system built** (2026-08-15), out of order, ahead of the mocks. Exact
      green locked at `#204E39`; tokens in `design/tokens.css` + `tokens.json`; visual spec sheet
      `design/design-system.html`; mirrored to the brain as `state/design-system.md`.
      Architecture is a shared spine with two themes — **Field Notes Light** (this site, and
      Office documents) and **Wayfare Dark** (the iOS app). Office templates in `design/office/`
- [x] Card visuals — all six real (`design/mocks/assets/`, 2026-08-23)
- [~] Step 5 (optional) — skipped, 2026-08-23

> **Note on ordering.** Step 4 landed before Step 3. The plan has the system *emerge from* the
> mocks; here it was derived from Direction B plus Wayfare's shipped tokens instead. That's a
> real inversion, and the risk it carries is that the mocks now inherit values no page has
> stress-tested. Treat the token set as provisional until the home + post mocks exist — if a
> mock wants a value the system doesn't have, that's the system being wrong, not the mock.

**Design phase exit test:** design system exists ✅ · content pieces exist ✅ (home, about, Wayfare
Part 1) · winning mocks render at phone + desktop ✅ (home, post, about — all six card visuals
real) · Alex can explain every choice unaided — Alex's own pass against `design/decisions.md`.

## Build phase — in progress (started 2026-08-27)

Plan: `personal-plans/website-build-plan.md` (rev 1, accepted 2026-08-27). Code will live in
`site/` in this repo; `design/`, `content/` and `research/` stay as the receipts.

- [x] **0 — Accuracy gates.** Wayfare confirmed **TestFlight only**, not App Store: `about.md`,
      the About mock and the Wayfare study reworded. `Person` `sameAs` → GitHub + LinkedIn only
      until a store launch. Today-view screenshot already in `design/mocks/assets/`
- [x] **1 — Zone + nameservers.** `alexyoung.com.au` on Cloudflare, full setup; Hostinger's
      parking A/AAAA/CNAME records deliberately *not* imported. NS `savanna` + `thomas`
      `.ns.cloudflare.com`, delegation confirmed at the `.au` registry. Zone active
- [x] **2 — Email Routing.** `hello@alexyoung.com.au` → `alex.j.young@icloud.com`, verified by
      real test mail. MX ×3 + DKIM + SPF published by Email Routing; DMARC added at `p=reject`
- [x] **3 — Scaffold** (2026-08-28). Astro 7.2.9 + `@astrojs/cloudflare` 14.2.5 in `site/`,
      `output: static`. Tokens copied byte-identical from `design/tokens.css`; two Latin-subset
      variable WOFF2 self-hosted (22 KB + 40 KB); Header + Footer transcribed from the mock.
      **Live at `https://alexyoung-com-au.alex-j-young.workers.dev`** (76 KB total, zero JS),
      verified at 1280 and 375. **Push to `main` deploys** via Workers Builds, confirmed end to
      end. Detail in [`site/README.md`](site/README.md)

- [x] **4 — Home, static** (2026-08-28). Six cards in the mock's mosaic (flagship / mid pair /
      compact / mid pair), writing index, live strip with build-time fallback values. Copy
      verbatim from `content/home.md`. Matches `design/mocks/home.html` at 1280 and 375, checked
      against the mock served side by side. Zero script tags; 113 KB including all seven images
      and both fonts. Flagship image is `eager`/`fetchpriority=high` as the LCP candidate
- [x] **5 — About + repo public** (2026-08-30). `/about` from `design/mocks/about.html` rev 1:
      photo in the sticky rail, mono data plate (shipped count rendered from the same arrays the
      home index counts), `Person` JSON-LD with `sameAs` → GitHub + LinkedIn from
      `site/src/data/social.ts`, four-link receipts row into this repo. Verified against the
      production build at 1280 and 375; the JSON-LD block is the page's only `<script>`. Same
      step: the repo went **public with a fresh history** — see the closed gates below
- [ ] **6 — Blog** (next): content collection, post layout, Wayfare Part 1, RSS, sitemap, OG

Steps 5–6 (About, blog) continue the Claude-driven stretch; 7–10 (live strip, custom
domain, launch check, cross-post) are paired. Full sequence in the build plan §3.

> **Dev-server gotcha, cost an hour on 2026-08-28.** Astro's dev `/_image` endpoint hangs
> intermittently, which makes the flagship card *appear* to overflow the page and its image
> render blank. The production build is correct. **Verify layout against `npm run build` output,
> not `astro dev`.** The same artefact makes lazy-loaded images look missing in a headless
> screenshot while `img.complete` is true — check `naturalWidth`, not the picture.

### Workers Builds — connected 2026-08-28, reconnected 2026-08-30

Push to `main` builds and deploys. Verified end to end, not just by a green log: a commit with a
visible text change was pushed and the change confirmed on the live URL.

Reconnected 2026-08-30 because going public replaced the repo: the original was renamed
`personal-website-archive` (kept private, full history intact) and this repo was recreated
fresh at the same name, so the Workers Builds connection had to be made again with the same
settings below.

| Field | Value |
|---|---|
| Git account / repo | `AKJ-Design` / `personal-website` (public since 2026-08-30) |
| Production branch | `main` |
| Root directory | `site` — **not optional**; the repo root has no `package.json` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Preview builds | enabled — non-`main` branches upload a *version*, nothing goes live |

The Worker's dashboard name **must** equal `name` in `site/wrangler.jsonc` (`alexyoung-com-au`)
or every build fails. Node needs no setting — Workers Builds defaults to 24.18.0 and
`site/.node-version` pins it.

### Open gates — carried into the build, not closed

Found 2026-08-28 in the pre-step-3 review. Each names the step it must close by.

- **Repo visibility — closed 2026-08-30 (step 5).** The repo went public with a **fresh
  history**: unpublished drafts and research moved to the private plans folder, editorial rules
  that named private infrastructure were reworded to state each rule by mechanism, and public
  history restarts from a clean initial commit (the full prior history is archived privately
  beside the plans). The detailed redaction rules live in the private build plan, not here.
- **Wayfare Part 1 assets — by step 6.** The draft (now in the private plans folder with the
  other unpublished content; it enters the repo when the post ships) carries four
  `[screenshot here]`, one `[image/diagram here]` and an unfilled flight-search prompt; the post
  mock has the matching empty `<figure class="shot">` frames. **Alex gathers the screenshots and the prompt in
  parallel with steps 3–5** (each needs the same redaction pass the Wayfare card visual got);
  Claude draws the Claude ↔ Cloudflare ↔ MCP loop as an in-system SVG.
- **OG image template — by step 6.** Build plan §2.5 assumes one exists "in the design system".
  It does not — nothing in `design/` is 1200×630. Needs designing before OG generation.
- **`/blog/` index — by step 6** has no mock. Derive it from the home page's "Writing — 01"
  section rather than mocking it separately.
- **404 copy — by step 9** not written.
- **GitHub + LinkedIn URLs — closed 2026-08-30 (step 5).** Both live in
  `site/src/data/social.ts`, imported by the footer and by /about's `Person` `sameAs` so the two
  can't drift: `github.com/AKJ-Design` · `linkedin.com/in/alexjyoung`.
- **`robots.txt` — by step 8/9.** `site/public/robots.txt` currently disallows **everything**,
  deliberately: the preview host and the real domain serve identical HTML, and a `workers.dev`
  URL competing with `alexyoung.com.au` for a common name is what design plan §8's entity
  consistency exists to prevent. The file says what to replace it with. **The site cannot be
  indexed until this is flipped** — check the preview host from the outside too, not just the
  real domain.
- **`fitness.db` sync — by step 7.** Latest row across workouts / health / nutrition is
  **2026-08-23** (checked 2026-08-28) — five days behind. Better than the 18 days build plan §6
  flagged, but the strip's "cached HH:MM" stamp implies hours. Fix the pipeline before step 7.
- **Service-count allow-list — by step 7.** "11 / 11 up" must come from an explicit allow-list of
  service names, never a Prometheus target count — the published number covers the services VM
  only. The allow-list itself lives in the private build plan.
- **`design/tokens.json:2` — closed 2026-08-30.** The `$schema` stray-`j` domain typo
  (`alexjyoung` → `alexyoung`) fixed with Alex's approval in the going-public pass; no other
  token value touched.

### Verified 2026-08-28, pre-step-3

- DNS chain confirmed from outside and matches this README exactly: NS `savanna`/`thomas`, MX ×3
  `route1/2/3.mx.cloudflare.net`, a **single** SPF record, DMARC `p=reject`, no apex `A` — clean
  for the Worker route. (Note: `rua=` points aggregate reports at `hello@`, so they land in iCloud.)
- **Build plan §2.1's open question is closed.** Astro's current Cloudflare guide still says
  Cloudflare recommends **Workers for new projects**, not Pages. Config shape:
  `main: "@astrojs/cloudflare/entrypoints/server"`, `compatibility_flags: ["nodejs_compat",
  "global_fetch_strictly_public"]`, `assets.binding: "ASSETS"`.
- Space Grotesk and JetBrains Mono are installed locally (incl. variable TTFs), so the mocks
  rendered in the real faces rather than fallbacks. Only weights 400/600/700 are used. No local
  `fonttools`/`woff2` — Astro's Fonts API does the subsetting and self-hosting instead.
- Wrangler 4.127 authenticated to the right account; `workers (write)` present, **no explicit KV
  scope** — expect a re-auth at step 7. No `gh` CLI installed.

## Operating notes — DNS and email

Written down now because these are the parts that bite when debugging alone months later.

- **Email Routing's records are managed** — the MX and DKIM entries show as *Locked* in the
  dashboard. Don't hand-edit them; if routing breaks, check they still exist before anything else.
- **There may only ever be one SPF record.** The apex TXT is left *Unlocked* precisely because
  sending as `hello@` later means **adding an include to that record**, never creating a second
  one. Two SPF records is a permanent error that fails mail silently.
- **DMARC is `p=reject`** — safe because the domain sends no mail, so anything claiming to be
  from it is a forgery. Revisit alignment if/when Email Service sending is turned on.
- **DNSSEC is not on yet** — deliberately deferred until the zone has settled.
- Verify the chain from the outside, not the dashboard:

```bash
dig NS alexyoung.com.au +short && dig MX alexyoung.com.au @1.1.1.1 +short && dig TXT _dmarc.alexyoung.com.au @1.1.1.1 +short
```

## Operating notes — the site

- **Worker:** `alexyoung-com-au` · account `Alex.j.young@icloud.com` · workers.dev subdomain
  `alex-j-young`. The name in `site/wrangler.jsonc` and the name in the dashboard must stay
  equal, or Workers Builds fails every build.
- **Build and deploy by hand** (from `site/`):

```bash
npm run build && npx wrangler deploy
```

- **`wrangler deploy` does not read `site/wrangler.jsonc` directly.** The adapter writes a
  resolved copy to `dist/client/wrangler.json` and redirects wrangler to it. That is why
  `assets.directory` says `./dist` while the assets are in `dist/client/`. See what will really
  be uploaded, and confirm no unexpected bindings crept in:

```bash
npx wrangler deploy --dry-run
```

  Until step 7 adds KV for the live strip, that should say **"No bindings found"**. If it ever
  names `SESSION` or `IMAGES`, an adapter default has been re-enabled — see `site/README.md`.
- **The dev server backgrounds itself.** Astro 7 returns immediately from `astro dev`; Ctrl-C
  does nothing. Use `npx astro dev status` / `logs` / `stop`.
- **Triaging a failed build — read the clock first.** A failure inside ~3 seconds, during
  *"Initializing build environment"*, is environment or auth: it died before your code was even
  fetched. The one already hit is a **stale Cloudflare build token** ("the build token selected
  for this build has been deleted or rolled") — fix in Settings → Builds → API token by creating
  a *new* token, not by re-picking from the dropdown, which still lists dead ones. A real build
  error takes 30 s+ and names a file. This is a fourth cause on top of the build plan §4 list of
  three (build error, missing binding, bad content frontmatter).
- **If headings render in the body typeface,** it is the font bridge in `site/src/styles/base.css`,
  not a failed download — Astro emits `@font-face` under a hashed family name, so `tokens.css`'s
  literal `"Space Grotesk"` matches nothing on its own. This fails silently, with no console error.
