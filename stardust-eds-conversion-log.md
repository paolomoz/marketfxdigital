# EDS conversion log — marketFX home

Runtime: **vanilla-eds** (repo ships scripts/aem.js; no AuthorKit). Branch: `stardust-home`.
Deployed: 2026-07-09. Source of truth: stardust/prototypes/index-proposed.html.

## Decisions locked
- One block per prototype section (16): hero, trust-logo-bar, stat-band, full-stack-partner,
  embedded-strategy, one-team-diagram, capabilities, band-light (platform+testimonials wrapper),
  approach-steps, unified-quadrants, comparison, growth-engine, embedded-partner, insights, faq, closing-cta.
- **Template-slotted (#95):** each block bakes its section markup in JS and recreates the exact
  prototype `<section class=… data-section=…>`, so all lifted, section-class-scoped CSS matches and
  the block-root's own name class is stripped to avoid double-styling.
- Foundation styles/styles.css = prototype :root + all section CSS verbatim (font src → /styles/fonts/).
- Header/footer = self-contained blocks rendering lifted chrome (JS hamburger + scroll-shadow); logo → /img/logo.png.
- scripts.js: ported reveal + count-up + JSON-LD injection (js-anim added at runtime; content visible by default).
- Content page = metadata block (Title/Description) + 16 empty block markers.

## Anti-patterns hit & fixed
- **Inline SVG stripped from content.** The DA/helix pipeline sanitizes inline `<svg>`/imagery out of
  authored cells → wave/chart/laser/venn/logos vanished. Fix: bake markup into block JS (template-slotted),
  content carries only markers. (Header/footer already worked because they're JS-injected.)
- **`main > div[data-section-status]{display:none}` hid ALL sections.** The pipeline stamps
  `data-section-status="loaded"`; the blanket rule kept them hidden (main height 0). It passed the
  computed-style gate because getComputedStyle reports an element's own `grid` even inside a display:none
  ancestor — lesson: gate on boundingRect height, not just display. Fix: scope to `[data-section-status="loading"]`.

## Tradeoff (authorability)
Markup is in block JS, not DA content — editors edit copy via the block templates (developer task),
not the DA doc. Acceptable for a faithful first deploy; a later pass can slot the editable text back
into content while keeping the decorative SVG in JS.

## Hook findings (left intentional)
Inter + the dark-field color literals (#03060f, #0b1730, cyan/coral tints) are the captured brand
surface under Mode A — brand fidelity, not drift.

## 2026-07-09 · Content model rework (David's Model)

First deploy incorrectly baked all content into block JS (DA held only empty block
markers). Reworked so **all text + images live in DA documents** and blocks DECODE them:

- Page body: content/index.html DA doc — default content (eyebrow `<p>`, `<h1>/<h2>`,
  lede, native `<ul>`, `<img>`) for heads/prose/images; block tables (one row per unit,
  one cell per field) for repeating units (stats, cards, steps, quadrants, comparison
  rows, FAQ Q/A, logos, testimonials). Buttons authored as `<strong><a>` (primary) /
  `<em><a>` (secondary). Fully-qualified image URLs. Zero HTML/SVG/CSS in content (R1/R15).
- Chrome: /nav and /footer DA fragment docs; header/footer blocks fetch + decode them.
- Blocks: each `decorate()` reads authored cells/default-content and rebuilds the exact
  prototype `<section>`, injecting ONLY decorative SVG (wave, growth-engine chart, laser,
  venn) baked in JS, plus presentation-only details (ordinal glyphs, ticks, per-logo size map).
- Verified live: index.md/plain.html carry real content; rendered page faithful (main 12,603px,
  1 h1, wave/chart/laser/venn present, 19 logos, 8 FAQ, 4 quotes, 0 errors, 0 broken imgs, 0 mobile overflow).

Editing model: copy is now editable in DA (da.live/#/paolomoz/marketfxdigital). Decorative
SVG and layout live in code (correct per David's Model — presentation is not content).
