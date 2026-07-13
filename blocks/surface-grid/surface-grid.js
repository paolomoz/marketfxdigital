/* surface-grid — David's Model decode for the template's ruled-column band
   (surfaces / gotchas / problems-we-find / deliverables / who-this-is-for).
   White paper band by default — the template's rhythm break; no icon-card wall.
   Row grammar:
     1 cell  (first row) = band head: optional kicker <p>, heading, prose <p>s
     2 cells             = column [title, body]        (body keeps <p>/<ul> markup)
     3 cells             = column [eyebrow, title, body]
   Variants: `dark` (stays on the dark field), `dim` (paper-dim), `cols-2` /
   `cols-4` (column count; 3 is the default), `anchor-<id>` sets the section id. */

const NAME = 'surface-grid';

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
  return `<div class="surface-head" data-reveal>
      ${kicker ? `<p class="kicker">${kicker}</p>` : ''}
      ${heading ? `<h2>${heading.innerHTML}</h2>` : ''}
      ${out.join('\n      ')}
    </div>`;
}

export default function decorate(block) {
  const dark = block.classList.contains('dark');
  const dim = block.classList.contains('dim');
  const cols = [...block.classList].find((c) => c.startsWith('cols-'));
  const id = anchorId(block);
  const rows = [...block.children];

  let head = '';
  const items = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && !head && !items.length) {
      head = headHtml(cells[0]);
      return;
    }
    const three = cells.length >= 3;
    items.push({
      eyebrow: three ? cells[0].textContent.trim() : '',
      title: (three ? cells[1] : cells[0])?.textContent.trim() || '',
      body: (three ? cells[2] : cells[1])?.innerHTML.trim() || '',
    });
  });

  const colHtml = items.map((it) => `<div data-reveal>
        ${it.eyebrow ? `<p class="sg-eyebrow">${it.eyebrow}</p>` : ''}
        <h3>${it.title}</h3>
        <div class="sg-body">${it.body}</div>
      </div>`).join('\n      ');

  const section = document.createElement('section');
  section.className = `surface-grid${dark ? ' sg-dark' : ' band-light'}${dim ? ' band-dim' : ''}${cols ? ` sg-${cols}` : ''}`;
  if (id) section.id = id;
  section.setAttribute('data-section', 'surface-grid');
  section.setAttribute('data-intent', 'capability-detail');
  section.setAttribute('data-layout', 'ruled-columns');
  section.setAttribute('data-items', String(items.length));
  section.innerHTML = `
    <div class="wrap">
      ${head}
      <div class="surface-cols">
        ${colHtml}
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove(NAME);
}
