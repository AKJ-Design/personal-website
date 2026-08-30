/**
 * The public profiles and the repo, each written once. Footer.astro renders
 * them; /about's Person JSON-LD reuses the same constants for `sameAs`, so the
 * visible links and the structured data cannot drift apart.
 *
 * Step 0 scoped `sameAs` to exactly GitHub + LinkedIn; the App Store joins
 * if/when Wayfare leaves TestFlight.
 */
export const GITHUB_URL = 'https://github.com/AKJ-Design';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/alexjyoung/';

/** The public repo — the receipts row on /about links into it. */
export const REPO_URL = 'https://github.com/AKJ-Design/personal-website';
