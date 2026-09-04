/**
 * The six launch cards.
 *
 * Copy is verbatim from ../../content/home.md ("the mocks use this copy
 * verbatim" — content-before-pixels rule), and the order is Alex's:
 * strongest first, settled 2026-08-23.
 *
 * Mosaic shape, verified in the mock at 1280 and 375:
 *   flagship (Wayfare, full width)
 *   mid pair (brain, fitness)
 *   compact  (QuietNine, full-width slim row)
 *   mid pair (homelab, this site)
 * "This site" is mid rather than compact so no card strands on a half-width row.
 *
 * PRIVACY RULE (content/home.md, decisions.md): the homelab card describes the
 * services VM. The node box is "another machine" — what it runs is never
 * named or implied, here or in the homelab post.
 */
import type { ImageMetadata } from 'astro';
import { REPO_URL } from './social';

/* WHY THESE ARE PRE-SIZED WEBP AND RENDERED WITH A PLAIN <img>
 *
 * Home is the site's one on-demand route (step 7, so the strip can read KV), and
 * astro:assets only pre-generates derivatives for routes it prerenders. Left as
 * <Image>, every visual on the front page resolved to `/_image?href=...` at request
 * time — a Worker invocation per image, no immutable caching, and with
 * `imageService: 'compile'` the passthrough endpoint ignores the resize and serves
 * the original anyway (measured 2026-09-01: a 240px slot served a 640px JPEG).
 *
 * So the resizing moved to author time. These files are already the size they are
 * displayed at, imported as ESM so they still get content-hashed filenames and the
 * immutable Cache-Control that `_headers` puts on /_astro/*, and rendered as plain
 * <img> so no image service is involved on any route. The flagship shot got smaller
 * doing it: 78 KB JPEG -> 16 KB WebP, at twice the pixel density.
 *
 * The originals stay in ../../design/mocks/assets/ and design/photo/, which is the
 * same receipt-vs-build-copy split as tokens.css. Re-derive with sharp if a slot
 * size ever changes — and change the size HERE, not with a CSS scale.
 */
import brain from '../assets/cards/brain.svg';
import fitness from '../assets/cards/fitness.svg';
import homelab from '../assets/cards/homelab.svg';
import thisSite from '../assets/cards/this-site.svg';
import quietnineIcon from '../assets/cards/quietnine-icon.webp';
import wayfareShot from '../assets/cards/wayfare-today.webp';

export type CardKind = 'flagship' | 'mid' | 'compact';

export interface Project {
  idx: string;
  kind: CardKind;
  title: string;
  /** One-liner. Must survive being read alone on a card. */
  blurb: string;
  /** Flagship only — the story hook under the blurb (mock rev 4). */
  hook?: string;
  meta: string;
  /**
   * OPTIONAL, and its absence is the point (2026-09-05, step 9).
   *
   * Five of the six cards had `href: '#'` at launch, because every repo except
   * this site's is private and the case studies are not written. A card with a
   * dead link still floated, still lifted on hover and still turned its title
   * `--accent` — and the accent thread is reserved for things you can actually
   * interact with (decisions.md, 2026-08-15). So a card with nothing to point
   * at renders as a <div>, not an <a>: no pointer, no lift, no green.
   *
   * Give a card an href the day its write-up ships. That is the only change
   * needed — Card.astro switches element and hover behaviour off this field.
   */
  href?: string;
  visual: ImageMetadata;
  /** Empty alt = decorative (the compact card's app icon). */
  alt: string;
}

export const PROJECTS: Project[] = [
  {
    idx: '01',
    kind: 'flagship',
    title: 'Wayfare',
    blurb:
      'A native iOS/SwiftUI travel planner, built on my own Cloudflare Workers + D1 API.',
    hook: '+ the story of a flight search becoming a fully fledged iOS app',
    meta: 'SwiftUI · Cloudflare · MCP · shipped',
    /* Build plan §5: at launch the flagship links to the Part 1 post, not to a
       case-study page. That route does not exist until step 6. */
    href: '/blog/wayfare-part-1/',
    visual: wayfareShot,
    alt: 'Wayfare — a Bangkok trip: stays, flights and the day-one itinerary',
  },
  {
    idx: '02',
    kind: 'mid',
    title: 'The brain',
    blurb:
      'A plain-markdown knowledge base with an MCP server on top, so my AI tools and I read the same source of truth.',
    meta: 'markdown · MCP · 11 docs',
    visual: brain,
    alt: 'Diagram: AI tools read and write the brain, which I also read and write',
  },
  {
    idx: '03',
    kind: 'mid',
    title: 'Fitness dashboard',
    blurb:
      'A local-first pipeline pulling training, sleep and nutrition into one SQLite hub, reviewed weekly through MCP.',
    meta: 'SQLite · local-first',
    visual: fitness,
    alt: 'Bar chart: weekly training tonnage over twelve weeks',
  },
  {
    idx: '04',
    kind: 'compact',
    title: 'QuietNine',
    blurb: 'A minimalist SwiftUI Sudoku, built end-to-end to learn the platform properly.',
    meta: 'SwiftUI',
    visual: quietnineIcon,
    alt: '',
  },
  {
    idx: '05',
    kind: 'mid',
    title: 'Homelab',
    blurb:
      'A two-box setup in the study: Proxmox, DNS, a reverse proxy, and Prometheus/Grafana watching the lot — learned from the BIOS up.',
    meta: 'Proxmox · Caddy · Grafana · 11 services',
    visual: homelab,
    alt: 'Diagram: services VM on Proxmox, node box, and off-site VPS',
  },
  {
    idx: '06',
    kind: 'mid',
    title: 'This site',
    blurb:
      'Astro on Cloudflare, no JavaScript of my own, a design system shared with Wayfare. Built in the open; the rejected directions are in the repo.',
    /* "of my own" is load-bearing, not modesty (2026-09-05). Astro ships no
       client-side JavaScript for this site — no framework, no hydration, no
       islands — but Cloudflare Web Analytics injects a beacon at the EDGE, for
       browser requests only. It is invisible to curl and absent from the build
       output, which is why every check until now said zero. "zero JS" was
       therefore a claim the front page could not keep. See /about's colophon. */
    meta: 'Astro · Cloudflare · no JS of my own',
    /* The one card that has somewhere real to go: the repo it describes. Shared
       with the footer and /about's receipts row via data/social.ts. */
    href: REPO_URL,
    visual: thisSite,
    alt: 'Diagram: one shared design-system spine with two themes',
  },
];
