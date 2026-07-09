/* pm-hero — David's Model decode: reads the authored head (kicker / h1 / lede /
   primary CTA as default content) and the block rows (trust label + one row per
   client logo), then rebuilds the paid-media detail hero: a compact dark radial
   split with the content column left and the "Trusted by category leaders" logo
   tiles right. No decorative SVG in this register (no wave). The dark radial
   background, dot-grid and cyan glow are CSS pseudo-elements on .hero
   (styles/styles.css); the split + trust styling live in pm-hero.css. */

// per-logo display heights normalise the mixed-aspect brand marks into one row
// (decorative sizing; the prototype carried these as inline max-height styles).
const LOGO_HEIGHTS = [
  ['samsung', 26], ['7-eleven', 36], ['cactus', 12], ['sap', 30],
];

function heightFor(src) {
  const hit = LOGO_HEIGHTS.find(([key]) => src.includes(key));
  return hit ? hit[1] : null;
}

// read the primary CTA: authored as <strong><a> (buttonized to a.primary by scripts.js)
function readPrimary(scope) {
  const a = scope.querySelector('strong a') || scope.querySelector('a.button.primary') || scope.querySelector('a.primary');
  return a ? { href: a.getAttribute('href'), text: a.textContent.trim() } : null;
}

export default function decorate(block) {
  // authored head lives as default content before the block
  const head = block.closest('.pm-hero-wrapper')?.previousElementSibling;
  const headline = head?.querySelector('h1')?.textContent.trim() || '';
  const paras = head ? [...head.querySelectorAll('p')].filter((p) => !p.querySelector('a') && !p.querySelector('img')) : [];
  const kicker = paras[0]?.textContent.trim() || '';
  const lede = paras[1]?.textContent.trim() || '';
  const primary = readPrimary(head || block);

  // block rows: the row without an image is the trust label; every row with an
  // image is a client logo.
  const rows = [...block.children];
  let label = '';
  const logos = [];
  rows.forEach((row) => {
    const img = row.querySelector('img');
    if (img) {
      logos.push(img);
    } else if (!label) {
      label = row.textContent.trim();
    }
  });

  const logoItems = logos.map((img) => {
    const src = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt') || '';
    const w = img.getAttribute('width');
    const h = img.getAttribute('height');
    const mh = heightFor(src);
    const dims = `${w ? ` width="${w}"` : ''}${h ? ` height="${h}"` : ''}`;
    const style = mh ? ` style="max-height:${mh}px"` : '';
    return `<li><img src="${src}" alt="${alt}"${dims} loading="lazy"${style}></li>`;
  }).join('\n          ');

  const section = document.createElement('section');
  section.className = 'hero hero-detail';
  section.setAttribute('data-section', 'hero');
  section.setAttribute('data-intent', 'conversion');
  section.setAttribute('data-layout', 'compact');
  section.innerHTML = `
    <div class="wrap hero-split">
      <div class="hero-content" data-reveal>
        <p class="kicker">${kicker}</p>
        <h1>${headline}</h1>
        <p class="hero-lede">${lede}</p>
        <div class="hero-actions">
          ${primary ? `<a class="btn btn-primary" href="${primary.href}">${primary.text}</a>` : ''}
        </div>
      </div>
      <div class="hero-trust" data-reveal>
        <p class="trust-label">${label}</p>
        <ul class="trust-row" data-items="${logos.length}">
          ${logoItems}
        </ul>
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove('pm-hero');
  head?.remove();
}
