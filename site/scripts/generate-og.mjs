/**
 * OG image generation — build plan §2.5: "Space Grotesk title on the warm
 * ground, green rule", generated at build, zero runtime cost.
 *
 * This runs as a plain Node step BEFORE `astro build` (see package.json):
 * the Cloudflare adapter prerenders pages inside a workerd sandbox, which
 * disallows runtime WASM (satori's layout engine) and native modules (resvg)
 * — so OG cards cannot be an Astro endpoint on this stack. Instead the PNGs
 * land in public/og/ (gitignored) and ship as ordinary static assets:
 *   /og/site.png            the site-wide default (Base.astro's fallback)
 *   /og/<post-id>.png       one per blog post
 *
 * Colours are the tokens' literals — satori can't read CSS custom properties.
 * If tokens.css ever changes, change these too. Fonts come from the static
 * Fontsource packages (.woff — satori reads ttf/otf/woff, not the variable
 * .woff2 pair the site itself serves).
 */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const siteDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const blogDir = path.join(siteDir, 'src/content/blog');
const outDir = path.join(siteDir, 'public/og');

const SURFACE = '#FAF7F2';
const INK = '#141210';
const MUTED_2 = '#6B6358';
const ACCENT = '#204E39';

const fonts = await Promise.all(
  [
    ['Space Grotesk', '@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff', 600],
    ['Space Grotesk', '@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff', 700],
    ['JetBrains Mono', '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff', 500],
  ].map(async ([name, file, weight]) => ({
    name,
    data: await readFile(require.resolve(file)),
    weight,
    style: 'normal',
  })),
);

/** satori takes React-shaped element objects; this keeps them terse. */
const el = (type, style, children) => ({ type, props: { style, children } });

function card(title, eyebrow) {
  return el(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: SURFACE,
      padding: '72px 80px 64px',
    },
    [
      el(
        'div',
        {
          fontFamily: 'JetBrains Mono',
          fontWeight: 500,
          fontSize: 26,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: MUTED_2,
        },
        eyebrow,
      ),
      el('div', { flexGrow: 1, display: 'flex', alignItems: 'center', paddingRight: 40 }, [
        el(
          'div',
          {
            fontFamily: 'Space Grotesk',
            fontWeight: 600,
            fontSize: title.length > 42 ? 64 : 76,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            color: INK,
          },
          title,
        ),
      ]),
      el(
        'div',
        {
          borderTop: `4px solid ${ACCENT}`,
          paddingTop: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        },
        [
          el(
            'div',
            { fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 32, letterSpacing: '-0.02em', color: ACCENT },
            'Alex Young',
          ),
          el('div', { fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 24, color: MUTED_2 }, 'alexyoung.com.au'),
        ],
      ),
    ],
  );
}

async function png(title, eyebrow) {
  const svg = await satori(card(title, eyebrow), { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

/* Frontmatter is ours and simple (single-line quoted strings); a targeted
   parse keeps this script dependency-free. */
function frontmatterField(source, key) {
  const match = source.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!match) throw new Error(`frontmatter field "${key}" not found`);
  return match[1].trim().replace(/^['"]|['"]$/g, '');
}

await mkdir(outDir, { recursive: true });

const cards = [
  { id: 'site', title: 'I run my life on my own APIs.', eyebrow: 'Field notes · est. 2026 · Brisbane, AU' },
];
for (const file of await readdir(blogDir)) {
  if (!file.endsWith('.md')) continue;
  const source = await readFile(path.join(blogDir, file), 'utf8');
  cards.push({
    id: file.replace(/\.md$/, ''),
    title: frontmatterField(source, 'title'),
    eyebrow: frontmatterField(source, 'eyebrow'),
  });
}

for (const { id, title, eyebrow } of cards) {
  await writeFile(path.join(outDir, `${id}.png`), await png(title, eyebrow));
  console.log(`og: ${id}.png — "${title}"`);
}
