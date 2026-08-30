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

import brain from '../assets/cards/brain.svg';
import fitness from '../assets/cards/fitness.svg';
import homelab from '../assets/cards/homelab.svg';
import thisSite from '../assets/cards/this-site.svg';
import quietnineIcon from '../assets/cards/quietnine-icon.png';
import wayfareShot from '../assets/cards/wayfare-today.jpg';

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
  href: string;
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
    href: '#',
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
    href: '#',
    visual: fitness,
    alt: 'Bar chart: weekly training tonnage over twelve weeks',
  },
  {
    idx: '04',
    kind: 'compact',
    title: 'QuietNine',
    blurb: 'A minimalist SwiftUI Sudoku, built end-to-end to learn the platform properly.',
    meta: 'SwiftUI',
    href: '#',
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
    href: '#',
    visual: homelab,
    alt: 'Diagram: services VM on Proxmox, node box, and off-site VPS',
  },
  {
    idx: '06',
    kind: 'mid',
    title: 'This site',
    blurb:
      'Astro on Cloudflare, zero JS, a design system shared with Wayfare. Built in the open; the rejected directions are in the repo.',
    meta: 'Astro · Cloudflare · zero JS',
    href: '#',
    visual: thisSite,
    alt: 'Diagram: one shared design-system spine with two themes',
  },
];
