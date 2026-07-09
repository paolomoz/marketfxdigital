/* closing-cta — David's Model decode: reads the authored head + CTAs + notes
   list (default content) and the exhibit block row [value, source], then
   rebuilds the prototype two-column closing band. The dot-grid + glow are CSS
   pseudo-elements (styles/styles.css) — no baked SVG needed. */

function readLink(scope, wrapTag) {
  const cls = wrapTag === 'strong' ? 'primary' : 'secondary';
  const a = scope.querySelector(`${wrapTag} a`) || scope.querySelector(`a.${cls}`);
  return a ? { href: a.getAttribute('href'), text: a.textContent.trim() } : null;
}

export default function decorate(block) {
  const head = block.closest('.closing-cta-wrapper')?.previousElementSibling;
  const heading = head?.querySelector('h2')?.textContent.trim() || '';
  const noLink = head ? [...head.querySelectorAll('p')].filter((p) => !p.querySelector('a')) : [];
  const eyebrow = noLink[0]?.textContent.trim() || '';
  const lede = noLink[1]?.textContent.trim() || '';
  const notes = head?.querySelector('ul')?.innerHTML.trim() || '';

  const primary = readLink(head || block, 'strong');
  const secondary = readLink(head || block, 'em');

  // exhibit-ember evidence panel = the block row [value, source]
  const row = block.querySelector(':scope > div');
  const cells = row ? [...row.children] : [];
  const val = cells[0]?.innerHTML.trim() || '';
  const src = cells[1]?.textContent.trim() || '';

  const section = document.createElement('section');
  section.className = 'closing';
  section.setAttribute('data-section', 'closing-cta');
  section.setAttribute('data-intent', 'conversion');
  section.setAttribute('data-layout', 'cta-band');
  section.innerHTML = `
    <div class="wrap">
      <div data-reveal>
        <p class="kicker">${eyebrow}</p>
        <h2>${heading}</h2>
        <p class="lede">${lede}</p>
        <div class="closing-actions">
          ${primary ? `<a class="btn btn-primary" href="${primary.href}">${primary.text}</a>` : ''}
          ${secondary ? `<a class="text-link" href="${secondary.href}">${secondary.text} <span class="arr" aria-hidden="true">&rarr;</span></a>` : ''}
        </div>
        <ul class="closing-notes">
          ${notes}
        </ul>
      </div>
      <div class="exhibit-ember" data-reveal>
        <span class="val">${val}</span>
        <span class="src">${src}</span>
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove('closing-cta');
  head?.remove();
}
