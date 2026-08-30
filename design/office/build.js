/* Field Notes Light — Word template + sample document.
   Built from personal-website/design/tokens.json. */

const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, ShadingType, Table, TableRow, TableCell, WidthType,
  LevelFormat, TabStopType, PageOrientation,
} = require('docx');

// ---- tokens -------------------------------------------------------------
const T = JSON.parse(fs.readFileSync('/Users/alexyoung/Documents/personal-website/design/tokens.json', 'utf8'));
const L = T.themes.fieldNotesLight;
const hex = s => s.replace('#', '').toUpperCase();

const INK     = hex(L.ink.value);          // 141210
const MUTED   = hex(L.muted.value);        // 57514A
const MUTED2  = hex(L.muted2.value);       // 6B6358
const ACCENT  = hex(L.accent.value);       // 204E39
const ONACC   = hex(L.onAccent.value);     // FFFFFF
const SURFACE = hex(L.surface.value);      // FAF7F2
const SUNK    = hex(L.surfaceSunk.value);  // F4F0E8
const HAIR    = hex(L.hairline.flattened); // accent @20% over surface, flattened for Word

// ---- type scale, re-anchored for print ----------------------------------
// The web scale is 11/13/16/19/24/34/48 px. A straight px->pt conversion puts
// body at 12pt, which is large for a document, so the SAME 1.185 ratio is
// re-anchored at 11pt body. Ratios preserved, absolute sizes print-appropriate
// — the same kind of deliberate divergence Theme.swift made when it swapped the
// PWA's fixed px for Dynamic Type.
const pt = n => Math.round(n * 2); // docx sizes are half-points
const SZ = { eyebrow: pt(8), meta: pt(9), body: pt(11), lead: pt(13),
             h3: pt(13), h2: pt(16), h1: pt(22), title: pt(30) };

// Fonts. Space Grotesk's SemiBold is a SEPARATE Word family — naming
// "Space Grotesk" + bold would give Bold (700), not the design's 600.
const F_DISPLAY = 'Space Grotesk SemiBold';
const F_BODY    = 'Calibri';        // present on every Office since 2007. Aptos (the
                                    // post-2023 default) looks better but is missing from
                                    // older installs, and a template that substitutes on a
                                    // colleague's machine is not a template.
const F_MONO    = 'JetBrains Mono'; // full regular/italic/bold set under one family

// 0.16em tracking at 8pt = 1.28pt. characterSpacing is in twentieths of a point.
const TRACK_EYEBROW = 26;
const TRACK_LABEL   = 16;

const LINE = 336; // 1.4 line spacing (240 = single). The system says 1.6 for
                  // screen; paper does not scroll, so documents run tighter.

const hairline = (side, sz = 6, color = HAIR) => ({
  [side]: { style: BorderStyle.SINGLE, size: sz, color, space: 8 },
});

// ---- styles -------------------------------------------------------------
const styles = {
  default: {
    document: {
      run: { font: F_BODY, size: SZ.body, color: INK },
      paragraph: { spacing: { line: LINE, after: 160 } },
    },
    title: {
      run: { font: F_DISPLAY, size: SZ.title, color: INK, bold: false },
      paragraph: { spacing: { before: 0, after: 200, line: 240 } },
    },
    heading1: {
      run: { font: F_DISPLAY, size: SZ.h1, color: INK, bold: false },
      paragraph: { spacing: { before: 400, after: 160, line: 264 } },
    },
    heading2: {
      run: { font: F_DISPLAY, size: SZ.h2, color: INK, bold: false },
      paragraph: { spacing: { before: 320, after: 120, line: 264 },
                   border: hairline('bottom') },
    },
    heading3: {
      run: { font: F_DISPLAY, size: SZ.h3, color: INK, bold: false },
      paragraph: { spacing: { before: 240, after: 100, line: 264 } },
    },
    // Headings 4-6 ship as Word-blue Calibri Light by default. Unused here, but
    // an unstyled heading is one Insert away, so they are bound too.
    heading4: {
      run: { font: F_DISPLAY, size: SZ.body, color: INK, bold: false },
      paragraph: { spacing: { before: 200, after: 80, line: 264 } },
    },
    heading5: {
      run: { font: F_MONO, size: SZ.eyebrow, color: MUTED2, allCaps: true, characterSpacing: TRACK_LABEL },
      paragraph: { spacing: { before: 200, after: 60, line: 240 } },
    },
    heading6: {
      run: { font: F_MONO, size: SZ.eyebrow, color: MUTED2, allCaps: true, characterSpacing: TRACK_LABEL },
      paragraph: { spacing: { before: 200, after: 60, line: 240 } },
    },
    // THE IMPORTANT ONE. Word's default hyperlink is #0563C1 — a second
    // interactive colour, which is exactly what the accent-thread rule forbids.
    // Left alone, every link pasted into a document silently breaks the system.
    hyperlink: {
      run: { color: ACCENT, underline: { type: 'single', color: ACCENT } },
    },
  },
  paragraphStyles: [
    { id: 'Eyebrow', name: 'Eyebrow', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { font: F_MONO, size: SZ.eyebrow, color: ACCENT, allCaps: true, characterSpacing: TRACK_EYEBROW },
      paragraph: { spacing: { before: 240, after: 60, line: 240 } } },

    { id: 'SectionLabel', name: 'Section Label', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { font: F_MONO, size: SZ.eyebrow, color: MUTED2, allCaps: true, characterSpacing: TRACK_LABEL },
      paragraph: { spacing: { before: 200, after: 60, line: 240 } } },

    { id: 'Lead', name: 'Lead', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { font: F_BODY, size: SZ.lead, color: MUTED },
      paragraph: { spacing: { after: 200, line: 320 } } },

    { id: 'MetaLine', name: 'Meta', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { font: F_MONO, size: SZ.meta, color: MUTED },
      paragraph: { spacing: { after: 120, line: 260 } } },

    { id: 'Callout', name: 'Callout', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { font: F_BODY, size: SZ.body, color: INK },
      paragraph: {
        spacing: { before: 200, after: 200, line: LINE },
        indent: { left: 280 },
        shading: { type: ShadingType.CLEAR, fill: SUNK, color: 'auto' },
        border: { left: { style: BorderStyle.SINGLE, size: 18, color: ACCENT, space: 12 } },
      } },

    { id: 'CaptionText', name: 'Caption Text', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { font: F_MONO, size: SZ.eyebrow, color: MUTED2 },
      paragraph: { spacing: { before: 60, after: 200, line: 240 } } },
  ],
  characterStyles: [
    { id: 'MonoData', name: 'Mono Data', basedOn: 'DefaultParagraphFont', quickFormat: true,
      run: { font: F_MONO, size: SZ.meta, color: INK } },
    { id: 'AccentText', name: 'Accent', basedOn: 'DefaultParagraphFont', quickFormat: true,
      run: { color: ACCENT, bold: true } },
  ],
};

const numbering = {
  config: [{
    reference: 'fn-bullets',
    levels: [
      { level: 0, format: LevelFormat.BULLET, text: '—', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 220 } },
                 run: { color: ACCENT, font: F_MONO } } },
      { level: 1, format: LevelFormat.BULLET, text: '·', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 220 } },
                 run: { color: ACCENT, font: F_MONO } } },
    ],
  }],
};

// A4 (Australia). 1" top/bottom, 1.5" sides -> ~5.3in measure, close to the
// system's 65ch rule. A 1" side margin would run ~90 characters.
const pageProps = {
  page: {
    size: { width: 11906, height: 16838 },
    margin: { top: 1440, bottom: 1440, left: 2160, right: 2160 },
  },
};

// ---- helpers ------------------------------------------------------------
const P    = (text, opts = {}) => new Paragraph({ text, ...opts });
const Head = (text, level) => new Paragraph({ text, heading: level });
const Bul  = text => new Paragraph({ text, numbering: { reference: 'fn-bullets', level: 0 } });

function specTable() {
  const W = 7586, cols = [2400, 1500, 3686];
  const cell = (children, width, opts = {}) => new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 0, right: 120 },
    borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL },
               right: { style: BorderStyle.NIL },
               bottom: { style: BorderStyle.SINGLE, size: 4, color: HAIR } },
    children, ...opts,
  });
  const hcell = (t, width) => cell(
    [new Paragraph({ children: [new TextRun({ text: t, font: F_MONO, size: SZ.eyebrow,
      color: MUTED2, allCaps: true, characterSpacing: TRACK_LABEL })], spacing: { after: 0, line: 240 } })],
    width,
    { borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL },
                 right: { style: BorderStyle.NIL },
                 bottom: { style: BorderStyle.SINGLE, size: 8, color: ACCENT } } });
  const dcell = (t, width, mono) => cell(
    [new Paragraph({ children: [new TextRun({ text: t, font: mono ? F_MONO : F_BODY,
      size: mono ? SZ.meta : SZ.body, color: INK })], spacing: { after: 0, line: 260 } })], width);

  const rows = [
    new TableRow({ tableHeader: true, children: [hcell('Token', cols[0]), hcell('Value', cols[1]), hcell('Job', cols[2])] }),
    ...[['--accent', '#204E39', 'All interactive work'],
        ['--ink', '#141210', 'Body and headings'],
        ['--muted', '#57514A', 'Secondary prose'],
        ['--muted-2', '#6B6358', 'Labels only, never body'],
       ].map(r => new TableRow({ children: [dcell(r[0], cols[0], true), dcell(r[1], cols[1], true), dcell(r[2], cols[2], false)] })),
  ];
  return new Table({ columnWidths: cols, width: { size: W, type: WidthType.DXA }, rows });
}

// ---- the sample document ------------------------------------------------
const sampleChildren = [
  P('Field Notes', { style: 'Eyebrow' }),
  new Paragraph({ text: 'Document template', heading: HeadingLevel.TITLE }),
  P('Every style in this template, shown in use. Delete this text and write your own — or start from the .dotx, which carries the same styles with none of the demo content.', { style: 'Lead' }),
  P('15 August 2026 · Alex Young', { style: 'MetaLine' }),

  Head('How to use it', HeadingLevel.HEADING_1),
  P('Apply styles from the Styles gallery rather than formatting by hand. The point of a template is that a heading is a Heading — not 16pt Space Grotesk that happens to look like one. Restyling later then costs one edit instead of forty.'),

  P('Structure', { style: 'SectionLabel' }),
  Head('Headings carry the hierarchy', HeadingLevel.HEADING_2),
  P('Heading 2 sits under a hairline rule, which is the accent at 20% rather than a grey. That single choice is most of why the page reads warm and deliberate instead of like a default Word document.'),
  Head('Heading 3 for sub-points', HeadingLevel.HEADING_3),
  P('Body copy is Calibri at 11pt with 1.4 line spacing. The margins are set wide on purpose: they hold the line length near the system’s 65-character measure. A 1-inch side margin on A4 runs closer to 90 characters, which is measurably harder to read.'),

  P('Emphasis', { style: 'SectionLabel' }),
  new Paragraph({ children: [
    new TextRun('Use the '),
    new TextRun({ text: 'Accent', style: 'AccentText' }),
    new TextRun(' character style for emphasis rather than italic. Space Grotesk ships no italic at all, so an italicised heading is a fake oblique the renderer invents — it reads as a bug. Body text in Calibri italicises normally, but the accent is the house move.'),
  ]}),

  new Paragraph({ style: 'Callout', children: [
    new TextRun({ text: 'Callout. ', bold: true }),
    new TextRun('For anything that needs lifting out of the flow — a caveat, a decision, a number that matters. Accent rule on the left, sunk fill behind.'),
  ]}),

  P('Data', { style: 'SectionLabel' }),
  new Paragraph({ children: [
    new TextRun('Everything factual is monospaced: '),
    new TextRun({ text: '09:40', style: 'MonoData' }),
    new TextRun(', '),
    new TextRun({ text: '14/14 up', style: 'MonoData' }),
    new TextRun(', '),
    new TextRun({ text: '$2,140', style: 'MonoData' }),
    new TextRun('. Times, dates, counts, money, status, IDs. It is the system’s core move and the reason columns of figures line up without a table.'),
  ]}),

  specTable(),
  P('Table — header rule in accent, row rules in hairline', { style: 'CaptionText' }),

  P('Lists', { style: 'SectionLabel' }),
  Bul('Em-dash bullets in the accent, not round dots'),
  Bul('They read as field notes rather than a slide deck'),
  Bul('Second level uses a middot'),

  Head('What breaks this', HeadingLevel.HEADING_1),
  Bul('Adding a second accent colour. The thread is the identity; a second interactive colour halves it.'),
  Bul('Greying the hairlines. They are the accent at low alpha — a neutral grey rule is the fastest way to make this look like a default template.'),
  Bul('Putting Meta grey on body copy. It is a label colour and fails AA at body sizes.'),
  Bul('Italicising a heading. See above — there is no real italic to reach for.'),

  new Paragraph({ style: 'Callout', children: [
    new TextRun({ text: 'Sending this to someone else? ', bold: true }),
    new TextRun('Space Grotesk and JetBrains Mono must be installed on their machine, or Word substitutes silently. Both fonts are SIL Open Font Licence, which permits embedding: File › Save As › Tools › Save Options › Embed fonts in the file. Tick “embed only the characters used” to keep the file small.'),
  ]}),
];

// ---- the template: styles, no demo content ------------------------------
const templateChildren = [
  P('Eyebrow', { style: 'Eyebrow' }),
  new Paragraph({ text: 'Title', heading: HeadingLevel.TITLE }),
  P('Lead paragraph.', { style: 'Lead' }),
  P(''),
];

const mk = children => new Document({
  background: { color: SURFACE },
  styles, numbering,
  sections: [{ properties: pageProps, children }],
});

(async () => {
  const out = '/Users/alexyoung/Documents/personal-website/design/office';
  fs.writeFileSync(`${out}/Field-Notes-sample.docx`, await Packer.toBuffer(mk(sampleChildren)));
  fs.writeFileSync(`${out}/Field-Notes.docx`,        await Packer.toBuffer(mk(templateChildren)));
  console.log('wrote sample + template-source docx');
})();
