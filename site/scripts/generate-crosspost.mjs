/**
 * Build-plan step 10 — turn a published post into dev.to-ready Markdown.
 *
 *   node scripts/generate-crosspost.mjs wayfare-part-1
 *
 * Writes dist/crosspost/<slug>.md. Nothing is posted; the file is Alex's to
 * paste, review and publish. This exists as a script rather than a hand-edit for
 * the same reason the OG cards do: Part 2 is coming, and a transformation you
 * cannot re-run is one you cannot check.
 *
 * WHAT IT HAS TO FIX, and why each would break silently if it didn't:
 *
 * 1 · `canonical_url`. The entire point of a cross-post. Without it the copy
 *     competes with the original for the same content, which for a common name
 *     is the precise outcome design plan §8 exists to prevent. It is the first
 *     thing to check on the published article, not the last.
 *
 * 2 · Image URLs. Every `src` in the post is site-relative (`/images/...`),
 *     which on dev.to resolves to dev.to. They become absolute against SITE.
 *
 * 3 · The two CSS-only replay figures. These are ~30 divs each whose meaning
 *     lives entirely in styles/replay.css and styles/delivery.css. dev.to ships
 *     neither, so they would render as a wall of loose sentences — worse than
 *     absent, because it looks like broken writing rather than a missing asset.
 *     They are replaced by a line of prose and a link back to the original. That
 *     is honest, needs no new asset, and sends the interested reader to the
 *     canonical URL, which is what a cross-post is for.
 *
 * 4 · `<figure>` wrappers. dev.to strips unknown classes, so the shot/diagram
 *     figures degrade to a bare image with its caption stranded beneath. They
 *     become Markdown images with the caption as italic text under them.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://alexyoung.com.au';

const slug = process.argv[2];
if (!slug) {
  console.error('usage: node scripts/generate-crosspost.mjs <slug>');
  process.exit(1);
}

const raw = await readFile(join(ROOT, 'src/content/blog', `${slug}.md`), 'utf8');

const fm = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
if (!fm) throw new Error(`${slug}.md has no frontmatter`);
const [, frontmatter, bodyRaw] = fm;

const field = (name) => {
  const m = frontmatter.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : '';
};

const title = field('title');
const excerpt = field('excerpt');
const tags = (field('tags').match(/\[(.*)\]/)?.[1] ?? '')
  .split(',').map((t) => t.trim()).filter(Boolean);

const canonical = `${SITE}/blog/${slug}/`;
let body = bodyRaw;

/* 3 — the replay figures. Matched by their class, not their position, so
   reordering the post cannot silently leave one behind. */
let replaysReplaced = 0;
body = body.replace(
  /<figure class="replay">[\s\S]*?<figcaption>(.*?)<\/figcaption>\s*<\/figure>/g,
  (_m, caption) => {
    replaysReplaced += 1;
    const what = caption.replace(/^Replay\s*—\s*/, '');
    return `> **${what[0].toUpperCase()}${what.slice(1)}** — this is a short animation in the original post, built in CSS with no JavaScript. [Watch it on the original →](${canonical})`;
  },
);

/* 4 — shot and diagram figures become Markdown images with an italic caption.
   The <a href> wrapper around some images is dropped: dev.to has its own
   lightbox, and a link to a bare .jpg is a worse experience than none. */
let figuresConverted = 0;
body = body.replace(
  /<figure class="(?:shot|diagram)[^"]*">\s*(?:<a [^>]*>)?\s*<img\s+src="([^"]+)"\s+alt="([^"]*)"[^>]*\/>\s*(?:<\/a>)?\s*<figcaption>(.*?)<\/figcaption>\s*<\/figure>/g,
  (_m, src, alt, caption) => {
    figuresConverted += 1;
    return `![${alt}](${src.startsWith('http') ? src : SITE + src})\n\n*${caption}*`;
  },
);

/* 2 — anything still carrying a site-relative URL (the thumbnail inside the
   <details> prompt block, which stays as HTML because dev.to renders it). */
body = body.replace(/(src|href)="(\/[^"]+)"/g, (_m, attr, path) => `${attr}="${SITE}${path}"`);

const out = `---
title: ${title}
published: false
description: ${excerpt}
tags: ${tags.join(', ')}
canonical_url: ${canonical}
cover_image: ${SITE}/og/${slug}.png
---

${body.trim()}

---

*Originally published at [alexyoung.com.au](${canonical}).*
`;

const dir = join(ROOT, 'dist/crosspost');
await mkdir(dir, { recursive: true });
const dest = join(dir, `${slug}.md`);
await writeFile(dest, out, 'utf8');

const leftovers = [...out.matchAll(/(?:src|href)="\/(?!\/)/g)].length;
const strayHtml = [...out.matchAll(/<div class="rp|<figure class="(?:shot|diagram|replay)/g)].length;

console.log(`crosspost → ${dest}`);
console.log(`  canonical_url    ${canonical}`);
console.log(`  cover_image      ${SITE}/og/${slug}.png`);
console.log(`  tags             ${tags.join(', ')}`);
console.log(`  replay figures   ${replaysReplaced} replaced with a link back`);
console.log(`  shot/diagram     ${figuresConverted} converted to Markdown`);
console.log(`  relative URLs    ${leftovers} left (must be 0)`);
console.log(`  stray site HTML  ${strayHtml} left (must be 0)`);
if (leftovers || strayHtml) {
  console.error('\nFAILED: the output still carries site-only markup. Do not paste it.');
  process.exit(1);
}
