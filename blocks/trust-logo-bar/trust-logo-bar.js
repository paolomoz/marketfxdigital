/* trust-logo-bar — David's Model decode: reads the authored label (default
   content) and one block row per client logo, then rebuilds the prototype
   trust row. No decorative SVG in this section. */

// per-logo display heights normalise the mixed-aspect brand marks into one row
// (decorative sizing; the prototype carried these as inline max-height styles).
const LOGO_HEIGHTS = [
  ['hp-', 34], ['samsung', 26], ['7-eleven', 36],
  ['spence', 24], ['cactus', 12], ['sap', 30],
];

function heightFor(src) {
  const hit = LOGO_HEIGHTS.find(([key]) => src.includes(key));
  return hit ? hit[1] : null;
}

// logos render at <=40px height: request a small webply rendition instead of the
// full-size PNG the content bus serves by default (audit F-008, up to 20x oversize)
function renditionFor(src) {
  if (!src.includes('media_')) return src;
  const [base] = src.split('?');
  return `${base}?width=200&format=webply&optimize=medium`;
}

export default function decorate(block) {
  const head = block.closest('.trust-logo-bar-wrapper')?.previousElementSibling;
  const label = head?.querySelector('p')?.textContent.trim() || '';

  const imgs = [...block.querySelectorAll('img')];
  const items = imgs.map((img) => {
    const src = renditionFor(img.getAttribute('src') || '');
    const alt = img.getAttribute('alt') || '';
    const w = img.getAttribute('width');
    const h = img.getAttribute('height');
    const mh = heightFor(src);
    const dims = `${w ? ` width="${w}"` : ''}${h ? ` height="${h}"` : ''}`;
    const style = mh ? ` style="max-height:${mh}px"` : '';
    return `<li><img src="${src}" alt="${alt}"${dims} loading="eager"${style}></li>`;
  }).join('\n        ');

  const section = document.createElement('section');
  section.className = 'trust';
  section.setAttribute('data-section', 'trust-logo-bar');
  section.setAttribute('data-intent', 'social-proof');
  section.setAttribute('data-layout', 'contained-row');
  section.setAttribute('data-items', String(imgs.length));
  section.innerHTML = `
    <div class="wrap">
      <p class="trust-label">${label}</p>
      <ul class="trust-row" data-reveal>
        ${items}
      </ul>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove('trust-logo-bar');
  head?.remove();
}
