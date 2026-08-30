#!/usr/bin/env node
/* =============================================================================
   ds-bundle/build.mjs — render the Field Notes Light cards for Claude Design.

   WHY THIS IS A GENERATOR AND NOT A FOLDER OF HTML
   design-system.md already warns that tokens.css exists twice with nothing
   syncing the copies. A Claude Design project is a third place the values could
   drift. So no card contains a hand-typed colour: every card inlines the real
   tokens.css and styles against var(--token), exactly like every other consumer.
   Swatch captions read their hex and measured ratio from tokens.json.

   Change a token -> re-run this -> git diff shows precisely what moved.
   tokens.css stays upstream. This output never becomes a source of truth.

   Usage:  node build.mjs        (writes ./out)
   ============================================================================= */

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
const TOKENS = readFileSync(join(HERE, '..', 'tokens.css'), 'utf8');
const T = JSON.parse(readFileSync(join(HERE, '..', 'tokens.json'), 'utf8'));
const L = T.themes.fieldNotesLight;

rmSync(OUT, { recursive: true, force: true });

/* Fonts: Space Grotesk and JetBrains Mono are linked, not embedded. Embedding
   would put ~800KB of base64 in every card. tokens.css already declares the
   documented fallback stacks, so a card still reads correctly if the link is
   blocked -- it just loses the display face. */
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com">'
  + '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
  + '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700'
  + '&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">';

const BASE = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0; padding: var(--space-7);
    background: var(--surface); color: var(--ink);
    font-family: var(--font-body); font-size: var(--step-0);
    line-height: var(--leading-body);
    -webkit-font-smoothing: antialiased;
  }
  ::selection { background: var(--wash-strong); }
  .eyebrow {
    font-family: var(--font-mono); font-size: var(--step--2);
    text-transform: uppercase; letter-spacing: var(--track-eyebrow);
    color: var(--muted-2); margin: 0 0 var(--space-3);
  }
  h1 {
    font-family: var(--font-display); font-size: var(--step-3);
    letter-spacing: var(--track-display); line-height: var(--leading-tight);
    font-weight: 500; margin: 0 0 var(--space-3);
  }
  h2 {
    font-family: var(--font-display); font-size: var(--step-2);
    letter-spacing: var(--track-display); line-height: var(--leading-head);
    font-weight: 500; margin: var(--space-7) 0 var(--space-4);
  }
  .lede { font-size: var(--step-1); color: var(--muted); max-width: var(--measure); margin: 0 0 var(--space-6); }
  p { max-width: var(--measure); }
  .label {
    font-family: var(--font-mono); font-size: var(--step--2);
    text-transform: uppercase; letter-spacing: var(--track-label);
    color: var(--muted-2);
  }
  .mono { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
  /* token names must not break across lines mid-identifier */
  code.mono { white-space: nowrap; }
  .rule { border: 0; border-top: 1px solid var(--hairline); margin: var(--space-6) 0; }
  a { color: var(--accent); text-underline-offset: 3px; text-decoration-thickness: 1px; }
  a:hover { color: var(--accent-light); background: var(--wash); }
  .note {
    border-left: 2px solid var(--accent); background: var(--surface-sunk);
    padding: var(--space-4) var(--space-5); margin: var(--space-5) 0;
    max-width: var(--measure); font-size: var(--step--1); color: var(--muted);
  }
  .note strong { color: var(--ink); }
  .grade {
    font-family: var(--font-mono); font-size: var(--step--2);
    letter-spacing: var(--track-label); padding: 2px 6px;
    border: 1px solid var(--hairline); color: var(--muted-2);
  }
`;

function card({ path, group, name, subtitle, body, css = '' }) {
  const html = `<!-- @dsCard group="${group}" name="${name}"${subtitle ? ` subtitle="${subtitle}"` : ''} -->
<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${name} — Field Notes Light</title>
${FONTS}
<style>
/* ---- tokens.css, inlined verbatim from design/tokens.css ---- */
${TOKENS}
/* ---- card chrome ---- */
${BASE}${css}
</style></head><body>
${body}
</body></html>
`;
  const full = join(OUT, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
  return { name, path, group, subtitle };
}

const cards = [];
const hex = (t) => t.value;
const ratio = (t) => (t.onSurface ?? t.onAccent).toFixed(2) + ':1';

/* ------------------------------------------------------------------ COLOUR */

const swatchRows = [
  ['--surface',        L.surface,       'ground'],
  ['--surface-raised', L.surfaceRaised, 'floating cards only'],
  ['--surface-sunk',   L.surfaceSunk,   'code, callouts, frames'],
  ['--ink',            L.ink,           'body and headings'],
  ['--muted',          L.muted,         'secondary prose, captions'],
  ['--muted-2',        L.muted2,        'labels + hairlines. never body copy'],
  ['--accent',         L.accent,        'ALL interactive work'],
  ['--accent-light',   L.accentLight,   'hover / active lift only'],
  ['--on-accent',      L.onAccent,      'text on the accent'],
];

cards.push(card({
  path: 'colour/palette.html',
  group: 'Colour',
  name: 'Palette',
  subtitle: `${swatchRows.length} tokens, measured against ${hex(L.surface)}`,
  css: `
    .sw { display: grid; grid-template-columns: 96px 1fr; border-top: 1px solid var(--hairline); }
    .sw:last-child { border-bottom: 1px solid var(--hairline); }
    /* inset hairline so the --surface and --surface-raised chips stay visible on the warm ground */
    .chip { border-right: 1px solid var(--hairline); box-shadow: inset 0 0 0 1px var(--hairline-soft); }
    .meta { padding: var(--space-4) var(--space-5); display: grid; align-items: baseline;
            gap: var(--space-2) var(--space-4);
            grid-template-columns: 16ch 9ch 8ch 4.5ch minmax(0, 1fr); }
    @media (max-width: 720px) { .meta { grid-template-columns: 16ch 9ch 8ch 4.5ch; }
                                .use { grid-column: 1 / -1; } }
    .tok { font-family: var(--font-mono); font-size: var(--step--1); color: var(--ink); }
    .val { font-family: var(--font-mono); font-size: var(--step--1); font-variant-numeric: tabular-nums; color: var(--muted); }
    .rat { font-family: var(--font-mono); font-size: var(--step--1); font-variant-numeric: tabular-nums; color: var(--muted); }
    .use { font-size: var(--step--1); color: var(--muted-2); }
  `,
  body: `
    <p class="eyebrow">Field Notes Light</p>
    <h1>Palette</h1>
    <p class="lede">Nine tokens. Ratios are measured against this theme's own ground, and every one of them is stated because a value that drifts silently is the failure mode this system has already had twice.</p>
    ${swatchRows.map(([tok, t, use]) => `
      <div class="sw">
        <div class="chip" style="background: var(${tok});"></div>
        <div class="meta">
          <span class="tok">${tok}</span>
          <span class="val">${hex(t)}</span>
          <span class="rat">${t.onSurface || t.onAccent ? ratio(t) : '—'}</span>
          ${t.grade ? `<span class="grade">${t.grade}</span>` : '<span></span>'}
          <span class="use">${use}</span>
        </div>
      </div>`).join('')}
    <div class="note"><strong>Hairlines are the accent at low alpha, never a grey.</strong>
      <code class="mono">--hairline</code> is accent @ 20%, <code class="mono">--hairline-soft</code> @ 10%.
      This is most of why the surface reads warm and deliberate rather than default.</div>
  `,
}));

cards.push(card({
  path: 'colour/accent-thread.html',
  group: 'Colour',
  name: 'The accent thread',
  subtitle: 'the one rule — accent does all interactive work',
  css: `
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-5); margin: var(--space-6) 0; }
    .demo { border: 1px solid var(--hairline); padding: var(--space-5); background: var(--surface-raised); }
    .demo .label { display: block; margin-bottom: var(--space-4); }
    .btn {
      font-family: var(--font-body); font-size: var(--step--1); font-weight: 500;
      background: var(--accent); color: var(--on-accent);
      border: 1px solid var(--accent); border-radius: var(--radius-card);
      padding: var(--space-3) var(--space-5); cursor: pointer;
    }
    .btn:hover { background: var(--accent-light); border-color: var(--accent-light); }
    .field {
      font-family: var(--font-body); font-size: var(--step--1);
      padding: var(--space-3); width: 100%; background: var(--surface);
      border: 1px solid var(--hairline); border-radius: var(--radius-card); color: var(--ink);
    }
    .field.focused { outline: 2px solid var(--accent); outline-offset: 2px; border-color: var(--accent); }
    mark { background: var(--wash-strong); color: var(--ink); }
    .never { border-left: 2px solid var(--crit); background: var(--surface-sunk); padding: var(--space-4) var(--space-5); max-width: var(--measure); }
    .never .swatchline { display: flex; gap: var(--space-3); align-items: center; margin-top: var(--space-3); }
    .dot { width: 14px; height: 14px; display: inline-block; }
  `,
  body: `
    <p class="eyebrow">The rule that matters</p>
    <h1>The accent thread</h1>
    <p class="lede">If a thing is interactive it wears <code class="mono">--accent</code>. If it wears the accent it should be interactive. A second interactive colour kills the thread, and the identity with it.</p>
    <div class="grid">
      <div class="demo"><span class="label">Link</span>
        <p style="margin:0"><a href="#">a link in running text</a> sits in prose and takes the accent, underlined.</p></div>
      <div class="demo"><span class="label">Focus</span>
        <input class="field focused" value="focused input" readonly></div>
      <div class="demo"><span class="label">Selection</span>
        <p style="margin:0">Selected text takes <mark>the accent as a wash</mark>, never a fill.</p></div>
      <div class="demo"><span class="label">Filled control</span>
        <button class="btn">Save entry</button></div>
    </div>
    <hr class="rule">
    <div class="never">
      <p class="label" style="color:var(--crit)">Never</p>
      <p style="margin:0; font-size: var(--step--1); color: var(--muted)">Introducing a second interactive colour. Semantic colour is held separate for exactly this reason — and it is why <code class="mono">--ok</code> in this theme is deliberately a <em>different</em> green from <code class="mono">--accent</code>, so "green means success" can never collide with "green means interactive".</p>
      <div class="swatchline">
        <span class="dot" style="background:var(--accent)"></span>
        <span class="mono" style="font-size:var(--step--1); color:var(--muted)">${hex(L.accent)} interactive</span>
        <span class="dot" style="background:var(--ok); margin-left:var(--space-4)"></span>
        <span class="mono" style="font-size:var(--step--1); color:var(--muted)">${hex(L.semantic.ok)} success</span>
      </div>
    </div>
  `,
}));

cards.push(card({
  path: 'colour/semantic.html',
  group: 'Colour',
  name: 'Semantic colour',
  subtitle: 'ok / warn / crit — not the accent',
  css: `
    .chips { display: flex; gap: var(--space-4); flex-wrap: wrap; margin: var(--space-6) 0; }
    .chip2 { border: 1px solid var(--hairline); padding: var(--space-4) var(--space-5); min-width: 200px; }
    .bar { height: 6px; margin-bottom: var(--space-4); }
    .nm { font-family: var(--font-mono); font-size: var(--step--1); }
    .rr { font-family: var(--font-mono); font-size: var(--step--2); font-variant-numeric: tabular-nums; color: var(--muted-2); }
    .live { display: inline-flex; align-items: center; gap: var(--space-2); }
    .pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--ok); animation: p 2s ease-in-out infinite; }
    @keyframes p { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
    @media (prefers-reduced-motion: reduce) { .pulse { animation: none } }
  `,
  body: `
    <p class="eyebrow">Field Notes Light</p>
    <h1>Semantic colour</h1>
    <p class="lede">Held separate from the accent thread on purpose. These say what a thing <em>is</em>; the accent says what you can <em>do</em>.</p>
    <div class="chips">
      ${[['--ok', L.semantic.ok, 'success'], ['--warn', L.semantic.warn, 'warning'], ['--crit', L.semantic.crit, 'critical']]
        .map(([tok, t, role]) => `
        <div class="chip2">
          <div class="bar" style="background: var(${tok})"></div>
          <div class="nm">${tok}</div>
          <div class="rr">${hex(t)} · ${ratio(t)} ${t.grade}</div>
          <div class="rr" style="color:var(--muted)">${role}</div>
        </div>`).join('')}
    </div>
    <div class="note"><strong><code class="mono">--ok</code> is ${hex(L.semantic.ok)}; <code class="mono">--accent</code> is ${hex(L.accent)}.</strong>
      Two different greens, deliberately. Collapsing them to one value is the single change that would break this theme's logic.</div>
    <hr class="rule">
    <p class="label">Status motion</p>
    <p style="font-size: var(--step--1); color: var(--muted)">
      <span class="live"><span class="pulse"></span> <span class="mono" style="font-size:var(--step--2); letter-spacing:var(--track-label); text-transform:uppercase">live</span></span>
      — the page's one always-moving element wears <code class="mono">--ok</code>, never <code class="mono">--accent</code>. "Live" is a status, not a control. Respects <code class="mono">prefers-reduced-motion</code>.</p>
  `,
}));

/* -------------------------------------------------------------------- TYPE */

const steps = [
  ['--step-4',  T.spine.typeScale.px['4'],  'display'],
  ['--step-3',  T.spine.typeScale.px['3'],  'page heading'],
  ['--step-2',  T.spine.typeScale.px['2'],  'section heading'],
  ['--step-1',  T.spine.typeScale.px['1'],  'lead paragraph'],
  ['--step-0',  T.spine.typeScale.px['0'],  'body'],
  ['--step--1', T.spine.typeScale.px['-1'], 'meta, captions, table data'],
  ['--step--2', T.spine.typeScale.px['-2'], 'eyebrows, strip keys'],
];

cards.push(card({
  path: 'type/scale.html',
  group: 'Type',
  name: 'Scale',
  subtitle: `1.185 ratio · ${T.spine.typeScale.px['-2']}–${T.spine.typeScale.px['4']}px`,
  css: `
    .row { display: grid; grid-template-columns: 13ch 7ch 1fr; gap: var(--space-5); align-items: baseline;
           padding: var(--space-4) 0; border-top: 1px solid var(--hairline-soft); }
    .row:last-child { border-bottom: 1px solid var(--hairline-soft); }
    .k { font-family: var(--font-mono); font-size: var(--step--1); color: var(--muted-2); }
    .px { font-family: var(--font-mono); font-size: var(--step--1); font-variant-numeric: tabular-nums; color: var(--muted); }
    .spec { font-family: var(--font-display); letter-spacing: var(--track-display); line-height: var(--leading-tight); font-weight: 500; }
    .role { font-size: var(--step--1); color: var(--muted-2); font-family: var(--font-body); letter-spacing: 0; }
  `,
  body: `
    <p class="eyebrow">Spine — identical in both themes</p>
    <h1>Type scale</h1>
    <p class="lede">A ${T.spine.typeScale.ratio} ratio, tuned so mono at <code class="mono">--step--1</code> optically matches body at <code class="mono">--step-0</code> — JetBrains Mono runs large for its point size.</p>
    ${steps.map(([tok, px, role]) => `
      <div class="row">
        <span class="k">${tok}</span>
        <span class="px">${px}px</span>
        <span><span class="spec" style="font-size: var(${tok})">Field Notes</span> <span class="role">${role}</span></span>
      </div>`).join('')}
    <div class="note"><strong>Space Grotesk ships no italic.</strong> Never set <code class="mono">font-style: italic</code> on display type — the renderer fakes an oblique and it reads as a bug. Emphasise with weight, size, or the accent.</div>
    <p class="label" style="margin-top:var(--space-6)">Tracking</p>
    <p class="mono" style="font-size: var(--step--1); color: var(--muted)">eyebrow ${T.spine.tracking.eyebrow} · label ${T.spine.tracking.label} · display ${T.spine.tracking.display} · measure ${T.spine.measure}</p>
  `,
}));

cards.push(card({
  path: 'type/factual-mono.html',
  group: 'Type',
  name: 'Everything factual is mono',
  subtitle: 'tabular-nums wherever digits stack',
  css: `
    table { border-collapse: collapse; width: 100%; max-width: 720px; }
    th, td { text-align: left; padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--hairline-soft); }
    th { font-family: var(--font-mono); font-size: var(--step--2); text-transform: uppercase;
         letter-spacing: var(--track-label); color: var(--muted-2); font-weight: 400; border-bottom-color: var(--hairline); }
    td.f { font-family: var(--font-mono); font-size: var(--step--1); font-variant-numeric: tabular-nums; }
    td.p { font-size: var(--step--1); color: var(--muted); }
    .r { text-align: right; }
  `,
  body: `
    <p class="eyebrow">The system's core move</p>
    <h1>Everything factual is monospaced</h1>
    <p class="lede">Times, dates, counts, money, status, IDs — set in mono with <code class="mono">tabular-nums</code> wherever digits stack. Ported from Wayfare, and the reason columns of figures align without a table doing the work.</p>
    <table>
      <thead><tr><th>Entry</th><th>Date</th><th class="r">Count</th><th class="r">Amount</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td class="p">Kyoto, day three</td><td class="f">2026-04-11</td><td class="f r">14</td><td class="f r">$1,284.00</td><td class="f" style="color:var(--ok)">settled</td></tr>
        <tr><td class="p">Osaka transfer</td><td class="f">2026-04-14</td><td class="f r">3</td><td class="f r">$96.50</td><td class="f" style="color:var(--warn)">pending</td></tr>
        <tr><td class="p">Return leg</td><td class="f">2026-04-22</td><td class="f r">128</td><td class="f r">$2,011.75</td><td class="f" style="color:var(--muted-2)">draft</td></tr>
      </tbody>
    </table>
    <div class="note">Amounts right-align and the digits stack because every figure is mono and tabular. Prose stays in the body face — the distinction is <em>factual vs. read</em>, not <em>table vs. paragraph</em>.</div>
  `,
}));

/* ------------------------------------------------------------------- SPINE */

cards.push(card({
  path: 'spine/spacing.html',
  group: 'Spine',
  name: 'Spacing',
  subtitle: '4px base · 4–64',
  css: `
    .row { display: grid; grid-template-columns: 12ch 7ch 1fr; gap: var(--space-5); align-items: center; padding: var(--space-2) 0; }
    .k { font-family: var(--font-mono); font-size: var(--step--1); color: var(--muted-2); }
    .px { font-family: var(--font-mono); font-size: var(--step--1); font-variant-numeric: tabular-nums; color: var(--muted); }
    .bar { height: 14px; background: var(--accent); }
    .rr { display: flex; gap: var(--space-5); flex-wrap: wrap; margin-top: var(--space-4); }
    .rbox { width: 84px; height: 84px; border: 1px solid var(--accent); background: var(--wash); display: flex; align-items: flex-end; justify-content: center; padding: var(--space-2); }
    .rbox span { font-family: var(--font-mono); font-size: var(--step--2); color: var(--muted-2); }
  `,
  body: `
    <p class="eyebrow">Spine — identical in both themes</p>
    <h1>Spacing &amp; radius</h1>
    <p class="lede">A 4px base. Spacing and rhythm do <strong>not</strong> shift between themes — a system whose measurements change per theme is two systems wearing one name.</p>
    ${Object.entries(T.spine.spacePx).map(([k, px]) => `
      <div class="row">
        <span class="k">--space-${k}</span>
        <span class="px">${px}px</span>
        <span><span class="bar" style="width: ${px}px; display:block"></span></span>
      </div>`).join('')}
    <h2>Radius</h2>
    <div class="rr">
      ${[['lg', T.spine.radius.lg], ['md', T.spine.radius.md], ['sm', T.spine.radius.sm], ['flat', T.spine.radius.flat]]
        .map(([k, v]) => `<div class="rbox" style="border-radius:${v}px"><span>--radius-${k} · ${v}px</span></div>`).join('')}
    </div>
    <div class="note"><strong>Field Notes Light is square.</strong> <code class="mono">--radius-card</code> resolves to <code class="mono">--radius-flat</code> here and to <code class="mono">--radius-sm</code> (12px) in Wayfare Dark. This is the one structural value the two themes genuinely disagree on, and both are right in place. Style against <code class="mono">--radius-card</code>, never a literal.</div>
  `,
}));

cards.push(card({
  path: 'spine/elevation.html',
  group: 'Spine',
  name: 'Elevation',
  subtitle: 'scoped, not ambient — index cards only',
  css: `
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--space-5); margin: var(--space-6) 0; }
    .c { background: var(--surface-raised); border-radius: var(--radius-card); box-shadow: var(--shadow-1); padding: var(--space-5); }
    .c.hov { box-shadow: var(--shadow-2); }
    .c.hov .t { color: var(--accent); }
    .t { font-family: var(--font-display); font-size: var(--step-1); font-weight: 500; letter-spacing: var(--track-display); margin: 0 0 var(--space-2); }
    .m { font-family: var(--font-mono); font-size: var(--step--2); text-transform: uppercase; letter-spacing: var(--track-label); color: var(--muted-2); }
    .d { font-size: var(--step--1); color: var(--muted); margin: var(--space-3) 0 0; }
    .flat { border-top: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline); padding: var(--space-5) 0; margin: var(--space-6) 0; }
    .state { font-family: var(--font-mono); font-size: var(--step--2); color: var(--muted-2); text-transform: uppercase; letter-spacing: var(--track-label); margin-bottom: var(--space-3); }
  `,
  body: `
    <p class="eyebrow">Locked 2026-08-15 — home mock stress test</p>
    <h1>Elevation is scoped, not ambient</h1>
    <p class="lede">Index and link cards float. Everything else stays flat hairlines-on-ground. <strong>If everything floats, nothing does.</strong></p>
    <div class="cards">
      <div><p class="state">resting · shadow-1</p>
        <div class="c"><p class="m">2026-04-11</p><p class="t">Notes on a warm ground</p><p class="d">White card on the warm surface, square corners, ink-tinted shadow.</p></div></div>
      <div><p class="state">hover · shadow-2 + title accent</p>
        <div class="c hov"><p class="m">2026-04-14</p><p class="t">Notes on a warm ground</p><p class="d">The lift and the interactive cue arrive together — the title turns accent.</p></div></div>
    </div>
    <p class="state">flat — live strip and article pages</p>
    <div class="flat">
      <p class="m">Currently</p>
      <p style="margin:var(--space-2) 0 0; font-size: var(--step--1); color: var(--muted)">Hairlines on the ground, no shadow, no raised surface. This is the default; floating is the exception.</p>
    </div>
    <div class="note"><strong>Shadows are ink-tinted, never neutral grey</strong>, so they read warm on the warm ground. The ground never goes grey — the offset comes from the white cards. Wayfare Dark's shadow tokens are <code class="mono">none</code>; a dark theme lifts with lighter surfaces.</div>
  `,
}));

/* -------------------------------------------------------------- COMPONENTS */

cards.push(card({
  path: 'components/controls.html',
  group: 'Components',
  name: 'Controls',
  subtitle: 'buttons, fields, focus, selection',
  css: `
    .g { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: var(--space-6); margin: var(--space-6) 0; }
    .stack { display: flex; flex-direction: column; gap: var(--space-3); align-items: flex-start; }
    .btn { font-family: var(--font-body); font-size: var(--step--1); font-weight: 500; cursor: pointer;
           border-radius: var(--radius-card); padding: var(--space-3) var(--space-5); }
    .btn.primary { background: var(--accent); color: var(--on-accent); border: 1px solid var(--accent); }
    .btn.primary:hover { background: var(--accent-light); border-color: var(--accent-light); }
    .btn.ghost { background: transparent; color: var(--accent); border: 1px solid var(--hairline); }
    .btn.ghost:hover { background: var(--wash); border-color: var(--accent); }
    .btn.quiet { background: transparent; color: var(--muted); border: 1px solid transparent; }
    .btn.quiet:hover { color: var(--ink); background: var(--surface-sunk); }
    .btn:disabled { opacity: .45; cursor: not-allowed; }
    .field { font-family: var(--font-body); font-size: var(--step--1); padding: var(--space-3);
             width: 100%; background: var(--surface); border: 1px solid var(--hairline);
             border-radius: var(--radius-card); color: var(--ink); }
    .field::placeholder { color: var(--muted-2); }
    .field:focus, .field.focused { outline: 2px solid var(--accent); outline-offset: 2px; border-color: var(--accent); }
    mark { background: var(--wash-strong); color: var(--ink); }
  `,
  body: `
    <p class="eyebrow">Field Notes Light</p>
    <h1>Controls</h1>
    <p class="lede">Square corners, hairline borders made of accent, and the accent doing every piece of interactive work.</p>
    <div class="g">
      <div><p class="label">Buttons</p><div class="stack" style="margin-top:var(--space-3)">
        <button class="btn primary">Primary</button>
        <button class="btn ghost">Ghost</button>
        <button class="btn quiet">Quiet</button>
        <button class="btn primary" disabled>Disabled</button>
      </div></div>
      <div><p class="label">Fields</p><div class="stack" style="margin-top:var(--space-3); width:100%">
        <input class="field" placeholder="Rest state">
        <input class="field focused" value="Focused — 2px accent, offset 2" readonly>
      </div></div>
      <div><p class="label">Text states</p><div class="stack" style="margin-top:var(--space-3)">
        <p style="margin:0; font-size:var(--step--1)"><a href="#">Inline link</a> in prose</p>
        <p style="margin:0; font-size:var(--step--1)"><mark>Selected run of text</mark></p>
        <p style="margin:0; font-size:var(--step--1); color:var(--muted)">Secondary prose at --muted</p>
        <p style="margin:0" class="label">Uppercase label at --muted-2</p>
      </div></div>
    </div>
    <div class="note"><code class="mono">--wash-strong</code> (24%) must stay clearly above <code class="mono">--hairline</code> (20%), or a selected run of text reads as a boxed-in border rather than a highlight.</div>
  `,
}));

/* ------------------------------------------------------------------- RULES */

cards.push(card({
  path: 'rules/load-bearing.html',
  group: 'Rules',
  name: 'Load-bearing values',
  subtitle: 'the constraints that are not cosmetic',
  css: `
    .item { border-top: 1px solid var(--hairline); padding: var(--space-5) 0; max-width: var(--measure); }
    .item:last-child { border-bottom: 1px solid var(--hairline); }
    .h { font-family: var(--font-display); font-size: var(--step-1); font-weight: 500; letter-spacing: var(--track-display); margin: 0 0 var(--space-2); }
    .b { margin: 0; font-size: var(--step--1); color: var(--muted); }
    .warn { color: var(--warn); font-family: var(--font-mono); font-size: var(--step--2); text-transform: uppercase; letter-spacing: var(--track-label); }
    .arrows { display: flex; gap: var(--space-6); margin-top: var(--space-4); flex-wrap: wrap; }
    .arrow { font-family: var(--font-mono); font-size: var(--step--1); font-variant-numeric: tabular-nums; }
  `,
  body: `
    <p class="eyebrow">Do not treat these as preferences</p>
    <h1>Load-bearing values</h1>
    <p class="lede">Each of these was a bug once. They are recorded so the fix cannot be reverted by someone tidying up.</p>

    <div class="item">
      <p class="warn">The direction trap</p>
      <p class="h"><code class="mono">--muted-2</code> is a corrected value in both themes</p>
      <p class="b">Field Notes' ${hex(L.muted2)} replaced a #8A8177 measuring 3.58:1 — a fail for the 11px uppercase labels it colours. The two corrections ran in <strong>opposite directions</strong>: dark ground lightened, light ground darkened. A single-direction rule stated for both themes will be wrong for one of them.</p>
      <div class="arrows">
        <span class="arrow" style="color:var(--crit)">Field Notes Light &nbsp;3.58 → ${L.muted2.onSurface}&nbsp; (darkened)</span>
        <span class="arrow" style="color:var(--crit)">Wayfare Dark &nbsp;4.39 → ${T.themes.wayfareDark.muted2.onSurface}&nbsp; (lightened)</span>
      </div>
    </div>

    <div class="item">
      <p class="h">Hairlines are the accent at low alpha, never a grey</p>
      <p class="b">Wayfare's 16% is transcribed from <code class="mono">Theme.swift</code>'s <code class="mono">--panel-line</code> and is not a free choice. This is most of why both surfaces read warm and deliberate.</p>
    </div>

    <div class="item">
      <p class="h"><code class="mono">${hex(L.accent)}</code> was chosen because it clears AAA in both directions</p>
      <p class="b">${ratio(L.accent)} as text on the ground, ${ratio(L.onAccent)} as ground under white. That is what removes the need for a second "accessible variant" of the green.</p>
    </div>

    <div class="item">
      <p class="warn">Silent substitution</p>
      <p class="h">Space Grotesk has no italic, and Office splits its weights</p>
      <p class="b">Never set <code class="mono">font-style: italic</code> on display type. In Word and PowerPoint the Medium/SemiBold/Light weights are <em>separate families</em> — <code class="mono">Space Grotesk SemiBold</code>, not <code class="mono">Space Grotesk</code> + bold. Naming the wrong family substitutes Calibri silently.</p>
    </div>

    <div class="item">
      <p class="h">The extension rule</p>
      <p class="b">Any colour this system later needs is <em>derived</em>, never picked: apply the system's own <code class="mono">--accent → --accent-light</code> relationship — <code class="mono">L +0.094, C −0.014</code>, hue held — to the source colour's documented <code class="mono">oklch()</code>. Note it reduces chroma as it lightens; that is what keeps derived colours from going neon.</p>
    </div>

    <div class="item">
      <p class="h">Field Notes Light is also the Office theme</p>
      <p class="b">Every document uses this binding. A ${T.themes.wayfareDark.surface.value} ground is unusable in print, so Wayfare Dark never travels into a document.</p>
    </div>
  `,
}));

/* ------------------------------------------------------------------ README */

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'README.md'), `# Field Notes Light — Claude Design bundle

Generated by \`design/ds-bundle/build.mjs\` from \`design/tokens.css\` and \`design/tokens.json\`.
**Do not edit these files.** Change the tokens, re-run the generator, re-push.

\`tokens.css\` is upstream of this bundle, of \`site/src/styles/tokens.css\`, and of the
terminal dotfiles. This bundle is a render, never a source.

Cards: ${cards.length}
`);

writeFileSync(join(OUT, 'cards.json'), JSON.stringify(cards, null, 2) + '\n');
console.log(`${cards.length} cards -> ${OUT}`);
for (const c of cards) console.log(`  ${c.group.padEnd(12)} ${c.path}`);
