/* audit-ledger — David's Model decode for the template's numbered ledger
   (the page's one true sequence: audit steps, framework stages, deliverables).
   Row grammar:
     1 cell  (first row) = band head: optional kicker <p>, heading, prose <p>s
     2 cells             = step [title, prose] — ordinals are baked here
     3 cells             = deliverable exhibit [tag, prose, CTA link]
   Variants: `padded` renders 01…N ordinals (pages whose captured sequence uses
   zero-padded markers); `anchor-<id>` sets the section id (e.g. #deliverables). */

const NAME = 'audit-ledger';

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
  return `<div class="ledger-head" data-reveal>
      ${kicker ? `<p class="kicker">${kicker}</p>` : ''}
      ${heading ? `<h2>${heading.innerHTML}</h2>` : ''}
      ${out.join('\n      ')}
    </div>`;
}

export default function decorate(block) {
  const padded = block.classList.contains('padded');
  const id = anchorId(block);
  const rows = [...block.children];

  let head = '';
  const steps = [];
  let deliverable = '';
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && !head && !steps.length) {
      head = headHtml(cells[0]);
      return;
    }
    if (cells.length >= 3) {
      const a = cells[2].querySelector('a');
      deliverable = `<div class="deliverable" data-reveal>
          <span class="tag">${cells[0].textContent.trim()}</span>
          <p>${cells[1].textContent.trim()}</p>
          ${a ? `<a class="btn btn-primary" href="${a.getAttribute('href')}">${a.textContent.trim()}</a>` : ''}
        </div>`;
      return;
    }
    steps.push({
      title: cells[0] ? cells[0].textContent.trim() : '',
      prose: cells[1] ? cells[1].innerHTML.trim() : '',
    });
  });

  const stepHtml = steps.map((s, i) => `<div class="ledger-row" data-reveal>
        <span class="ord" aria-hidden="true">${padded ? String(i + 1).padStart(2, '0') : i + 1}</span>
        <div>
          <h3>${s.title}</h3>
          ${s.prose}
        </div>
      </div>`).join('\n      ');

  const section = document.createElement('section');
  section.className = 'audit-ledger';
  if (id) section.id = id;
  section.setAttribute('data-section', 'audit-ledger');
  section.setAttribute('data-intent', 'process');
  section.setAttribute('data-layout', 'numbered-ledger-2col');
  section.setAttribute('data-items', String(steps.length));
  section.innerHTML = `
    <div class="wrap">
      ${head}
      <div class="ledger-grid">
        ${stepHtml}
        ${deliverable}
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove(NAME);
}
