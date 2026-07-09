/* hero — David's Model decode: reads the authored head (eyebrow / h1 / strip /
   lede as default content) and the CTA block row, then rebuilds the prototype
   section. Injects ONLY the decorative wave SVG (baked below); the dot-grid and
   cyan glow are CSS pseudo-elements (styles/styles.css). */

const WAVE = `<div class="hero-wave" aria-hidden="true"><svg viewBox="0 0 2880 420" preserveAspectRatio="none" fill="none">
  <defs>
    <linearGradient id="wv-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="oklch(0.55 0.24 258)" stop-opacity="0"/><stop offset="25%" stop-color="oklch(0.55 0.24 258)" stop-opacity="0.95"/><stop offset="75%" stop-color="oklch(0.70 0.22 252)" stop-opacity="1"/><stop offset="100%" stop-color="oklch(0.70 0.22 252)" stop-opacity="0"/></linearGradient>
    <linearGradient id="wv-b" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="oklch(0.75 0.18 250)" stop-opacity="0"/><stop offset="50%" stop-color="oklch(0.75 0.18 250)" stop-opacity="0.7"/><stop offset="100%" stop-color="oklch(0.75 0.18 250)" stop-opacity="0"/></linearGradient>
    <linearGradient id="wv-c" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="oklch(0.60 0.24 258)" stop-opacity="0"/><stop offset="50%" stop-color="oklch(0.60 0.24 258)" stop-opacity="0.9"/><stop offset="100%" stop-color="oklch(0.60 0.24 258)" stop-opacity="0"/></linearGradient>
    <filter id="wv-blur" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="wv-blur-soft" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <g opacity="0.45">
    <g class="wave-c" filter="url(#wv-blur)"><path d="M-1440,260 C-1200,140 -960,380 -720,260 C-480,140 -240,380 0,260 C240,140 480,380 720,260 C960,140 1200,380 1440,260 C1680,140 1920,380 2160,260 C2400,140 2640,380 2880,260 C3120,140 3360,380 3600,260 C3840,140 4080,380 4320,260" stroke="url(#wv-a)" stroke-width="58" stroke-linecap="round" fill="none"/></g>
    <g class="wave-b" filter="url(#wv-blur)"><path d="M-1440,220 C-1200,120 -960,320 -720,220 C-480,120 -240,320 0,220 C240,120 480,320 720,220 C960,120 1200,320 1440,220 C1680,120 1920,320 2160,220 C2400,120 2640,320 2880,220 C3120,120 3360,320 3600,220 C3840,120 4080,320 4320,220" stroke="url(#wv-c)" stroke-width="34" stroke-linecap="round" fill="none"/></g>
    <g class="wave-a" filter="url(#wv-blur-soft)"><path d="M-1440,205 C-1200,120 -960,290 -720,205 C-480,120 -240,290 0,205 C240,120 480,290 720,205 C960,120 1200,290 1440,205 C1680,120 1920,290 2160,205 C2400,120 2640,290 2880,205 C3120,120 3360,290 3600,205 C3840,120 4080,290 4320,205" stroke="url(#wv-b)" stroke-width="16" stroke-linecap="round" fill="none"/><path d="M-1440,300 C-1200,240 -960,360 -720,300 C-480,240 -240,360 0,300 C240,240 480,360 720,300 C960,240 1200,360 1440,300 C1680,240 1920,360 2160,300 C2400,240 2640,360 2880,300 C3120,240 3360,360 3600,300 C3840,240 4080,360 4320,300" stroke="url(#wv-b)" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.7"/></g>
  </g>
</svg></div>`;

// read a CTA link: authored as <strong><a> (primary) / <em><a> (secondary)
function readLink(scope, wrapTag) {
  const cls = wrapTag === 'strong' ? 'primary' : 'secondary';
  const a = scope.querySelector(`${wrapTag} a`) || scope.querySelector(`a.${cls}`);
  return a ? { href: a.getAttribute('href'), text: a.textContent.trim() } : null;
}

export default function decorate(block) {
  // authored head lives as default content before the block; fall back to first row
  const head = block.closest('.hero-wrapper')?.previousElementSibling
    || block.querySelector(':scope > div');
  const h1El = head?.querySelector('h1');
  const paras = head ? [...head.querySelectorAll('p')] : [];
  const eyebrow = paras[0]?.textContent.trim() || '';
  const strip = paras[1]?.textContent.trim() || '';
  const lede = paras[2]?.textContent.trim() || '';

  // two-tone headline: the final two words become the cyan tone span
  const words = (h1El?.textContent.trim() || '').split(/\s+/);
  const tone = words.slice(-2).join(' ');
  const lead = words.slice(0, -2).join(' ');

  // eyebrow: keep the final segment on one line (decorative nowrap, per prototype)
  const parts = eyebrow.split(' · ');
  let kickerHTML = eyebrow;
  if (parts.length > 1) {
    const last = parts.pop();
    kickerHTML = `${parts.join(' · ')} · <span style="white-space:nowrap">${last}</span>`;
  }

  const primary = readLink(block, 'strong');
  const secondary = readLink(block, 'em');

  const section = document.createElement('section');
  section.className = 'hero';
  section.setAttribute('data-section', 'hero');
  section.setAttribute('data-intent', 'conversion');
  section.setAttribute('data-layout', 'full-bleed-left-anchored');
  section.innerHTML = `${WAVE}
    <div class="wrap">
      <div class="hero-content">
        <p class="kicker">${kickerHTML}</p>
        <h1>${lead} <span class="tone">${tone}</span></h1>
        <p class="hero-strip">${strip}</p>
        <p class="hero-lede">${lede}</p>
        <div class="hero-actions">
          ${primary ? `<a class="btn btn-primary" href="${primary.href}">${primary.text}</a>` : ''}
          ${secondary ? `<a class="text-link" href="${secondary.href}">${secondary.text} <span class="arr" aria-hidden="true">&rarr;</span></a>` : ''}
        </div>
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove('hero');
  head?.remove();
}
