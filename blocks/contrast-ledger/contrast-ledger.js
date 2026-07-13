/* contrast-ledger — David's Model decode for the two-column contrast band
   (decision-grade vs vanity metrics; typical agency vs marketFX; SEO vs GEO
   buyer journey). Dark ground, ruled checklists, the first column carries the
   signal treatment.
   Row grammar:
     1 cell  (first row) = band head: optional kicker <p>, heading, prose <p>s
     2 cells             = column [title, list]        (<ul>/<ol> in the cell)
     3 cells             = column [eyebrow, title, list]
   Variants: `flip` moves the signal treatment to the LAST column; `plain`
   drops the tick/dash marks (neutral comparisons, e.g. journey steps). */

const NAME = 'contrast-ledger';

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
  return `<div class="sn-head" data-reveal>
      ${kicker ? `<p class="kicker">${kicker}</p>` : ''}
      ${heading ? `<h2>${heading.innerHTML}</h2>` : ''}
      ${out.join('\n      ')}
    </div>`;
}

export default function decorate(block) {
  const flip = block.classList.contains('flip');
  const plain = block.classList.contains('plain');
  const rows = [...block.children];

  let head = '';
  const cols = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && !head && !cols.length) {
      head = headHtml(cells[0]);
      return;
    }
    const three = cells.length >= 3;
    const listCell = three ? cells[2] : cells[1];
    cols.push({
      eyebrow: three ? cells[0].textContent.trim() : '',
      title: (three ? cells[1] : cells[0])?.textContent.trim() || '',
      items: listCell ? [...listCell.querySelectorAll('li')].map((li) => li.innerHTML.trim()) : [],
    });
  });

  const colHtml = cols.map((col, i) => {
    const signal = !plain && (flip ? i === cols.length - 1 : i === 0);
    const mark = signal
      ? '<span class="tick" aria-hidden="true">&#10003;</span>'
      : '<span class="dash" aria-hidden="true">&ndash;</span>';
    const items = col.items.map((it) => `<li>${plain ? '' : mark}<span>${it}</span></li>`).join('');
    return `<div class="sn-col${signal ? ' sn-signal' : ''}" data-reveal>
        ${col.eyebrow ? `<p class="sn-eyebrow">${col.eyebrow}</p>` : ''}
        <h3>${col.title}</h3>
        <ul class="sn-list${plain ? ' sn-plain' : ''}">${items}</ul>
      </div>`;
  }).join('\n      ');

  const section = document.createElement('section');
  section.className = 'contrast-ledger';
  section.setAttribute('data-section', 'contrast-ledger');
  section.setAttribute('data-intent', 'differentiation');
  section.setAttribute('data-layout', 'contrast-ledger-2col');
  section.setAttribute('data-items', String(cols.reduce((n, c) => n + c.items.length, 0)));
  section.innerHTML = `
    <div class="wrap">
      ${head}
      <div class="sn-table" data-reveal>
      ${colHtml}
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove(NAME);
}
