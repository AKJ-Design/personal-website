# Office templates — Field Notes Light

Word and PowerPoint templates carrying the design system's light theme. Generated from
`../tokens.json`, so the colours here and the colours on the website are the same values from
the same source — not two transcriptions that drift.

| File | What it is |
|---|---|
| `Field-Notes.dotx` | Word template — styles only, no content |
| `Field-Notes-sample.docx` | A document showing every style in use. Read this first |
| `Field-Notes.potx` | PowerPoint template — 6 layouts + the colour theme |
| `Field-Notes-sample.pptx` | A 6-slide deck showing every layout |

Regenerate with `build.js` (Word) and `deck.js` (PowerPoint), then re-apply
`theme.py` to the PowerPoint files — see *Rebuilding* below.

## Install

**Word (macOS).** Copy the template into Word's user template folder:

```bash
cp Field-Notes.dotx ~/Library/Group\ Containers/UBF8T346G9.Office/User\ Content.localized/Templates.localized/
```

It then appears under File › New from Template. On Windows the folder is
`%APPDATA%\Microsoft\Templates`.

**PowerPoint.** Same idea — `Field-Notes.potx` into the same Templates folder. Or just
double-click either template: opening a `.dotx`/`.potx` creates a *new document* from it rather
than editing the template, which is the whole point of the template content type.

## Fonts

Both templates reference **Space Grotesk SemiBold** and **JetBrains Mono**. Body text is
**Calibri**, which ships with every Office since 2007.

Two things that will bite otherwise:

- **Space Grotesk's Medium, SemiBold and Light are separate font families to Office** — the
  template asks for `Space Grotesk SemiBold`, not `Space Grotesk` + bold. Naming the wrong one
  substitutes silently. (`JetBrains Mono` has a full regular/italic/bold set under one family
  and behaves normally.)
- **Space Grotesk has no italic.** Italicising a heading produces a fake oblique that reads as
  a rendering bug. Use the *Accent* character style instead — that's what it's for.

**Sending a document to someone without the fonts?** Both are SIL Open Font Licence, which
permits embedding: File › Save As › Tools › Save Options › *Embed fonts in the file*, with
"embed only the characters used" ticked. Without that, their Word substitutes and the document
stops looking like the system.

## What's in the Word template

Styles, all in the Styles gallery: **Title**, **Heading 1–3**, **Eyebrow**, **Section Label**,
**Lead**, **Meta**, **Callout**, **Caption Text**, plus the *Mono Data* and *Accent* character
styles. Headings 4–6 and the Hyperlink style are bound too — Word ships those as blue by
default, and a blue hyperlink is exactly the second interactive colour the system forbids.

Page is **A4**, margins 1″ top/bottom and **1.5″ sides**. The wide sides are deliberate: they
hold the line length near the system's 65-character measure. A 1″ side margin on A4 runs closer
to 90 characters.

## What's in the PowerPoint template

Six layouts under Home › Layout: **FN_TITLE**, **FN_SECTION**, **FN_CONTENT**, **FN_TWO_COL**,
**FN_STAT**, **FN_CLOSING**. The title, section and closing layouts use the accent green as a
full-bleed ground — white on `#204E39` measures 9.50:1, so the deck gets its light/dark rhythm
without needing a second theme.

The colour theme is rebound to **Field Notes**, so PowerPoint's colour picker offers only
on-system colours and `accent1` is always the green. PowerPoint demands six accent slots and a
one-accent system doesn't have six, so 2–6 are bound to values the system already defines
(accent-light, muted, muted-2, warn, crit) rather than to invented colours.

## Deliberate divergences from the web tokens

These are not drift — they're print making different demands, recorded so nobody "fixes" them:

| | Web | Office | Why |
|---|---|---|---|
| Body size | 16px | 11pt | Same 1.185 ratio, re-anchored. A straight px→pt gives 12pt, large for a document |
| Line height | 1.6 | 1.4 | Screens scroll; paper doesn't |
| Body face | system stack | Calibri | Office has no `system-ui`; Calibri is the universally-present neutral |
| Hairlines | accent at 20% alpha | `#CED5CD` | Word borders take no alpha, so the value is pre-flattened over the ground |

## Page background

Both templates set the page/slide ground to `#FAF7F2`. **Word does not print page background
colours by default** — documents print on white unless you enable File › Print › *Print
background colors and images*. That's fine either way: every contrast ratio in this system was
measured against `#FAF7F2`, and white is lighter, so printing on white only increases contrast.

## Verified / not verified

**Verified** — content types are genuine template types (not just renamed files); every colour
in both Word packages resolves to a design token; the PowerPoint theme is rebound with hyperlink
and both latin faces correct; all four packages pass a zip integrity test; the seven PowerPoint
layouts and six sample slides are present with their text intact.

**Not verified** — no visual render. This machine has no LibreOffice, and the Office skills'
own validators need Python 3.10+ against a 3.9 runtime, so nothing was converted to PDF and
looked at. **Open both sample files and check the type sizes and slide fit before relying on
these** — text overflow on a slide is the defect a structural audit cannot catch.

## Rebuilding

```bash
node build.js && node deck.js
```

`build.js` writes `Field-Notes-sample.docx` and a `Field-Notes.docx`; the latter must be
repacked with the Word *template* content type to become `Field-Notes.dotx`. `deck.js` writes
the sample deck and `Field-Notes-template.pptx`, which likewise becomes `Field-Notes.potx`.
Then re-run `theme.py` over both PowerPoint files — pptxgenjs always writes the stock Office
theme, so the rebind is not optional.
