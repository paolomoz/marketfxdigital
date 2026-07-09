/* about-hero — David's Model decode: reads the authored head (kicker / h1 / lede
   as default content) and rebuilds the prototype compact dark hero. No wave, no
   decorative SVG in this section; the dot-grid + cyan glow are CSS pseudo-elements
   (styles/styles.css, .hero + .hero[data-layout="compact"]). */

export default function decorate(block) {
  const head = block.closest('.about-hero-wrapper')?.previousElementSibling
    || block.querySelector(':scope > div');
  const h1El = head?.querySelector('h1');
  const paras = head ? [...head.querySelectorAll('p')] : [];
  const eyebrow = paras[0]?.textContent.trim() || '';
  const lede = paras[1] || null;

  const section = document.createElement('section');
  section.className = 'hero';
  section.setAttribute('data-section', 'hero');
  section.setAttribute('data-intent', 'orientation');
  section.setAttribute('data-layout', 'compact');

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const content = document.createElement('div');
  content.className = 'hero-content';
  content.setAttribute('data-reveal', '');

  const kicker = document.createElement('p');
  kicker.className = 'kicker';
  kicker.textContent = eyebrow;

  const h1 = document.createElement('h1');
  h1.textContent = h1El?.textContent.trim() || '';

  const ledeP = document.createElement('p');
  ledeP.className = 'hero-lede';
  if (lede) ledeP.append(...lede.childNodes);

  content.append(kicker, h1, ledeP);
  wrap.append(content);
  section.append(wrap);

  block.replaceChildren(section);
  block.classList.remove('about-hero');
  head?.remove();
}
