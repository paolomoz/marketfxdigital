/* services-hero — David's Model decode: reads the authored head (kicker / h1 /
   lede as default content) and the CTA block row, then rebuilds the compact
   services hero section. The dark radial background, dot-grid and cyan glow are
   CSS pseudo-elements (styles/styles.css). Unlike the home hero this register
   carries NO wave SVG — nothing decorative is baked here. */

// read a CTA link: authored as <strong><a> (primary) / <em><a> (secondary)
function readLink(scope, wrapTag) {
  const cls = wrapTag === 'strong' ? 'primary' : 'secondary';
  const a = scope.querySelector(`${wrapTag} a`) || scope.querySelector(`a.${cls}`);
  return a ? { href: a.getAttribute('href'), text: a.textContent.trim() } : null;
}

export default function decorate(block) {
  // authored head lives as default content before the block; fall back to first row
  const head = block.closest('.services-hero-wrapper')?.previousElementSibling
    || block.querySelector(':scope > div');
  const h1El = head?.querySelector('h1');
  const paras = head ? [...head.querySelectorAll('p')].filter((p) => !p.querySelector('a')) : [];
  const kicker = paras[0]?.textContent.trim() || '';
  const lede = paras[1]?.textContent.trim() || '';
  const headline = h1El?.textContent.trim() || '';

  const primary = readLink(block, 'strong');
  const secondary = readLink(block, 'em');

  const section = document.createElement('section');
  section.className = 'hero';
  section.setAttribute('data-section', 'hero');
  section.setAttribute('data-intent', 'conversion');
  section.setAttribute('data-layout', 'compact');
  section.innerHTML = `
    <div class="wrap">
      <div class="hero-content">
        <p class="kicker">${kicker}</p>
        <h1>${headline}</h1>
        <p class="hero-lede">${lede}</p>
        <div class="hero-actions">
          ${primary ? `<a class="btn btn-primary" href="${primary.href}">${primary.text}</a>` : ''}
          ${secondary ? `<a class="text-link" href="${secondary.href}">${secondary.text} <span class="arr" aria-hidden="true">&rarr;</span></a>` : ''}
        </div>
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove('services-hero');
  head?.remove();
}
