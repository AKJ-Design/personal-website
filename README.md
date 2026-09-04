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
- [x] **6 — Blog** (2026-08-30). Content collection (`site/src/content/blog/`, slugs frozen),
      post layout from `design/mocks/wayfare-part-1.html` (accent eyebrow, mono meta, flat
      article, prompts as `<pre>`, the opener a native `<details>` disclosure), `/blog/` index
      derived from the home Writing section, RSS at `/rss.xml` and a sitemap (both XML-validated),
      OG cards generated pre-build by `site/scripts/generate-og.mjs` (the Cloudflare adapter
      prerenders inside workerd, which forbids satori's WASM — OG cannot be an Astro endpoint).
      **Wayfare Part 1 live** with the real flight-search prompt, real screenshots (redacted at
      the pixel or the text), and two CSS-only replay figures — the chat replay
      (`scripts/generate-replay.mjs` → `styles/replay.css`, one 28.5s master timeline) and the
      delivered-then-opened file (`styles/delivery.css`, 20s). Zero script tags throughout;
      reduced motion gets each replay's finished state as a static figure
- [x] **7 — Strip, live** (2026-09-01). KV namespace `STRIP` bound to the Worker; `/` is now
      the site's **one** non-prerendered route and reads the snapshot per request. The snapshot is
      **pushed** hourly from the MacBook by `home-lab/scripts/strip-snapshot.sh` under launchd —
      Cloudflare never reaches into the tailnet. **Sleep was dropped from the strip**, which is
      what closed the `fitness.db` gate: the health metrics reach the database through a manual
      file drop and cannot be automated, while the workout log arrives over an API and syncs
      unattended — so the row is now **Last workout · Services · Off-site backup · Weather**. The stamp was reworded — "live from my own APIs"
      stopped being true once weather (a public API) joined the row
- [x] **8 — Custom domain** (config 2026-09-02, finished 2026-09-05). The Worker is routed by
      `custom_domain: true` in `wrangler.jsonc`, which makes Cloudflare own the whole chain on
      deploy — it creates the apex record and issues the edge certificate, so there is nothing to
      hand-create and nothing to drift. **`workers_dev` and `preview_urls` are both off**,
      retiring a preview host that served identical HTML to the real domain. **`www` is a proxied
      placeholder `AAAA` → `100::`** (RFC 6666's discard prefix; the proxy never connects to it)
      **plus an edge Redirect Rule**, deliberately not a second custom domain: the ASSETS binding
      answers static files before any Astro code runs, so a redirect written in middleware would
      never fire for `/about/`. Then **Always Use HTTPS**, **HSTS** (12 months,
      `includeSubDomains`, **preload off**) and **minimum TLS 1.2** — in that order, and the order
      is the point (see the operating notes). `robots.txt` flipped to `Allow: /`
- [ ] **9 — Launch check** (next): Lighthouse on every page, WCAG AA re-verified in the browser,
      structured data validated, 404 page in voice, link check, runbook written

Steps 5–7 ran as a Claude-driven stretch; 8–10 (custom domain, launch check, cross-post) are
paired. Full sequence in the build plan §3.

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
| Preview builds | enabled, but **`preview_urls: false` since step 8** — a non-`main` push uploads a *version* with **no public URL**. To look at one, promote it in the dashboard, or just run the production build locally |

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
- **Wayfare Part 1 assets — closed 2026-08-30 (step 6).** Real prompt and screenshots in, each
  redacted before it shipped: hotel identifiers pixelated at source or removed from the text
  itself (the itinerary capture is a re-render of the real HTML with names and flight numbers
  scrambled first — no blur needed). Two frames became CSS replay figures rather than static
  shots; the loop diagram is an in-system SVG. Source material and design exports stay in the
  private plans folder.
- **OG image template — closed 2026-08-30 (step 6).** Designed in code:
  `site/scripts/generate-og.mjs` — mono eyebrow, Space Grotesk title on the warm ground, green
  rule, wordmark + domain. Runs before `astro build`; PNGs land in `site/public/og/`
  (gitignored) as static assets.
- **`/blog/` index — closed 2026-08-30 (step 6).** Derived from the home Writing section as
  decided; no separate mock.
- **404 copy — by step 9** not written.
- **GitHub + LinkedIn URLs — closed 2026-08-30 (step 5).** Both live in
  `site/src/data/social.ts`, imported by the footer and by /about's `Person` `sameAs` so the two
  can't drift: `github.com/AKJ-Design` · `linkedin.com/in/alexjyoung`.
- **`robots.txt` — closed 2026-09-02 (step 8), with a catch found 2026-09-05.** The file now
  allows everything, which was only safe once `workers_dev: false` retired the second host. The
  catch: **Cloudflare's managed robots.txt is on for this zone and prepends a block above the
  repo's file**, so the served file is ~6× the length of `site/public/robots.txt` and blocks nine
  AI *training* crawlers. Googlebot, Bingbot and the AI *retrieval* bots are untouched, so ranking
  and assistant discovery are unaffected — kept for that reason. The full explanation, and the
  dashboard switches, are in the comment at the top of `site/public/robots.txt`. **The rule to
  remember: reading that file tells you nothing about what the domain serves.** Check it the only
  way that is true — `curl -s https://alexyoung.com.au/robots.txt`.
- **`fitness.db` sync — closed 2026-09-01 (step 7), by removing the dependency.** The pipeline
  was never fixed and the gate was closed a different way: the strip no longer publishes anything
  that needs it. The split that made this possible is worth keeping in mind — **the workout log
  syncs over an API** (a key from the Keychain, no iCloud in the path, so the snapshot job
  re-syncs it every hour), while **the health metrics arrive as a file drop** from the phone and
  cannot be automated without solving a macOS permissions problem. Sleep was the only strip value
  on the blocked side, so it went. Ingestion stays ritual-coupled by design.
- **Service-count allow-list — closed 2026-09-01 (step 7).** The **allow-list is the probe list**:
  `strip-snapshot.sh` holds an array of six named services-VM checks and counts the successes.
  There is no query whose result set could widen, so nothing on the node box can be counted by
  accident and adding an exporter somewhere cannot change the published number — changing it takes
  a deliberate edit to that array. The mock's "11 / 11" was aspirational; the honest count is 6.
  "Up" means an HTTP response (a 302 to a login page is a healthy service saying no); a TLS or
  connect failure is not, which is what caught two genuinely-down services on 2026-09-01.
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
- Wrangler 4.127 authenticated to the right account; `workers (write)` present. No `gh` CLI
  installed. *(Corrected 2026-09-01: this said "no explicit KV scope — expect a re-auth at step 7".
  Wrong — `wrangler whoami` lists `workers_kv (write)`, and step 7 needed no re-auth. The
  unattended snapshot job does not use this session anyway; it carries its own scoped API token.)*

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

- **Worker:** `alexyoung-com-au` · account `Alex.j.young@icloud.com`. The name in
  `site/wrangler.jsonc` and the name in the dashboard must stay equal, or Workers Builds fails
  every build. The workers.dev subdomain was `alex-j-young`; since step 8 that host returns 404
  and **the site has exactly one public address**, which is the entity-consistency point.
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

  Since step 7 that should list **exactly two** bindings — `STRIP` (KV) and `ASSETS`. If it ever
  names `SESSION` or `IMAGES`, an adapter default has been re-enabled — see `site/README.md`.
- **The dev server backgrounds itself.** Astro 7 returns immediately from `astro dev`; Ctrl-C
  does nothing. Use `npx astro dev status` / `logs` / `stop`.
- **Writing a post** (the build plan §4 exit test): add one Markdown file to
  `site/src/content/blog/` — frontmatter needs `title`, `date`, `eyebrow`, `excerpt`, `tags`,
  optional `next` (the endplate line). The filename is the frozen slug (`/blog/<name>/`).
  Push to `main`; the build generates its OG card, the feed entry, the sitemap row, and the
  home + `/blog/` index cards automatically — counts and reading time are computed, never
  typed. Post images go in `site/public/images/<post>/`, referenced from raw-HTML
  `<figure class="shot">` blocks (see Wayfare Part 1 for the pattern); anything personal gets
  its redaction pass *before* the file enters the repo.
- **`npm run build` runs `scripts/generate-og.mjs` first.** OG cards cannot be an Astro
  endpoint on this stack — the Cloudflare adapter prerenders inside a workerd sandbox, which
  disallows satori's WASM and resvg's native binding. If a build fails before Astro starts,
  look at that script; its PNGs land in `site/public/og/` (gitignored).
- **The replay figures are CSS-only and generated.** The chat replay's 400 lines of keyframes
  come from `site/scripts/generate-replay.mjs` — edit the generator and re-run it, never
  `styles/replay.css` directly (`styles/delivery.css` is small and hand-maintained). One trap,
  cost an hour on 2026-08-30: the CSS minifier deletes a name-less `animation:` shorthand as a
  no-op, silently killing any stagger built on a shared base rule + per-child
  `animation-name` — always write the full shorthand per element.
- **Triaging a failed build — read the clock first.** A failure inside ~3 seconds, during
  *"Initializing build environment"*, is environment or auth: it died before your code was even
  fetched. The one already hit is a **stale Cloudflare build token** ("the build token selected
  for this build has been deleted or rolled") — fix in Settings → Builds → API token by creating
  a *new* token, not by re-picking from the dropdown, which still lists dead ones. A real build
  error takes 30 s+ and names a file. This is a fourth cause on top of the build plan §4 list of
  three (build error, missing binding, bad content frontmatter).
### The domain, TLS and the two redirects (step 8)

Written down because none of it lives in the repo — it is all zone configuration, and in six
months the dashboard will look different.

- **One public address, on purpose.** `alexyoung.com.au` is the only host that serves the site.
  `workers_dev: false` and `preview_urls: false` in `wrangler.jsonc` retired the rest. A second
  host serving identical HTML for a common name is the exact thing design plan §8 exists to
  prevent, and it mattered the moment `robots.txt` opened.
- **`www` is a redirect, not a site.** It is a *proxied* placeholder `AAAA` → `100::` (RFC 6666's
  discard prefix) plus a Redirect Rule at Rules → Redirect Rules. Nothing ever connects to that
  address: because the record is proxied, Cloudflare answers at the edge and the rule fires before
  any origin connection is attempted. The record exists only so the hostname resolves at all.
  **The rule matches `https://www.*` only** — plain HTTP on `www` is caught by Always Use HTTPS
  first, which is why that setting is load-bearing rather than cosmetic.
- **If you add the DNS record and see a `522`, that is correct.** It means the hostname resolves,
  TLS terminated at Cloudflare, and nothing is yet telling the edge what to do — so it tried the
  placeholder as an origin. The `522` disappears when the Redirect Rule saves. Cloudflare may also
  warn *"this rule may not apply to your traffic"* while its own DNS check lags; **ignore and
  deploy** rather than accepting its offer to create a second record.
- **Order matters: Always Use HTTPS *before* HSTS.** HSTS tells a browser to refuse HTTP to this
  host for a year and to refuse click-through on certificate errors. Sending that while HTTP still
  answers `200` advertises a promise the server has not made. Enforce first, then advertise.
- **HSTS is the one setting here that does not cleanly reverse.** `max-age=31536000` with
  `includeSubDomains`; **preload is off and should stay off** — preload compiles into browser
  binaries, takes months to leave, and reaches people who have never visited. Backing HSTS out
  means setting `max-age` to 0 and waiting for every previous visitor to return. **Consequence to
  remember: any future host under `alexyoung.com.au` must serve valid HTTPS from day one.** The
  lab living on `akjdesign.uk` is what keeps that from ever biting.
- **Verify from outside, and not with the system `curl`.** macOS ships LibreSSL and links `curl`
  against it, and it *silently ignores* TLS version pinning — it will report TLS 1.0 as accepted
  when the server refused it. Cost twenty minutes on 2026-09-05. Use the Homebrew OpenSSL:

```bash
/opt/homebrew/opt/openssl@3/bin/openssl s_client -connect alexyoung.com.au:443 -servername alexyoung.com.au -tls1_1 2>&1 | grep -c 'Cipher is'
```

  `0` means refused, which is the wanted answer for `-tls1` and `-tls1_1`. Minimum is TLS 1.2.

- **Testing a DNS record you just created**, before your resolver catches up — pin it and skip DNS:

```bash
curl -sI --resolve www.alexyoung.com.au:443:104.21.87.205 https://www.alexyoung.com.au/about/
```

  Querying a name *before* it exists caches the NXDOMAIN locally for the zone's negative TTL
  (SOA minimum, 1800 s here), which looks exactly like the record having failed.

### The live strip — operating it

The values are **pushed**, never pulled: `home-lab/scripts/strip-snapshot.sh` runs hourly under
launchd on the MacBook and writes JSON to KV key `strip`; `/` reads it per request. That direction
is the whole design — a Worker that could fetch these would have to be able to reach into the
tailnet.

```bash
~/Documents/home-lab/scripts/strip-snapshot.sh --dry-run
```

Prints the payload and writes nothing. It also runs **without the API token**, so the whole
value-gathering path is debuggable without holding write access to the live site.

```bash
launchctl kickstart -p gui/$UID/com.akjdesign.strip-snapshot   # force a run now
tail -f ~/.local/share/strip-snapshot/snapshot.log             # what it did
```

- **What the four cells are, and what each degrades to.** Fresh under 24 h → the values with a
  `cached HH:MM` stamp. Over 24 h → the same values, the stamp says how many days, and the dot
  turns amber and stops pulsing. No snapshot at all (or an unparseable one) → **em dashes and
  "snapshot unavailable"**, never the mock's numbers: inventing a service count while the pipeline
  is down would be precisely the untrue claim `design/decisions.md` forbids.
- **The page is its own monitor.** A laptop that is asleep, off the network, or has a broken job
  says so on the front page, in public. The Kuma heartbeat is the backstop, not the signal —
  which is just as well, because the Mac's Kuma pushes are currently unreliable (see below).
- **Nothing fine-grained ever leaves the laptop.** The snapshot carries *rendered strings*, so the
  coarsening happens in the only process that sees the real data — the Worker cannot render
  something more precise than it was handed, because it never receives it. A workout's routine
  name becomes a category; its date becomes "yesterday"; the service list becomes a count; the
  weather is Brisbane at city resolution, never geolocated.
- **Rotating the token** (build plan §4's last item): issue a new one at Cloudflare → Manage API
  tokens with the single permission *Workers KV Storage: Edit*, then
  `security add-generic-password -U -s strip-snapshot-cf-token -a alex -w`, then kickstart the job
  and check the log. Nothing needs redeploying — the Worker only ever reads.
- **If the strip is stuck on old values**, check in this order: the log above (did the job run?),
  then `npx wrangler kv key get --binding STRIP --remote strip` from `site/`. **`--remote` is not
  optional** — without it wrangler reads a local miniflare store, a different and empty namespace,
  and the values look missing when they are fine. KV is eventually consistent; give a write a
  minute before believing it failed.

- **If headings render in the body typeface,** it is the font bridge in `site/src/styles/base.css`,
  not a failed download — Astro emits `@font-face` under a hashed family name, so `tokens.css`'s
  literal `"Space Grotesk"` matches nothing on its own. This fails silently, with no console error.
