/* approach-steps — David's Model: head, step text (title/prose/tag) and closing prose+CTA
   authored in DA content; ordinals + decorative laser connector SVG generated/baked here. */

const CONN = '<svg class="step-conn" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" focusable="false"><line x1="0" y1="5" x2="92" y2="5" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4"/><polyline points="86,1 94,5 86,9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle r="2.5" fill="var(--signal)" class="step-laser"><animateMotion dur="2.4s" repeatCount="indefinite" path="M 0 5 L 92 5"/></circle></svg>';

function readHead(block) {
  const dc = block.closest('.approach-steps-wrapper')?.previousElementSibling;
  if (!dc || dc.querySelector('.block')) return null;
  const kids = [...dc.children];
  const h = dc.querySelector('h1, h2, h3');
  const hi = h ? kids.indexOf(h) : -1;
  const kicker = kids.find((n, i) => n.tagName === 'P' && (hi === -1 || i < hi));
  const data = { kicker: kicker?.textContent.trim() || '', heading: h?.textContent.trim() || '' };
  dc.remove();
  return data;
}

function readClose(block) {
  const dc = block.closest('.approach-steps-wrapper')?.nextElementSibling;
  if (!dc || !dc.classList.contains('default-content-wrapper')) return null;
  const p = dc.querySelector('p');
  const a = dc.querySelector('a');
  const data = {
    prose: p?.textContent.trim() || '',
    cta: a ? { href: a.getAttribute('href'), text: a.textContent.trim() } : null,
  };
  dc.remove();
  return data;
}

export default function decorate(block) {
  const head = readHead(block);
  const close = readClose(block);

  // Each block row = one step: cell 1 = title, cell 2 = prose, cell 3 = tag.
  const steps = [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      title: cells[0]?.textContent.trim() || '',
      prose: cells[1]?.textContent.trim() || '',
      tag: cells[2]?.textContent.trim() || '',
    };
  }).filter((s) => s.title || s.prose);

  const stepLi = (s, i, arr) => `<li class="step" data-reveal>
          ${i < arr.length - 1 ? CONN : ''}
          <span class="ord" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          <h3>${s.title}</h3>
          <p>${s.prose}</p>
          ${s.tag ? `<span class="tag">${s.tag}</span>` : ''}
        </li>`;

  const section = document.createElement('section');
  section.setAttribute('data-section', 'approach-steps');
  section.setAttribute('data-intent', 'process');
  section.setAttribute('data-layout', 'stepped-rail');
  section.innerHTML = `
    <div class="wrap">
      <div class="steps-head" data-reveal>
        ${head?.kicker ? `<p class="kicker">${head.kicker}</p>` : ''}
        ${head?.heading ? `<h2>${head.heading}</h2>` : ''}
      </div>
      <ol class="steps-rail">
        ${steps.map(stepLi).join('\n        ')}
      </ol>
      ${close ? `<div class="steps-close" data-reveal>
        ${close.prose ? `<p>${close.prose}</p>` : ''}
        ${close.cta ? `<a class="text-link" href="${close.cta.href}">${close.cta.text} <span class="arr" aria-hidden="true">&rarr;</span></a>` : ''}
      </div>` : ''}
    </div>`;

  block.replaceChildren(section);
  block.classList.remove('approach-steps');
}
