/* engagement-tiers — David's Model decode for the ruled pricing-tier band
   (template band 6). Paper-dim ground, three ruled columns with pricing-model
   lines. Row grammar:
     1 cell  (first row) = band head: optional kicker <p>, heading, prose <p>s
     3 cells             = tier [title, price line, prose]
     2 cells             = tier [title, prose] (no price line)
   Variants: `anchor-<id>` sets the section id (e.g. #engagement). */

const NAME = 'engagement-tiers';

function anchorId(block) {
  const v = [...block.classList].find((c) => c.startsWith('anchor-'));
  return v ? v.slice('anchor-'.length) : '';
}

function headHtml(cell) {
  if (!cell) return '';
  const kids = [...cell.children];
  const heading = kids.find((n) => /^H[1-4]$/.test(n.tagName));
  const hIdx = heading ? kids.indexOf(heading) : -1;
  const out = [];
  let kicker = '';
  kids.forEach((n, i) => {
    if (n === heading) return;
    if (!kicker && n.tagName === 'P' && !n.querySelector('a') && (hIdx === -1 || i < hIdx)) {
      kicker = n.textContent.trim();
      return;
    }
    out.push(n.tagName === 'P' ? `<p>${n.innerHTML}</p>` : n.outerHTML);
  });
  return `<div class="tiers-head" data-reveal>
      ${kicker ? `<p class="kicker">${kicker}</p>` : ''}
      ${heading ? `<h2>${heading.innerHTML}</h2>` : ''}
      ${out.join('\n      ')}
    </div>`;
}

export default function decorate(block) {
  const id = anchorId(block);
  const rows = [...block.children];

  let head = '';
  const tiers = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && !head && !tiers.length) {
      head = headHtml(cells[0]);
      return;
    }
    const three = cells.length >= 3;
    tiers.push({
      title: cells[0] ? cells[0].textContent.trim() : '',
      price: three ? cells[1].textContent.trim() : '',
      prose: (three ? cells[2] : cells[1])?.innerHTML.trim() || '',
    });
  });

  const tierHtml = tiers.map((t) => `<div class="tier" data-reveal>
        <h3>${t.title}</h3>
        ${t.price ? `<span class="price">${t.price}</span>` : ''}
        ${t.prose}
      </div>`).join('\n      ');

  const section = document.createElement('section');
  section.className = 'engagement-tiers band-light band-dim';
  if (id) section.id = id;
  section.setAttribute('data-section', 'engagement-tiers');
  section.setAttribute('data-intent', 'pricing');
  section.setAttribute('data-layout', 'ruled-tiers');
  section.setAttribute('data-items', String(tiers.length));
  section.innerHTML = `
    <div class="wrap">
      ${head}
      <div class="tiers">
        ${tierHtml}
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove(NAME);
}
