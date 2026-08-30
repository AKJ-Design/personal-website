# Step 2 — Three named directions · RESOLVED

*Outcome (Alex's call, 2026-08-12): **Direction B wins.** Direction A is killed but its
signature-colour accent thread is absorbed into B. Direction C is killed outright. B's palette
revised: forest green as the key colour, not yellow. The killed directions are kept below for
the record — they're receipts for the "how I built this site" post.*

**Shared constraints (carried into Step 3):** the §7 banned-tells list; max two self-hosted font
files; zero client-side JS by default; one signature element, used consistently; real copy from
`content/` only.

---

## ✅ B · Engineered (live) — CHOSEN, revised

**Concept:** The design *is* the flagship story — the site presents like a well-built system,
and proves it by streaming live data from Alex's own APIs onto the page.

- **Type:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (variable) for
  headlines + [JetBrains Mono](https://www.jetbrains.com/lp/mono/) for labels, stats, tags and
  code. Body: system stack. Two font files, done.
- **Palette (revised 2026-08-12):** warm off-white ground, near-black ink, and **forest green**
  as the single key colour — deep enough to pass WCAG AA as link/label text on the off-white
  (verify exact value in Step 4). Fine hairline rules and schematic grid marks in warm stone
  grey. Optional secondary, used sparingly and only if the mocks earn it: a muted copper/tan for
  non-interactive warmth (tags, chart fills). Green does *all* interactive work.
- **The accent thread (absorbed from A):** the forest green runs felix.gripe-style through
  everything — wordmark → link underlines and marker-style hover → selection colour → post-card
  accents → the live strip's monospace labels. One colour, everywhere, doing the site's visual
  identity single-handedly. This is palette discipline, not a second gadget — the signature
  element remains the strip.
- **Signature element:** the **live status strip** on the home page — a thin, monospace-labelled
  band of real data from Alex's own infrastructure: last night's sleep (fitness pipeline), last
  workout, homelab services up (Uptime Kuma count), local weather. One small island with a
  static build-time fallback; degrades to cached values, never to a broken row.
- **Steals from research:** tzovar.as live stats; vercel/amra bold type + few real screenshots;
  whynot.fail varied list rows; felix.gripe colour continuity (via A).
- **Guardrails:** the strip is the one signature element — no other live widgets, no terminal
  cosplay, no fake CLI. The strip needs a small public Worker endpoint (build-phase work) and a
  data-privacy pass: coarse/delayed values only, and **nothing that names or implies what the
  node box runs**.
- **Aesthetic note on the green:** forest green shifts the register from "hazard-label tech" to
  something closer to field notes / topographic survey — still engineered, more distinctive than
  the electric-accent dev-site default, and warmer for the future services audience.

---

## ❌ A · Editorial — killed (accent thread absorbed into B)

Type-led direction: Fraunces serif headlines, warm paper, one hot accent threaded through all
interactive elements. Killed as a whole 2026-08-12; the **accent-thread mechanic** — one key
colour carrying the entire visual identity — was the direction's best idea and now lives in B.

## ❌ C · Warm colour-block — killed

Colour-per-project block cards (paradoxpairs × felix.gripe), Bricolage Grotesque, warm neutrals.
Killed 2026-08-12 — closest of the three to template territory, and its warmth job is now
covered by B's green + off-white revision.

---

## What Step 3 now looks like

Mock **B only**: home + one blog post, self-contained HTML, desktop and phone widths. Iterate on
B rather than comparing directions; add the projects page once home + post feel right (plan §6
Step 3). Content: current `content/` drafts are approved for mocking (Alex's voice pass to
follow — mocks re-flow copy, they don't freeze it).
