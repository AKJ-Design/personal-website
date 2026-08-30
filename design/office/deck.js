/* Field Notes Light — PowerPoint template (.potx) + sample deck.
   Layouts are built as pptxgenjs slide masters, which become slideLayouts. */

const fs = require('fs');
const pptxgen = require('pptxgenjs');

const T = JSON.parse(fs.readFileSync('/Users/alexyoung/Documents/personal-website/design/tokens.json', 'utf8'));
const L = T.themes.fieldNotesLight;
const hx = s => s.replace('#', '').toUpperCase();

const SURFACE = hx(L.surface.value);       // FAF7F2
const SUNK    = hx(L.surfaceSunk.value);   // F4F0E8
const INK     = hx(L.ink.value);           // 141210
const MUTED   = hx(L.muted.value);         // 57514A
const MUTED2  = hx(L.muted2.value);        // 6B6358
const ACCENT  = hx(L.accent.value);        // 204E39
const ONACC   = hx(L.onAccent.value);      // FFFFFF
const HAIR    = hx(L.hairline.flattened);  // accent @20% flattened

const F_DISPLAY = 'Space Grotesk SemiBold';
const F_BODY    = 'Calibri';        // universally present; see notes
const F_MONO    = 'JetBrains Mono';

// 13.333 x 7.5 in
const W = 13.333, H = 7.5;
const M = 0.75;                      // slide margin

const build = (withSampleSlides) => {
  const p = new pptxgen();
  p.layout = 'LAYOUT_WIDE';
  p.author = 'Alex Young';
  p.company = 'Field Notes';
  p.title = 'Field Notes';

  // ---------- shared furniture ----------
  const eyebrow = (text, color) => ({
    text: { text, options: {
      x: M, y: 0.42, w: 6, h: 0.3, margin: 0,
      fontFace: F_MONO, fontSize: 10, charSpacing: 2.2, color,
      bold: false, align: 'left', valign: 'middle',
    }},
  });

  const footerMono = (color) => ({
    text: { text: 'alexjyoung.com.au', options: {
      x: M, y: H - 0.62, w: 4, h: 0.28, margin: 0,
      fontFace: F_MONO, fontSize: 9, color, valign: 'middle',
    }},
  });

  // ---------- LAYOUT: title (accent ground) ----------
  // The accent green carries the dark half of the deck's light/dark rhythm.
  // White on #204E39 is 9.50:1 — AAA — so this needs no separate dark theme.
  p.defineSlideMaster({
    title: 'FN_TITLE',
    background: { color: ACCENT },
    objects: [
      eyebrow('FIELD NOTES', ONACC),
      { placeholder: { options: {
          name: 'title', type: 'title', x: M, y: 2.5, w: W - M * 2 - 1.5, h: 1.9,
          fontFace: F_DISPLAY, fontSize: 46, color: ONACC, align: 'left', valign: 'bottom', margin: 0,
        }, text: 'Presentation title' } },
      { placeholder: { options: {
          name: 'subtitle', type: 'body', x: M, y: 4.55, w: W - M * 2 - 2.5, h: 0.9,
          fontFace: F_BODY, fontSize: 16, color: ONACC, align: 'left', valign: 'top', margin: 0,
        }, text: 'Subtitle or one-line framing' } },
      { placeholder: { options: {
          name: 'meta', type: 'body', x: M, y: H - 0.95, w: 6, h: 0.35,
          fontFace: F_MONO, fontSize: 10, color: ONACC, align: 'left', valign: 'middle', margin: 0,
        }, text: 'Alex Young · 2026' } },
    ],
  });

  // ---------- LAYOUT: section divider ----------
  p.defineSlideMaster({
    title: 'FN_SECTION',
    background: { color: ACCENT },
    objects: [
      { placeholder: { options: {
          name: 'num', type: 'body', x: M, y: 2.3, w: 2, h: 0.5,
          fontFace: F_MONO, fontSize: 12, charSpacing: 2, color: ONACC, valign: 'middle', margin: 0,
        }, text: '01' } },
      { placeholder: { options: {
          name: 'title', type: 'title', x: M, y: 2.85, w: W - M * 2 - 1, h: 1.5,
          fontFace: F_DISPLAY, fontSize: 38, color: ONACC, align: 'left', valign: 'top', margin: 0,
        }, text: 'Section' } },
    ],
  });

  // ---------- LAYOUT: content ----------
  p.defineSlideMaster({
    title: 'FN_CONTENT',
    background: { color: SURFACE },
    objects: [
      eyebrow('SECTION', ACCENT),
      { placeholder: { options: {
          name: 'title', type: 'title', x: M, y: 0.82, w: W - M * 2, h: 0.8,
          fontFace: F_DISPLAY, fontSize: 30, color: INK, align: 'left', valign: 'middle', margin: 0,
        }, text: 'Slide title' } },
      { placeholder: { options: {
          name: 'body', type: 'body', x: M, y: 1.85, w: W - M * 2, h: 4.6,
          fontFace: F_BODY, fontSize: 16, color: INK, align: 'left', valign: 'top', margin: 0,
          lineSpacingMultiple: 1.25,
        }, text: 'Body content' } },
      footerMono(MUTED2),
    ],
    slideNumber: { x: W - M - 0.5, y: H - 0.62, w: 0.5, h: 0.28,
                   fontFace: F_MONO, fontSize: 9, color: MUTED2, align: 'right' },
  });

  // ---------- LAYOUT: two column ----------
  p.defineSlideMaster({
    title: 'FN_TWO_COL',
    background: { color: SURFACE },
    objects: [
      eyebrow('SECTION', ACCENT),
      { placeholder: { options: {
          name: 'title', type: 'title', x: M, y: 0.82, w: W - M * 2, h: 0.8,
          fontFace: F_DISPLAY, fontSize: 30, color: INK, align: 'left', valign: 'middle', margin: 0,
        }, text: 'Slide title' } },
      { placeholder: { options: {
          name: 'left', type: 'body', x: M, y: 1.85, w: (W - M * 2 - 0.6) / 2, h: 4.6,
          fontFace: F_BODY, fontSize: 15, color: INK, valign: 'top', margin: 0, lineSpacingMultiple: 1.25,
        }, text: 'Left column' } },
      { placeholder: { options: {
          name: 'right', type: 'body', x: M + (W - M * 2 - 0.6) / 2 + 0.6, y: 1.85,
          w: (W - M * 2 - 0.6) / 2, h: 4.6,
          fontFace: F_BODY, fontSize: 15, color: INK, valign: 'top', margin: 0, lineSpacingMultiple: 1.25,
        }, text: 'Right column' } },
      footerMono(MUTED2),
    ],
    slideNumber: { x: W - M - 0.5, y: H - 0.62, w: 0.5, h: 0.28,
                   fontFace: F_MONO, fontSize: 9, color: MUTED2, align: 'right' },
  });

  // ---------- LAYOUT: stat ----------
  // Everything factual is monospaced; this layout exists so a headline figure
  // is set in the data face rather than the display face.
  p.defineSlideMaster({
    title: 'FN_STAT',
    background: { color: SURFACE },
    objects: [
      eyebrow('MEASURED', ACCENT),
      { placeholder: { options: {
          name: 'figure', type: 'body', x: M, y: 2.2, w: W - M * 2, h: 1.9,
          fontFace: F_MONO, fontSize: 90, color: ACCENT, align: 'left', valign: 'middle', margin: 0,
        }, text: '8.89:1' } },
      { placeholder: { options: {
          name: 'caption', type: 'body', x: M, y: 4.2, w: W - M * 2 - 2, h: 1.2,
          fontFace: F_BODY, fontSize: 17, color: MUTED, align: 'left', valign: 'top', margin: 0,
        }, text: 'What the figure means' } },
      footerMono(MUTED2),
    ],
    slideNumber: { x: W - M - 0.5, y: H - 0.62, w: 0.5, h: 0.28,
                   fontFace: F_MONO, fontSize: 9, color: MUTED2, align: 'right' },
  });

  // ---------- LAYOUT: closing ----------
  p.defineSlideMaster({
    title: 'FN_CLOSING',
    background: { color: ACCENT },
    objects: [
      { placeholder: { options: {
          name: 'title', type: 'title', x: M, y: 3.0, w: W - M * 2 - 1, h: 1.4,
          fontFace: F_DISPLAY, fontSize: 40, color: ONACC, align: 'left', valign: 'middle', margin: 0,
        }, text: 'Thanks' } },
      { placeholder: { options: {
          name: 'contact', type: 'body', x: M, y: 4.4, w: 7, h: 0.5,
          fontFace: F_MONO, fontSize: 12, color: ONACC, align: 'left', valign: 'top', margin: 0,
        }, text: 'alexjyoung.com.au' } },
    ],
  });

  if (!withSampleSlides) {
    // A .potx still needs one slide; keep it the title layout, unfilled.
    p.addSlide({ masterName: 'FN_TITLE' });
    return p;
  }

  // ---------- sample deck ----------
  let s = p.addSlide({ masterName: 'FN_TITLE' });
  s.addText('Field Notes', { placeholder: 'title' });
  s.addText('The deck template, with every layout shown in use', { placeholder: 'subtitle' });
  s.addText('Alex Young · 15 August 2026', { placeholder: 'meta' });

  s = p.addSlide({ masterName: 'FN_SECTION' });
  s.addText('01', { placeholder: 'num' });
  s.addText('The layouts', { placeholder: 'title' });

  s = p.addSlide({ masterName: 'FN_CONTENT' });
  s.addText('HOW IT WORKS', { placeholder: 'eyebrow' });
  s.addText('Pick a layout, don’t restyle a slide', { placeholder: 'title' });
  s.addText([
    { text: 'Six layouts, chosen from Home › Layout. Each one already carries the fonts, colours and spacing.', options: { bullet: true, breakLine: true, paraSpaceAfter: 10 } },
    { text: 'The green slides are the deck’s dark half — white on the accent measures 9.50:1, so the rhythm costs no second theme.', options: { bullet: true, breakLine: true, paraSpaceAfter: 10 } },
    { text: 'Everything factual is monospaced. Figures, dates, counts, status.', options: { bullet: true, breakLine: true, paraSpaceAfter: 10 } },
    { text: 'One accent does all the work. Resist adding a second.', options: { bullet: true } },
  ], { placeholder: 'body' });

  s = p.addSlide({ masterName: 'FN_TWO_COL' });
  s.addText('COMPARE', { placeholder: 'eyebrow' });
  s.addText('Two columns when things sit side by side', { placeholder: 'title' });
  s.addText([
    { text: 'Do', options: { bold: true, fontSize: 17, breakLine: true, paraSpaceAfter: 8 } },
    { text: 'Use the Stat layout for a single headline figure.', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: 'Keep body text left-aligned.', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: 'Let the layout hold the margins.', options: { bullet: true } },
  ], { placeholder: 'left' });
  s.addText([
    { text: 'Don’t', options: { bold: true, fontSize: 17, color: MUTED, breakLine: true, paraSpaceAfter: 8 } },
    { text: 'Add a second accent colour.', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: 'Italicise a heading — Space Grotesk has no italic.', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: 'Set body copy in the label grey.', options: { bullet: true } },
  ], { placeholder: 'right' });

  s = p.addSlide({ masterName: 'FN_STAT' });
  s.addText('MEASURED', { placeholder: 'eyebrow' });
  s.addText('8.89:1', { placeholder: 'figure' });
  s.addText('Contrast of the accent green on the off-white ground — AAA. It clears AAA as a ground under white too, which is why one green covers every role.', { placeholder: 'caption' });

  s = p.addSlide({ masterName: 'FN_CLOSING' });
  s.addText('Thanks', { placeholder: 'title' });
  s.addText('alexjyoung.com.au', { placeholder: 'contact' });

  return p;
};

(async () => {
  const out = '/Users/alexyoung/Documents/personal-website/design/office';
  await build(true).writeFile({ fileName: `${out}/Field-Notes-sample.pptx` });
  await build(false).writeFile({ fileName: `${out}/Field-Notes-template.pptx` });
  console.log('wrote sample deck + template source');
})();
