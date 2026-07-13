/* cmp-table — side-by-side comparison table as a paper card on the dark ground
   (home comparison-table language, comparison-editorial register). Unlike the home
   `comparison` block this is a plain 3-column matrix (no ✓/✗ marks) and it ships
   the live page's own mobile treatment: below 680px rows stack into per-row cards
   with column labels (no unsignposted horizontal scroll).
   Authored default content BEFORE the block: kicker <p> + <h2> (+ optional lede).
   Block rows: first row = column headers; each further row = one dimension
   [row header, col-2 value, col-3 value]. The last column renders as the
   highlighted .col-fx column. An `anchor-<id>` variant sets the section id. */

const NAME = 'cmp-table';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

export default function decorate(block) {
  const wrapper = block.closest(`.${NAME}-wrapper`) || block.parentElement;
  const prev = wrapper.previousElementSibling;
  const head = prev && prev.classList.contains('default-content-wrapper') ? prev : null;
  const anchor = [...block.classList].find((c) => c.startsWith('anchor-'));

  const [headerRow, ...dataRows] = [...block.children];
  const headers = headerRow ? [...headerRow.children].map((c) => c.textContent.trim()) : [];
  const last = headers.length - 1;

  const section = document.createElement('section');
  if (anchor) section.id = anchor.slice('anchor-'.length);
  section.setAttribute('data-section', 'comparison');
  section.setAttribute('data-intent', 'differentiation');
  section.setAttribute('data-layout', 'paper-card-table');
  section.setAttribute('data-items', String(dataRows.length));

  const wrap = el('div', 'wrap');
  const card = el('div', 'compare-card');
  card.setAttribute('data-reveal', '');

  if (head) {
    const kicker = head.querySelector('p');
    const h2 = head.querySelector('h2');
    if (kicker) card.append(el('p', 'kicker', kicker.textContent.trim()));
    if (h2) card.append(el('h2', null, h2.textContent.trim()));
    [...head.querySelectorAll('p')].slice(1).forEach((p) => {
      const lede = el('p', 'lede');
      lede.append(...p.childNodes);
      card.append(lede);
    });
    head.remove();
  }

  const scroll = el('div', 'table-scroll');
  const table = el('table', 'cmpt');
  const caption = document.createElement('caption');
  caption.textContent = `Comparison of ${headers.slice(1).join(' and ')} by ${headers[0] || 'dimension'}`;
  table.append(caption);

  const thead = document.createElement('thead');
  const htr = document.createElement('tr');
  headers.forEach((text, i) => {
    const th = el('th', i === last ? 'col-fx' : null, text);
    th.setAttribute('scope', 'col');
    htr.append(th);
  });
  thead.append(htr);
  table.append(thead);

  const tbody = document.createElement('tbody');
  dataRows.forEach((row) => {
    const cells = [...row.children];
    const tr = document.createElement('tr');
    const th = el('th', null, cells[0] ? cells[0].textContent.trim() : '');
    th.setAttribute('scope', 'row');
    tr.append(th);
    cells.slice(1).forEach((cell, i) => {
      const td = el('td', i + 1 === last ? 'col-fx' : null, cell.textContent.trim());
      td.setAttribute('data-label', headers[i + 1] || '');
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);

  scroll.append(table);
  card.append(scroll);
  wrap.append(card);
  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
}
