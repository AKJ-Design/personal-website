# Design decisions — log

*Decisions made during the design phase, newest first. The design plan
(`personal-plans/website-design-plan.md`) holds the rationale for the phase itself; this file
records what Alex has actually settled.*

## 2026-08-23

- **Design phase exited.** Every exit criterion met except Alex's own "explain every choice"
  pass, which is his to run against this log. Build plan drafted:
  `personal-plans/website-build-plan.md` (rev 1) — Workers + static assets, the live strip fed
  by a pushed KV snapshot (never pulled from the tailnet), Email Routing receive-only, steps
  tagged by who does them. Build starts in a fresh session at step 0 (accuracy gates) and step 1
  (nameserver cutover).
- **Card visuals: 5 of 6 real** (`design/mocks/assets/`). Drawn in-system as SVG using the tokens
  (mono labels, accent strokes, sunk ground): **brain** (tools ↔ brain ↔ me), **this site** (one
  spine, two themes), **homelab** (services VM · node box · Oracle VPS — a diagram rather than a
  Grafana screenshot: nothing to leak, and "node box" deliberately says nothing about what it runs).
  **Fitness** is a real chart from `fitness.db`: twelve weeks' tonnage, 4 May – 26 Jul 2026,
  lighter bars = under 5 sessions — aggregates only, delayed, per the privacy rule. **QuietNine**
  uses its app icon. **Wayfare**: Alex's device screenshot (Bangkok trip, hotel and flight details pixelated at source by Alex), cropped 4:5 below the status bar — source PNG git-ignored, 800 px JPEG committed. **All six cards carry real visuals.**
  The slot earned a value: visuals sit at **150 px** desktop / 110 px phone (96/64 was too dense
  for a labelled diagram). Skip outside eyes (Step 5) — Alex's call.
- **About mock rev 2 (Alex's review):** colophon runs **headless** — the hairline alone marks the
  break, no `//` subhead. **Sticky is a rule:** the header row stays sticky on every page, and
  the About rail stays sticky with it. **Photo in:** `design/photo/alex-480.jpg` (rail, square,
  hairline border — no circle on the sheet) and `alex-160.jpg` (header avatar, circular, both
  pages). The 7 MB source PNG is git-ignored under `design/photo/source/`; only derivatives are
  committed.
- **QuietNine post dropped from the launch set.** Wayfare Part 1 is the first post; QuietNine
  keeps its index card but ships without a write-up. §5 content for the exit test is therefore
  home · about · Wayfare Part 1 — all three now in Alex's voice. Design phase has no content
  blocker left.
- **About mock built** (`design/mocks/about.html`, rev 1) — copy verbatim from `content/about.md`.
  Layout: short head ("I'm Alex." + the Brisbane line as lead), prose at measure width with a
  right-hand **rail** holding the small photo and a mono **data plate** (based / day job /
  builds / shipped / status) — the mono-for-facts rule given a home on a prose page. Flat
  hairlines throughout per the scope rule; colophon as a `//` section with a receipts link row.
  At phone width the rail folds in above the prose, photo then full-width plate (beside-the-photo
  was tried; facts wrapping to three lines read badly). System held with no new tokens.
  **Open for Alex:** plate values are claims — every one must be literally true at build time
  ("6 projects · 1 post" counts the index; "on the App Store" gate still applies).
- **Home copy settled (Alex).** Hook opens "I'm Alex," to match /about — the full name lives in
  the wordmark, `<title>` and `Person` structured data instead. Closing sentence merges the
  portfolio and build-log jobs: "what I made, the decisions and trade-offs, and what I'd do
  differently." Wayfare one-liner now says "iOS/SwiftUI" for non-developer readers.
- **Card set goes to six** (was four, 2026-08-12): **+ Homelab** (now separable from the node
  box since the 2026-08-22 two-machine split — BIOS 101, Proxmox, DNS, reverse proxy,
  monitoring) and **+ This site** (the colophon as a project; design receipts already committed).
  Mock updated: the mosaic runs flagship → mid pair → compact strip (QuietNine) → mid pair
  (Homelab, This site); "This site" went mid rather than compact so no card strands on a
  half-width row. Verified at 1280 px and phone width. Rule for the homelab post: the node
  box's workloads are never mentioned.
- **About copy landed — Alex's final draft** (`About_AY_Draft.docx` → `content/about.md`, light
  edit pass applied, notes kept in the file). Two accuracy gates open before it can be published:
  Wayfare's distribution status ("on the App Store" must be literally true) and
  `hello@alexyoung.com.au` needing Email Routing after the domain cutover. Home copy and the
  QuietNine outline are now the only §5 pieces still in Claude's voice. About mock can start.

## 2026-08-16

- **About is its own page** (`/about`), not just the home paragraph — home keeps the
  two-sentence hook. Structure reworked in `content/about.md` after reviewing
  felix.gripe/about: adds the **career-bridge section** (product/experience design + ops by
  day; "not a career software engineer, which is the point" — must square with LinkedIn
  arrivals) and a **colophon** ("how this site is built"). Copy is Alex's to write; mock
  follows copy, per the content-before-pixels rule.
- **`/fitness` page parked for post-launch.** felix.gripe-"runs"-style, fed by the fitness
  dashboard. Privacy rules pre-agreed: no routes/maps/locations, no real-time signals,
  aggregates and trends only — extends the strip's coarse-and-delayed rule.

## 2026-08-15

- **Elevation locked (home mock rev 2 approved).** Index/link cards float: `--surface-raised`
  white on the warm ground, ink-tinted `--shadow-1` resting / `--shadow-2` on hover, with the
  card title turning `--accent` as the interactive cue. Alex's verdict: "just the right amount".
  Promoted into `tokens.css` + `tokens.json`; `--surface-raised`'s old "rare; prefer sunk" note
  amended. **Scope rule:** the live strip and article pages stay flat hairlines-on-ground — if
  everything floats, nothing does. Ground stays `#FAF7F2` (grey was considered and rejected: the
  warmth is identity; offset comes from white cards, the Apple-store move translated).
- **Home layout: projects stay first** (writing-first considered, rejected while only one post
  exists — revisit at 3–4 posts, likely as a slim "latest post" banner). **Every project card
  gets a visual slot** (screenshot/diagram/chart/icon) — this is §7's "real screenshots" antidote
  doing the colour work. Flagship Wayfare card carries a story-hook line to the Part 1 post.
- **Header floats:** sticky, blurred surface wash, hairline underline; slims to one row at phone
  width. Avatar placeholder (small, next to wordmark) per the standing photo decision.
- **Live-element exploration (open):** the page gets exactly one always-moving element. First
  cut: pulsing status dot on the strip stamp — deliberately `--ok` green, **not** `--accent`,
  because "live" is a status, not a control, and the accent thread stays interactive-only.
  Candidates still on the table: last-workout peak HR with a heartbeat pulse; a tiny JS island
  (clock/ticker) would break zero-JS-by-default and needs to earn it. Ideation continues in the
  mocks.
- **Domain registered: `alexyoung.com.au`**, purchased through Hostinger (ABN active). Not yet
  connected to Cloudflare — the nameserver cutover is build-phase work. *Note:* the plan's §8
  entity-consistency idea had "the domain's J doing disambiguation work"; the registered name has
  no J, so common-name disambiguation now rests entirely on entity consistency (same name/photo/
  bio everywhere + `Person` structured data).
- **Wayfare case study Part 1 — Alex's draft v2 landed** (`Wayfare Case Study v2.docx`, converted
  to `content/case-studies/wayfare.md`). This is the voice pass §5 was waiting on for that piece;
  the writing-style guide (brain: `state/writing-style.md`) was calibrated against it.
- **Step 3 begun: first mocks built** — `design/mocks/home.html` + `design/mocks/wayfare-part-1.html`,
  self-contained, zero JS, tokens inlined from `tokens.css`. First stress test of the design
  system in practice; system holds so far (one addition earned: `<details>` as the zero-JS prompt
  disclosure). Treat tokens as preference-subject-to-validation while mocks iterate.
- **Exact green locked: `#204E39`.** Closes the Step 4 open item. Chosen from a four-way visual
  comparison (`green-chooser.html`, kept in this folder as a receipt) that showed each candidate
  doing every job the accent thread actually has — wordmark, link underline and marker hover,
  selection, live-strip labels, card accent, filled button — with content held identical so colour
  was the only variable.
  - **Measured:** 8.89:1 on the `#FAF7F2` ground (AAA), 9.50:1 for white on the filled control
    (AAA). Passing AAA in both directions is the reason this value won: **one green does every
    role**, so there is no second "accessible variant" to define, document and keep in sync.
  - Rejected: `#1B4332` (10.37:1 — safest for print, but reads near-black and the thread stops
    announcing itself); `#2F5D50` (7.01:1 — calm, but least forest, drifts to neutral);
    `#2D6A4F` (5.98:1 — most visibly green, but AA-only and would have needed a darker sibling
    for documents).
- **Ground and ink locked with it:** `#FAF7F2` warm off-white, `#141210` ink (17.49:1). Stone greys
  `#57514A` (7.33:1, secondary prose) and `#8A8177` (3.58:1, **labels and hairlines only — never
  body copy**).
  - ⚠️ **`#8A8177` was superseded — see `tokens.css`, which is the live value and carries the
    reasoning.** Left in place here because this is a dated log of what was decided on the day,
    not a palette reference. The short version: 3.58:1 is fine for a hairline but **fails AA for
    the 11px uppercase labels the token exists to colour**, and "labels and hairlines only" did not
    save it, because labels are text. `--muted-2` is now `#6B6358` at 5.53:1. Re-verified by
    computation at build step 9 (2026-09-05), along with all eleven pairs — every one passes,
    worst 5.20:1. **Read the current palette from `tokens.css`, never from this file.**
- **Design-system architecture: shared spine, two themes.** One token vocabulary and one set of
  structural rules, with **Field Notes Light** (this site) and **Wayfare Dark** (the iOS app) as
  themes over it. The two surfaces stay deliberately different; what they share is structure —
  the accent-thread rule, mono-for-facts, hairline-as-tinted-accent, the radius scale and the type
  roles. Rationale and the full token set: `design-system.md` + `tokens.css` / `tokens.json` here,
  mirrored to the brain as `state/design-system.md`.
- **Fonts installed locally** (all variants, `~/Library/Fonts`). Two name-table facts that
  constrain the Office templates: **Space Grotesk ships no italic** (Word will synthesize a fake
  oblique), and **Medium/SemiBold/Light are separate Word families** — `Space Grotesk SemiBold`,
  not `Space Grotesk` + bold.

## 2026-08-12

- **Direction: B "Engineered (live)" wins.** A killed but its accent-thread mechanic absorbed
  into B; C killed outright. **Palette revision:** key colour is **forest green**, not yellow —
  Alex's preference. See `directions.md` for the revised spec.
- **Domain, revised:** going **`.com.au`** — ABN approved 2026-08-12, waiting on the ABN lookup
  to update (reportedly 24–48h) before registrars will validate it. Register once it propagates.
  - *For the record:* Alex found `alexjyoung.au` showing as taken on registrar searches
    (2026-08-12), though auDA whois returned "Domain not found" the same morning — possibly a
    registrar quirk or a variant mix-up. Moot if `.com.au` proceeds; only worth revisiting if
    the `.com.au` path stalls.
- **Content drafts approved for mocking** — Step 3 can use the current `content/` drafts as-is;
  Alex's voice pass on them is coming within days (and doubles as writing-style calibration).
- **Photo:** yes, but **small-ish and not front-and-centre** — belongs on /about (and perhaps a
  small version near the home intro), never as a hero. Consistent with the plan's trust-signal
  reasoning without leading with the person's face.
- **Case-study launch set:** **the brain · Wayfare · QuietNine · fitness dashboard** — written
  **blog-post style** (first-person build narrative), not formal portfolio pages. Still follows
  the plan's spine per study: problem → decisions with trade-offs → what shipped (real
  screenshots) → what I'd do differently.
  - *Note:* this swaps the plan's "OAuth MCP server" slot for the brain project. The OAuth MCP
    story doesn't disappear — it folds into the Wayfare study (it's that app's backend) and
    resurfaces as its own piece when the C2 template ships with the /downloads area.
- **Repo:** design + build both live in `AKJ-Design/personal-website` (this repo). Research,
  directions, mocks and the design system are committed here so the "how I built this site" post
  has its receipts.

## Open (owner: Alex)

- ~~**Domain**~~ — **closed 2026-08-15: `alexyoung.com.au` registered (Hostinger).** Remaining:
  connect it to Cloudflare when the build phase starts.
- **Dark mode** — plan default stands: one deliberate theme at launch; toggle later only if the
  design system makes it cheap. *Note (2026-08-15): the two-theme architecture does **not** by
  itself deliver this. Wayfare Dark is a separate identity (gold, serif), not a dark mode for the
  site — a site dark mode would be a third theme, re-deriving the green against a dark ground.
  The token structure makes it cheaper, not free.*
- ~~**Exact green**~~ — **closed 2026-08-15: `#204E39`.**
