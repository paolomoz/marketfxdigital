# EDS reconstructive conversion contract (David's Model)

Goal: the DA document holds ALL editorial text + images; blocks DECODE that
authored content and rebuild the prototype section. Only decorative SVG lives
in block JS. Runtime: vanilla-eds. Source: _home-proto.html (find your section by
`data-section="<name>"`). Foundation CSS already lifted into styles/styles.css
(section-class-scoped) — do NOT touch it; your block must recreate the exact
`<section class="…" data-section="…">` so the CSS matches.

## David's Model rules you MUST follow (authored content = the DA snippet)
- R1/R15: NO raw HTML, NO inline SVG, NO CSS/JSON in content. Headings→`<h1/h2/h3>`,
  prose→`<p>`, images→`<img>`, links→`<a>`. Nothing else structural.
- R4: images/links use FULLY-QUALIFIED URLs (https://marketfxdigital.com/... for imgs;
  site-relative paths like /services for internal links are fine).
- R6: a link alone on a line = button; wrap in `<strong>` for PRIMARY, `<em>` for SECONDARY.
- R5: simple lists = native `<ul>`; complex repeating items = block rows.
- R1: prefer DEFAULT CONTENT (bare h/p/img/ul before the block) for section head
  (eyebrow + heading + lede) and any non-repeating prose. Use a BLOCK TABLE only for
  repeating units (cards, stats, steps, quadrant lists, comparison rows, FAQ, logos, quotes).
- R14: name/value tables only for config, never for content.

## Authored-content shape per section (the DA snippet you return)
A section is one `<div>` inside `<main>` containing (in order):
1. DEFAULT CONTENT head: eyebrow `<p>`, `<h2>` (hero uses `<h1>`), lede `<p>` — as bare siblings.
2. The BLOCK table: `<div class="<block-name>"> <div><div>cell</div><div>cell</div></div> ... </div>`
   — one ROW per repeating unit, one CELL per field, in a fixed order you define.
   (Header text/name is encoded as the class; do NOT add a name row.)
Images: `<img src="https://marketfxdigital.com/…" alt="…">` in a cell (or default content).

## Decode (blocks/<name>/<name>.js) contract
`export default function decorate(block){…}`:
- Read the AUTHORED content: default-content head via `block.closest('.<name>-wrapper')?.previousElementSibling`
  OR (simpler here) author the head INSIDE the block's first rows and read them — your choice, but
  the DA snippet and decode MUST agree. Recommended: author head as default content in the section
  (siblings before the block) and reabsorb it; fall back to first rows if absent.
- Read repeating items from `[...block.children]` rows → cells.
- Rebuild the EXACT prototype section DOM for `data-section="<name>"`, placing authored text/images
  into it, and INJECT the decorative SVG (wave, chart spokes, laser dots, venn, dot-grid) as a
  baked template literal (aria-hidden) — decorative SVG is the ONLY thing baked in JS.
- Recreate `<section class="<prototype classes>" data-section="<name>">…</section>` and
  `block.replaceChildren(section); block.classList.remove('<name>')` so foundation CSS matches and
  the block root isn't double-styled.
- Content visible by default; keep `data-reveal` attributes if present (scripts.js adds motion).

## Verify (each section, before returning)
Serve the repo at http://localhost:8799 (python3 -m http.server 8799 from repo root — already running or start it),
build a tiny harness that wraps your section's DA snippet in the EDS shape
(`<div class="section"><div class="<name>-wrapper"><div class="<name> block"><div>…authored rows…</div></div></div></div>`),
import your block JS, run decorate, screenshot at 1440, and READ it against the prototype section
(_home-proto.html rendered, or the section screenshot). Fix until faithful. Assert: no inline SVG in the
DA snippet (grep '<svg' your snippet = 0), fully-qualified img URLs, and the decoded section renders with
the decorative SVG present.

## Return
For EACH of your sections return: (1) the DA content snippet (the `<div>…</div>` section block, ready to
paste into content/index.html), clearly delimited; (2) confirmation the block JS is written at
blocks/<name>/<name>.js; (3) your verification result (faithful y/n + what you checked).
