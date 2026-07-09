/* comparison — David's-Model decode: authored default-content head (h2 + lede) and a
   block whose first row is the column header and each following row is a comparison
   dimension. The ✓/✗ marks are generated here from cell markers ("yes"/"no"); any other
   text is a verbatim partial state. Caption + aria-labels (a11y) are baked. */

const NAME = 'comparison';
const CAPTION = 'Comparison of marketFX and siloed providers across growth capabilities';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function defaultContentBefore(block) {
  const wrapper = block.closest(`.${NAME}-wrapper`) || block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  return prev && prev.classList.contains('default-content-wrapper') ? prev : null;
}

function mark(text, fx) {
  const value = text.trim();
  const td = document.createElement('td');
  if (fx) td.className = 'col-fx';
  if (/^yes$/i.test(value)) {
    const span = el('span', 'yes');
    span.setAttribute('aria-label', 'Included');
    span.innerHTML = '&#10003;';
    td.append(span);
  } else if (/^no$/i.test(value)) {
    const span = el('span', 'no');
    span.setAttribute('aria-label', 'Not included');
    span.innerHTML = '&#10005;';
    td.append(span);
  } else {
    td.append(el('span', 'partial', value));
  }
  return td;
}

export default function decorate(block) {
  const rows = [...block.children];
  const dc = defaultContentBefore(block);
  const head = dc ? [...dc.children] : [];

  const section = document.createElement('section');
  section.setAttribute('data-section', NAME);
  section.setAttribute('data-intent', 'differentiation');
  section.setAttribute('data-layout', 'contained-table');
  section.setAttribute('data-items', '8');

  const wrap = el('div', 'wrap');
  const card = el('div', 'compare-card');
  card.setAttribute('data-reveal', '');
  const h2 = head.find((n) => n.tagName === 'H2');
  const lede = head.find((n) => n.tagName === 'P');
  if (h2) card.append(el('h2', null, h2.textContent));
  if (lede) card.append(el('p', 'lede', lede.textContent));

  const scroll = el('div', 'table-scroll');
  const table = el('table', 'compare');
  const caption = document.createElement('caption');
  caption.textContent = CAPTION;
  table.append(caption);

  // header row
  const [headerRow, ...dataRows] = rows;
  const thead = document.createElement('thead');
  const htr = document.createElement('tr');
  [...headerRow.children].forEach((cell, i) => {
    const th = el('th', i === 1 ? 'col-fx' : null, cell.textContent.trim());
    th.setAttribute('scope', 'col');
    htr.append(th);
  });
  thead.append(htr);
  table.append(thead);

  // data rows: [dimension, marketFX, siloed, means]
  const tbody = document.createElement('tbody');
  dataRows.forEach((row) => {
    const cells = [...row.children];
    const tr = document.createElement('tr');
    const rowTh = el('th', null, cells[0] ? cells[0].textContent.trim() : '');
    rowTh.setAttribute('scope', 'row');
    tr.append(rowTh);
    tr.append(mark(cells[1] ? cells[1].textContent : '', true));
    tr.append(mark(cells[2] ? cells[2].textContent : '', false));
    tr.append(el('td', 'means', cells[3] ? cells[3].textContent.trim() : ''));
    tbody.append(tr);
  });
  table.append(tbody);

  scroll.append(table);
  card.append(scroll);
  wrap.append(card);
  section.append(wrap);

  block.replaceChildren(section);
  block.classList.remove(NAME);
  if (dc) dc.remove();
}
