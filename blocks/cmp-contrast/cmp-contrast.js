/* cmp-contrast — asymmetric facing definition panels on paper (comparison-editorial).
   Two block rows, one per column: [kicker, <h2>, body (multiple <p>)].
   Column 1 renders as the fragmented register (each paragraph a dashed shard,
   broken rhythm); column 2 as the integrated register (one coherent cyan panel,
   first paragraph leads). All copy authored; shards/panel are presentation. */

const NAME = 'cmp-contrast';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function movePara(p) {
  const out = document.createElement('p');
  out.append(...p.childNodes);
  return out;
}

export default function decorate(block) {
  const rows = [...block.children];

  const section = document.createElement('section');
  section.className = 'band-light';
  section.setAttribute('data-section', 'definition-contrast');
  section.setAttribute('data-intent', 'explanation');
  section.setAttribute('data-layout', 'asymmetric-facing-panels');
  section.setAttribute('data-items', String(rows.length));

  const wrap = el('div', 'wrap');
  const grid = el('div', 'contrast-grid');

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const frag = i === 0;
    const col = el('div', `contrast-col${frag ? ' panel-frag' : ''}`);
    col.setAttribute('data-reveal', '');
    const kicker = cells[0]?.textContent.trim();
    if (kicker) col.append(el('p', 'kicker', kicker));
    const h2 = cells[1]?.querySelector('h2') || cells[1];
    if (h2) col.append(el('h2', null, h2.textContent.trim()));
    const paras = cells[2] ? [...cells[2].querySelectorAll('p')] : [];
    if (frag) {
      paras.forEach((p) => {
        const shard = el('div', 'shard');
        shard.append(movePara(p));
        col.append(shard);
      });
    } else {
      const panel = el('div', 'panel-int');
      paras.forEach((p, j) => {
        const out = movePara(p);
        if (j === 0) out.className = 'lead';
        panel.append(out);
      });
      col.append(panel);
    }
    grid.append(col);
  });

  wrap.append(grid);
  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
}
