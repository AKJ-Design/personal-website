/**
 * Generates the CSS-only Bangkok chat replay for the Wayfare Part 1 post.
 * One-shot tool, not part of the build: run `node scripts/generate-replay.mjs`
 * and copy replay.css over src/styles/replay.css and replay-markup.html into
 * the post markdown.
 *
 * Ported from a Claude Design composition (block data, authored times and
 * deterministic layout are the design's own; the design export lives in the
 * private plans folder because its source screenshots predate a redaction).
 * Dark ground, site fonts, hotel-proximity lines reworded per Alex
 * 2026-08-30.
 *
 * One master 28.5s timeline; every element animates via percentage keyframes
 * on that duration so the loop stays synchronized. Base styles are the FINAL
 * state, so prefers-reduced-motion (animations off) shows the finished
 * conversation.
 */
import { writeFileSync } from 'node:fs';

const TOTAL = 28.5; // scene durations sum: 6.5+3.5+3.5+11+4
const W = 1920;
const COL_X = 360, COL_W = 1210;
const CONTENT_TOP = 330, ANCHOR_Y = 790;
const FS = 36, LH = Math.round(FS * 1.55); // 56

const C = {
  surface: '#0B0A0D', sunk: '#16151A', ink: '#F3ECE1', muted2: '#8F8676',
  accent: '#C9A15F', hair: 'rgba(201,161,95,0.16)',
};
const CAT = { night: '#A272D4', food: '#E28D4F', explore: '#5DAD70' };

const b = (t) => ({ b: t });
const chip = (t) => ({ chip: t });

const BLOCKS = [
  { k: 'para', stream: true, at: 0.4, dur: 3.5, mt: 0, lines: [
    ["Perfect — that's a really solid Bangkok week. Train hard,"],
    ['eat well, one big Muay Thai night, a couple of clubs, and'],
    ['some exploring mixed in. Very doable.'],
  ] },
  { k: 'para', stream: true, at: 4.3, dur: 1.5, mt: 40, lines: [
    ['Let me pull together the best options for each piece.'],
  ] },
  { k: 'pill', at: 6.7, mt: 46, text: 'Searched the web' },
  { k: 'para', stream: true, at: 10.1, dur: 1.9, mt: 46, lines: [
    ["Great — here's a proper Bangkok week framework built"],
    ['around your priorities.'],
  ] },
  { k: 'rule', at: 12.2, mt: 58 },
  { k: 'title', at: 12.6, mt: 52, text: 'Your Bangkok Week — July 2026' },
  { k: 'h', at: 13.6, mt: 54, text: 'Muay Thai Night', dot: CAT.night },
  { k: 'para', at: 14.0, mt: 18, lines: [
    [b('Rajadamnern Stadium'), ' is your pick.'],
  ] },
  { k: 'h', at: 15.4, mt: 62, text: 'Street Food & Night Markets', dot: CAT.food },
  { k: 'para', at: 15.9, mt: 18, lines: [
    [b('SW1 Market'), ' — right at the entrance of Sukhumvit Soi 12,'],
    ['with over 120 stalls of authentic Thai street food,'],
    ['vintage fashion, and local drinks. Your go-to for a'],
    ['casual evening.', chip('Gurulist')],
  ] },
  { k: 'para', at: 17.3, mt: 34, lines: [
    [b('Jodd Fairs Ratchada'), ' — the big one. One MRT stop away,'],
    ['massive, packed with locals, and widely considered the'],
    ['best street food night market in Bangkok right now. Go'],
    ['hungry.'],
  ] },
  { k: 'para', at: 18.6, mt: 34, lines: [
    [b('Yaowarat (Chinatown)'), ' — for a proper evening. One of the'],
    ["world's great street food strips. Grab the MRT to Hua"],
    ['Lamphong, and eat everything.'],
  ] },
  { k: 'h', at: 19.9, mt: 62, text: 'Exploring (lighter days / mornings)', dot: CAT.explore },
  { k: 'para', at: 20.4, mt: 18, lines: [
    ["Since you've done some temples already — a few things"],
    ['worth considering:'],
  ] },
  { k: 'bullet', at: 21.2, mt: 26, lines: [
    [b('Chatuchak Weekend Market'), ' (if your dates include a'],
    ['Sat/Sun) — enormous, fun, great for a browse and cheap'],
    ['Thai food'],
  ] },
  { k: 'bullet', at: 22.4, mt: 20, lines: [
    [b('Lumpini Park'), ' morning walk — popular with locals, a good'],
    ['wind-down from a training session'],
  ] },
  { k: 'rule', at: 24.6, mt: 64 },
  { k: 'para', stream: true, at: 24.9, dur: 2.6, mt: 60, lines: [
    ['Want me to pull this into an actual day-by-day itinerary'],
    ['for the week of 23 July? I can map it around gym sessions,'],
    ['the Muay Thai fight schedule, and club nights.'],
  ] },
];

// px → cqw against the 1920 design width
const u = (px) => `${+(px * 100 / W).toFixed(4)}cqw`;
const pct = (t) => +(t / TOTAL * 100).toFixed(3);
const runChars = (r) => (typeof r === 'string' ? r.length : r.b ? r.b.length : 0);
const blockChars = (blk) => (blk.lines || []).reduce((n, ln) => n + ln.reduce((m, r) => m + runChars(r), 0), 0);

// deterministic layout (design px)
let y = 0;
const tops = BLOCKS.map((blk) => {
  y += blk.mt;
  const top = y;
  const h = blk.k === 'pill' ? 76 : blk.k === 'rule' ? 2 : blk.k === 'title' ? 84
    : blk.k === 'h' ? 64 : blk.lines.length * LH;
  y += h;
  return { top, h };
});

// scroll anchors, as in the design
const anchors = [{ t: 0, s: 0 }];
BLOCKS.forEach((blk, i) => {
  const t = blk.at + (blk.stream ? blk.dur * 0.7 : 0.5);
  const s = Math.max(0, CONTENT_TOP + tops[i].top + tops[i].h - ANCHOR_Y);
  const prev = anchors[anchors.length - 1];
  if (s > prev.s + 1) anchors.push({ t, s });
});
const FINAL_S = anchors[anchors.length - 1].s;

const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';   // easeInOutCubic
const OUT = 'cubic-bezier(0.215, 0.61, 0.355, 1)'; // easeOutCubic-ish

const css = [];
const html = [];

/* ---------------------------------------------------------------- shell css */
css.push(`
/* =============================================================================
   Bangkok chat replay — generated by scripts source in the private plans
   folder from the Claude Design composition (design/Animating Claude chat
   screenshots/). CSS only: one 28.5s master timeline, every element keyed as
   percentages of it so the loop stays in sync. Base styles are the FINAL
   state — prefers-reduced-motion turns animations off and gets the finished
   conversation as a static figure.
   ========================================================================= */
figure.replay { margin: var(--space-5) 0 var(--space-6); container-type: inline-size; }
figure.replay figcaption {
  font-family: var(--font-mono); font-size: var(--step--2);
  letter-spacing: var(--track-label); text-transform: uppercase;
  color: var(--muted-2); text-align: center; margin-top: var(--space-2);
}
.rp {
  position: relative; aspect-ratio: 16 / 9; overflow: hidden;
  background: ${C.surface}; border: 1px solid var(--hairline);
}
.rp, .rp * { box-sizing: border-box; }
.rp-cam { position: absolute; inset: 0; transform-origin: 50% 45%; animation: rp-cam ${TOTAL}s linear infinite; }
.rp-col {
  position: absolute; left: ${u(COL_X)}; top: ${u(CONTENT_TOP)}; width: ${u(COL_W)};
  transform: translateY(-${u(FINAL_S)});
  animation: rp-scroll ${TOTAL}s linear infinite, rp-fade ${TOTAL}s linear infinite;
}
.rp-blk { position: absolute; left: 0; width: 100%; }
.rp-line {
  position: relative; white-space: nowrap;
  height: ${u(LH)}; line-height: ${u(LH)};
  font-family: var(--font-body); font-size: ${u(FS)}; color: ${C.ink};
}
.rp-line strong { font-weight: 600; color: ${C.ink}; }
.rp-chip {
  font-family: var(--font-mono); font-size: ${u(22)}; letter-spacing: 0.04em;
  color: ${C.muted2}; border: 1px solid ${C.hair}; border-radius: ${u(999)};
  padding: ${u(4)} ${u(12)}; margin-left: ${u(12)}; vertical-align: middle;
  background: ${C.sunk};
}
.rp-hdr {
  position: absolute; left: ${u(COL_X)}; top: ${u(132)};
  display: flex; align-items: center; gap: ${u(18)};
  font-family: var(--font-mono); font-size: ${u(24)}; letter-spacing: 0.16em;
  text-transform: uppercase; color: ${C.muted2};
  animation: rp-fade ${TOTAL}s linear infinite;
}
.rp-hdr-rule { height: 1px; width: ${u(210)}; background: ${C.hair}; animation: rp-hdr-rule ${TOTAL}s linear infinite; }
.rp-thread {
  position: absolute; right: ${u(COL_X)}; top: ${u(132)};
  font-family: var(--font-body); font-size: ${u(22)}; letter-spacing: 0.02em;
  color: ${C.muted2}; animation: rp-fade ${TOTAL}s linear infinite;
}
.rp-fade-top { position: absolute; left: 0; right: 0; top: 0; height: ${u(370)}; background: linear-gradient(${C.surface} 0%, ${C.surface} 58%, transparent 100%); }
.rp-fade-bot { position: absolute; left: 0; right: 0; bottom: 0; height: ${u(300)}; background: linear-gradient(transparent, ${C.surface} 58%); }
@keyframes rp-fade { 0% { opacity: 0; } ${pct(0.5)}% { opacity: 1; } ${pct(TOTAL - 0.7)}% { opacity: 1; } 100% { opacity: 0; } }
@keyframes rp-hdr-rule { 0%, ${pct(0.2)}% { transform: scaleX(0); } ${pct(1.4)}% { transform: scaleX(1); } 100% { transform: scaleX(1); } }
.rp-hdr-rule { transform-origin: left; }
@keyframes rp-cam {
  0%, ${pct(6.6)}% { transform: scale(1); animation-timing-function: ${EASE}; }
  ${pct(7.6)}%, ${pct(11.4)}% { transform: scale(1.05); animation-timing-function: ${EASE}; }
  ${pct(12.6)}%, 100% { transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .rp, .rp * { animation: none !important; }
  .rp-cur, .rp-shimmer { display: none !important; }
}
`);

/* scroll keyframes — hold, then glide between anchors with in-out easing */
const scrollKf = [`0% { transform: translateY(0); animation-timing-function: ${EASE}; }`];
for (let i = 1; i < anchors.length; i++) {
  const a = anchors[i];
  scrollKf.push(`${pct(a.t)}% { transform: translateY(-${u(a.s)}); animation-timing-function: ${EASE}; }`);
}
scrollKf.push(`100% { transform: translateY(-${u(FINAL_S)}); }`);
css.push(`@keyframes rp-scroll {\n  ${scrollKf.join('\n  ')}\n}`);

/* enter animation factory: hidden until t0, rises in by t1; base = shown */
let kfId = 0;
function enter(sel, t0, rise) {
  const name = `rp-e${kfId++}`;
  css.push(`@keyframes ${name} {
  0%, ${pct(t0)}% { opacity: 0; transform: translateY(${u(rise)}); animation-timing-function: ${OUT}; }
  ${pct(t0 + 0.6)}%, 100% { opacity: 1; transform: translateY(0); }
}`);
  css.push(`${sel} { animation: ${name} ${TOTAL}s linear infinite; }`);
}
function wipe(sel, t0, t1) {
  const name = `rp-w${kfId++}`;
  css.push(`@keyframes ${name} {
  0%, ${pct(t0)}% { clip-path: inset(0 100% 0 0); animation-timing-function: linear; }
  ${pct(t1)}%, 100% { clip-path: inset(0 -5% 0 0); }
}`);
  css.push(`${sel} { animation: ${name} ${TOTAL}s linear infinite; }`);
}
function windowed(sel, t0, t1) {
  const name = `rp-v${kfId++}`;
  css.push(`@keyframes ${name} {
  0%, ${pct(t0)}% { opacity: 0; }
  ${pct(t0 + 0.05)}%, ${pct(t1)}% { opacity: 1; }
  ${pct(t1 + 0.05)}%, 100% { opacity: 0; }
}`);
  css.push(`${sel} { animation: ${name} ${TOTAL}s linear infinite; }`);
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const renderRuns = (runs) => runs.map((r) =>
  typeof r === 'string' ? esc(r)
  : r.b ? `<strong>${esc(r.b)}</strong>`
  : `<span class="rp-chip">${esc(r.chip)}</span>`).join('');

/* ------------------------------------------------------------------ blocks */
html.push(`<figure class="replay">`);
html.push(`<div class="rp">`);
html.push(`<div class="rp-cam">`);
html.push(`<div class="rp-col">`);

BLOCKS.forEach((blk, i) => {
  const id = `b${i}`;
  const top = `top: ${u(tops[i].top)};`;

  if (blk.k === 'rule') {
    css.push(`.rp-${id} { ${top} height: 1px; background: ${C.hair}; transform-origin: left; }`);
    const name = `rp-r${kfId++}`;
    css.push(`@keyframes ${name} { 0%, ${pct(blk.at)}% { transform: scaleX(0); animation-timing-function: ${EASE}; } ${pct(blk.at + 0.8)}%, 100% { transform: scaleX(1); } }`);
    css.push(`.rp-${id} { animation: ${name} ${TOTAL}s linear infinite; }`);
    html.push(`<div class="rp-blk rp-${id}"></div>`);
    return;
  }

  if (blk.k === 'pill') {
    css.push(`.rp-${id} { ${top} height: ${u(76)}; }
.rp-${id} .rp-pill {
  display: inline-flex; align-items: center; gap: ${u(16)}; position: relative;
  overflow: hidden; background: ${C.sunk}; border: 1px solid ${C.hair};
  border-radius: ${u(12)}; padding: ${u(14)} ${u(26)};
  font-family: var(--font-mono); font-size: ${u(26)}; letter-spacing: 0.06em; color: ${C.accent};
}
.rp-${id} .rp-dot { width: ${u(12)}; height: ${u(12)}; border-radius: 50%; background: ${C.accent}; }
.rp-${id} .rp-shimmer {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(100deg, transparent 20%, ${C.accent}2E 50%, transparent 80%);
}`);
    enter(`.rp-${id}`, blk.at, 14);
    // dot pulses while "searching" (6.7 → 9.4), then holds solid
    const busyEnd = blk.at + 2.7;
    const pulse = [`0%, ${pct(blk.at)}% { opacity: 1; }`];
    for (let t = blk.at + 0.35; t < busyEnd - 0.2; t += 0.7) {
      pulse.push(`${pct(t)}% { opacity: 0.45; }`);
      pulse.push(`${pct(Math.min(t + 0.35, busyEnd))}% { opacity: 1; }`);
    }
    pulse.push(`${pct(busyEnd)}%, 100% { opacity: 1; }`);
    const dotName = `rp-d${kfId++}`;
    css.push(`@keyframes ${dotName} {\n  ${pulse.join('\n  ')}\n}`);
    css.push(`.rp-${id} .rp-dot { animation: ${dotName} ${TOTAL}s linear infinite; }`);
    const shName = `rp-s${kfId++}`;
    css.push(`@keyframes ${shName} {
  0%, ${pct(blk.at + 0.25)}% { transform: translateX(-100%); opacity: 0; }
  ${pct(blk.at + 0.35)}% { opacity: 1; animation-timing-function: linear; }
  ${pct(busyEnd - 0.1)}% { transform: translateX(120%); opacity: 1; }
  ${pct(busyEnd)}%, 100% { transform: translateX(120%); opacity: 0; }
}`);
    css.push(`.rp-${id} .rp-shimmer { animation: ${shName} ${TOTAL}s linear infinite; }`);
    html.push(`<div class="rp-blk rp-${id}"><span class="rp-pill"><span class="rp-dot"></span>${esc(blk.text)}<span class="rp-shimmer"></span></span></div>`);
    return;
  }

  if (blk.k === 'title' || blk.k === 'h') {
    const isTitle = blk.k === 'title';
    css.push(`.rp-${id} {
  ${top} height: ${u(isTitle ? 84 : 64)}; display: flex; align-items: center; gap: ${u(20)};
  font-family: var(--font-display); font-size: ${u(isTitle ? FS + 18 : FS + 4)};
  font-weight: ${isTitle ? 500 : 600}; letter-spacing: -0.018em; color: ${C.ink}; white-space: nowrap;
}`);
    enter(`.rp-${id}`, blk.at, 22);
    if (!isTitle) {
      css.push(`.rp-${id} .rp-hdot { width: ${u(14)}; height: ${u(14)}; background: ${blk.dot}; flex: 0 0 auto; }`);
      const dn = `rp-hd${kfId++}`;
      css.push(`@keyframes ${dn} { 0%, ${pct(blk.at + 0.1)}% { transform: scale(0.2); animation-timing-function: ${OUT}; } ${pct(blk.at + 0.6)}%, 100% { transform: scale(1); } }`);
      css.push(`.rp-${id} .rp-hdot { animation: ${dn} ${TOTAL}s linear infinite; }`);
    }
    html.push(`<div class="rp-blk rp-${id}">${isTitle ? '' : '<span class="rp-hdot"></span>'}${esc(blk.text)}</div>`);
    return;
  }

  // paragraphs + bullets
  css.push(`.rp-${id} { ${top} }`);
  if (blk.k === 'bullet') {
    css.push(`.rp-${id} .rp-line { padding-left: ${u(52)}; }
.rp-${id} .rp-bdot { position: absolute; left: ${u(16)}; top: calc(${u(LH)} / 2 - ${u(4)}); width: ${u(8)}; height: ${u(8)}; border-radius: 50%; background: ${C.accent}; opacity: 0.8; }`);
  }
  const total = blockChars(blk);
  let used = 0;
  const lineHtml = blk.lines.map((ln, j) => {
    const lineChars = ln.reduce((m, r) => m + runChars(r), 0);
    const sel = `.rp-${id} .rp-l${j}`;
    let lineEnd;
    if (blk.stream) {
      const t0 = blk.at + blk.dur * (used / total);
      lineEnd = blk.at + blk.dur * ((used + lineChars) / total);
      wipe(sel, t0, lineEnd);
      used += lineChars;
    } else {
      enter(sel, blk.at + j * 0.1, 18);
    }
    const isLastStream = blk.stream && j === blk.lines.length - 1;
    let cursor = '';
    if (isLastStream) {
      css.push(`.rp-${id} .rp-cur {
  display: inline-block; width: ${u(3)}; height: ${u(FS * 0.92)}; background: ${C.accent};
  margin-left: ${u(7)}; vertical-align: text-bottom;
}
.rp-${id} .rp-cur i { display: block; width: 100%; height: 100%; background: inherit; animation: rp-blink 1.05s steps(2, jump-none) infinite; }`);
      windowed(`.rp-${id} .rp-cur`, lineEnd, blk.at + blk.dur + 2.0);
      cursor = `<span class="rp-cur" aria-hidden="true"><i></i></span>`;
    }
    const bdot = blk.k === 'bullet' && j === 0 ? '<span class="rp-bdot" aria-hidden="true"></span>' : '';
    return `<div class="rp-line rp-l${j}">${bdot}${renderRuns(ln)}${cursor}</div>`;
  });
  html.push(`<div class="rp-blk rp-${id}">${lineHtml.join('')}</div>`);
});

css.push(`@keyframes rp-blink { 0% { opacity: 1; } 100% { opacity: 0.2; } }`);

html.push(`</div>`); // rp-col
html.push(`</div>`); // rp-cam
html.push(`<div class="rp-fade-top" aria-hidden="true"></div>`);
html.push(`<div class="rp-fade-bot" aria-hidden="true"></div>`);
html.push(`<div class="rp-hdr">Claude<span class="rp-hdr-rule"></span></div>`);
html.push(`<div class="rp-thread">Bangkok week — planning thread</div>`);
html.push(`</div>`); // rp
html.push(`<figcaption>Replay — the itinerary taking shape in chat</figcaption>`);
html.push(`</figure>`);

writeFileSync(new URL('./replay.css', import.meta.url), css.join('\n') + '\n');
writeFileSync(new URL('./replay-markup.html', import.meta.url), html.join('\n') + '\n');
console.log('anchors:', anchors.length, 'final scroll:', FINAL_S, 'total height:', y, 'keyframes:', kfId);
