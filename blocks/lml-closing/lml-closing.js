/* lml-closing — local-lander closing CTA band: single measured column with a
   notes row and a hairline meta row (no evidence exhibit — distinct from the
   site-wide two-column closing-cta register). David's Model decode: authored
   head (default content before the block) carries h2 / lede / notes ul / meta
   ul; the block row carries the CTA link (<strong><a> = primary). */

const NAME = 'lml-closing';

function readLink(scope) {
  const a = scope.querySelector('strong a') || scope.querySelector('a.primary') || scope.querySelector('a');
  return a ? { href: a.getAttribute('href'), text: a.textContent.trim() } : null;
}

export default function decorate(block) {
  const head = block.closest(`.${NAME}-wrapper`)?.previousElementSibling;
  const heading = head?.querySelector('h2')?.textContent.trim() || '';
  const lede = head ? [...head.querySelectorAll('p')].find((p) => !p.querySelector('a'))?.textContent.trim() || '' : '';
  const lists = head ? [...head.querySelectorAll('ul')] : [];
  const notes = lists[0]?.innerHTML.trim() || '';
  const meta = lists[1]?.innerHTML.trim() || '';
  const primary = readLink(block);

  const section = document.createElement('section');
  section.className = 'closing';
  section.setAttribute('data-section', 'closing-cta');
  section.setAttribute('data-intent', 'conversion');
  section.setAttribute('data-layout', 'cta-band-local');
  section.innerHTML = `
    <div class="wrap">
      <div data-reveal>
        <h2>${heading}</h2>
        <p class="lede">${lede}</p>
        <div class="closing-actions">
          ${primary ? `<a class="btn btn-primary" href="${primary.href}">${primary.text}</a>` : ''}
        </div>
        <ul class="closing-notes">${notes}</ul>
        ${meta ? `<ul class="closing-notes closing-meta">${meta}</ul>` : ''}
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove(NAME);
  head?.remove();
}
