/* intro-band — David's Model decode for the recurring kicker/heading/prose band
   (Definition, Pairs Well With, The Full Lifecycle, …) on the solution-audit-lander
   template. All content authored in ONE block cell: optional kicker <p>, one
   heading, prose <p>s (inline links preserved), optional <ul> (checklist by
   default, pill chips with the `chips` variant) and CTA lines (<strong><a> =
   primary button, <em><a> = arrow text-link, plain link runs = text-links).
   Variants: `light` (paper band), `chips`. `anchor-<id>` sets the section id. */

const NAME = 'intro-band';

function anchorId(block) {
  const v = [...block.classList].find((c) => c.startsWith('anchor-'));
  return v ? v.slice('anchor-'.length) : '';
}

// a paragraph is a CTA/actions line when its visible text is only link text
// (allowing separator glyphs the scraper kept between links)
function isActionsP(p) {
  const links = [...p.querySelectorAll('a')];
  if (!links.length) return false;
  const linkText = links.map((a) => a.textContent).join('');
  const bare = p.textContent.replace(/[\s·•|,]/g, '');
  return bare.length <= linkText.replace(/\s/g, '').length + 4;
}

function renderAction(a, wrapTag) {
  const href = a.getAttribute('href') || '#';
  const text = a.textContent.trim();
  if (wrapTag === 'strong') return `<a class="btn btn-primary" href="${href}">${text}</a>`;
  return `<a class="text-link" href="${href}">${text} <span class="arr" aria-hidden="true">&rarr;</span></a>`;
}

export default function decorate(block) {
  const light = block.classList.contains('light');
  const chips = block.classList.contains('chips');
  const id = anchorId(block);
  const cell = block.querySelector(':scope > div > div') || block;
  const kids = [...cell.children];

  const heading = kids.find((n) => /^H[1-4]$/.test(n.tagName)) || null;
  const hIdx = heading ? kids.indexOf(heading) : -1;

  let kicker = '';
  const body = [];
  const actions = [];
  let list = null;
  kids.forEach((n, i) => {
    if (n === heading) return;
    if (n.tagName === 'UL' || n.tagName === 'OL') { list = n; return; }
    if (n.tagName !== 'P') { body.push(n.outerHTML); return; }
    if (n.querySelector('strong a')) {
      actions.push(renderAction(n.querySelector('strong a'), 'strong'));
      return;
    }
    if (n.querySelector('em a')) {
      actions.push(renderAction(n.querySelector('em a'), 'em'));
      return;
    }
    if (isActionsP(n)) {
      [...n.querySelectorAll('a')].forEach((a) => actions.push(renderAction(a, 'em')));
      return;
    }
    if (!kicker && !n.querySelector('a') && (hIdx === -1 || i < hIdx)) {
      kicker = n.textContent.trim();
      return;
    }
    body.push(`<p>${n.innerHTML}</p>`);
  });

  let listHtml = '';
  if (list) {
    // items whose captured text already leads with a list glyph (✓ — – •) keep
    // it verbatim; don't bake a second mark in front of those
    const items = [...list.children].map((li) => {
      const glyphed = /^[✓✔—–•]/.test(li.textContent.trim());
      if (chips) return `<li>${li.innerHTML}</li>`;
      if (glyphed) return `<li class="ib-bare">${li.innerHTML}</li>`;
      return `<li><span class="tick" aria-hidden="true">&#10003;</span><span>${li.innerHTML}</span></li>`;
    }).join('');
    listHtml = `<ul class="${chips ? 'ib-chips' : 'ib-list'}" data-reveal>${items}</ul>`;
  }

  const section = document.createElement('section');
  section.className = light ? 'intro-band band-light' : 'intro-band';
  if (id) section.id = id;
  section.setAttribute('data-section', 'intro-band');
  section.setAttribute('data-intent', 'context');
  section.setAttribute('data-layout', 'editorial-head');
  section.innerHTML = `
    <div class="wrap">
      <div class="ib-head" data-reveal>
        ${kicker ? `<p class="kicker">${kicker}</p>` : ''}
        ${heading ? `<h2>${heading.innerHTML}</h2>` : ''}
        ${body.join('\n        ')}
      </div>
      ${listHtml}
      ${actions.length ? `<div class="ib-actions" data-reveal>${actions.join('\n        ')}</div>` : ''}
    </div>`;

  block.replaceChildren(section);
  block.classList.remove(NAME);
}
