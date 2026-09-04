# Home page copy

*Status: **Alex's revision, 2026-08-23** — hook settled; one-liners approved as written. The
plan's rule: the mocks use this copy verbatim.*

## The two-sentence positioning

> I'm Alex, and I run my life on my own APIs — a travel app I built and shipped, a
> knowledge base my AI tools read and write, a fitness pipeline I actually review every week.
> This site is the portfolio and the build log behind it: what I made, the decisions and
> trade-offs, and what I'd do differently.

*"I'm Alex" matches /about (decision 2026-08-23). The full name still appears in the wordmark,
`<title>` and `Person` structured data — that's where the entity-consistency job gets done.
"Built and shipped" gate resolved 2026-08-27: Wayfare is TestFlight-only, and "shipped" (with no
store named) is literally true of TestFlight distribution — wording stands. /about now says
TestFlight explicitly.*

## The live strip (copy settled 2026-09-01, step 7)

The four labels, left to right, and the stamp:

> **Last workout** · **Services** · **Off-site backup** · **Weather**
>
> *pushed from my laptop · cached 07:00*

*The values themselves are never written here — they arrive from the hourly snapshot and change
every hour. Only the labels and the stamp are copy.*

*The mock's stamp read "live from my own APIs", and it was retired rather than shortened. Three of
the four values are mine; the weather is a public API, so the sentence stopped being literally
true the moment the cell set was settled — and `decisions.md`'s rule for the About plate is the
one that governs here too: every value on the page is a claim, and every claim must be literally
true. What replaced it is true of all four, and says the more interesting thing anyway: these are
pushed here from a laptop, not fetched on demand.*

*Sleep was dropped from the row on the same day. It was in the mock, but Apple Health reaches the
database through a manual file drop, so the figure would routinely have been days old under a
stamp that implies hours.*

## Project one-liners (six cards, 2026-08-23; order = strongest first)

- **Wayfare** — a native iOS/SwiftUI travel planner, built on my own Cloudflare Workers + D1 API.
- **The brain** — a plain-markdown knowledge base with an MCP server on top, so my AI tools and
  I read the same source of truth.
- **Fitness dashboard** — a local-first pipeline pulling training, sleep and nutrition into one
  SQLite hub, reviewed weekly through MCP.
- **QuietNine** — a minimalist iOS/SwiftUI Sudoku game, built end-to-end to learn the platform properly.
- **Homelab** — a two-box setup in the study: Proxmox, DNS, a reverse proxy, and
  Prometheus/Grafana watching the lot — learned from the BIOS up.
- **This site** — Astro on Cloudflare, no JavaScript of my own, a design system shared with
  Wayfare. Built in the open; the rejected directions are in the repo.

*Homelab rule: the public story is the services VM. The node box is just "another machine" —
what it runs is never named or implied. Screenshots get a redaction pass against the private
allow-list (kept in the build plan, not in this repo) before publishing.*

*Rewrite prompts: each should survive being read alone on a card. Check every claim is currently
true. (Wayfare distribution resolved 2026-08-27: TestFlight only — no card claims a store, so
nothing to change.)*
