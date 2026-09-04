/**
 * Structured data — build plan §2.5, design plan §8.
 *
 * This module exists for one reason: "Alex Young" is a common name, several
 * established sites already hold it, and design plan §8 concluded the search
 * lever is not the name but ENTITY CONSISTENCY — the same person, asserted the
 * same way, everywhere. That only works if every page points at one identity
 * rather than each describing a similar-looking one.
 *
 * So the identity has an `@id`, `PERSON_ID`, and both pages that emit JSON-LD
 * reference it: /about defines the full Person at that id, and each post's
 * author points back to the same id. Two pages, one entity. Written here once
 * so the id itself cannot drift — the failure mode is silent, because two
 * Person nodes with different ids are perfectly valid JSON-LD and simply
 * describe two different people.
 *
 * NOTE ON `@type: Article`. The build plan and design plan both specify
 * `Article`; `BlogPosting` is its subtype and search engines treat the two the
 * same, so this stays as documented rather than quietly diverging.
 *
 * These blocks are the only <script> tags this REPO emits, and they carry data
 * rather than code — no framework, no hydration, no islands.
 *
 * They are not the only scripts a BROWSER receives. Cloudflare Web Analytics
 * injects a beacon at the edge, for browser requests only, so it appears in
 * neither the build output nor a curl (found 2026-09-05, by a link checker that
 * followed it). Check what visitors get with a browser user-agent, not curl:
 *
 *   curl -sA 'Mozilla/5.0' https://alexyoung.com.au/ | grep -o '<script[^>]*>'
 *
 * If a script appears there that is neither one of these blocks nor that
 * beacon, something has been added the performance budget did not agree to.
 */
import { GITHUB_URL, LINKEDIN_URL } from '../data/social';
import { isoDate } from './posts';

/** The site's one person, as a resolvable identifier rather than a name. */
export const personId = (site: URL) => new URL('/about/#person', site).href;

/**
 * The full Person node. Lives on /about, which is the entity anchor.
 *
 * `sameAs` is scoped to GitHub + LinkedIn only (step 0's accuracy gate): the
 * App Store joins the list if and when Wayfare leaves TestFlight, and not before
 * — an unresolvable profile link is a claim that isn't true.
 */
export function personLd(site: URL, imageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId(site),
    name: 'Alex Young',
    url: new URL('/about/', site).href,
    image: imageUrl,
    sameAs: [GITHUB_URL, LINKEDIN_URL],
  };
}

export interface ArticleInput {
  site: URL;
  /** Canonical page URL, the same one <link rel="canonical"> carries. */
  url: URL;
  title: string;
  description: string;
  /** Publish date from the collection schema. */
  date: Date;
  /** Absolute URL of the post's generated OG card. */
  imageUrl: string;
  tags: string[];
}

/**
 * A post's Article, emitted as an `@graph` alongside a minimal Person carrying
 * the same `@id`.
 *
 * Why the graph rather than a bare `author: { '@id': ... }`: a reference whose
 * target is only defined on another page is legal but asks the consumer to have
 * already crawled /about and to have kept the node. Restating the person here,
 * at the same id, makes the reference resolve inside this one document while
 * still asserting it is the same entity as the one on /about. Costs a few lines
 * of JSON; removes a dependency on crawl order.
 *
 * `dateModified` is deliberately absent. Nothing in the build tracks edit dates,
 * and emitting the publish date as a modification date would be a fact the site
 * does not actually know — the same rule the About plate and the live strip run
 * under.
 *
 * `datePublished` is a DATE, not a datetime, via the same isoDate() the cards
 * and the meta line use. Frontmatter carries `date: 2026-08-15` with no time, so
 * `toISOString()` would publish `T00:00:00.000Z` — an hour the site invented,
 * and one that reads as the day before in any timezone behind UTC. schema.org
 * accepts a plain date; asserting only what is known is cheaper than being
 * precisely wrong.
 */
export function articleLd({ site, url, title, description, date, imageUrl, tags }: ArticleInput) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId(site),
        name: 'Alex Young',
        url: new URL('/about/', site).href,
        sameAs: [GITHUB_URL, LINKEDIN_URL],
      },
      {
        '@type': 'Article',
        '@id': `${url.href}#article`,
        headline: title,
        description,
        datePublished: isoDate(date),
        image: imageUrl,
        url: url.href,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url.href },
        author: { '@id': personId(site) },
        publisher: { '@id': personId(site) },
        inLanguage: 'en-AU',
        keywords: tags,
      },
    ],
  };
}
