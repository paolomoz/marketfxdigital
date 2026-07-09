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
