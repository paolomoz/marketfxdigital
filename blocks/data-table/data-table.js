/* data-table — styled data table in the article flow. Rows: optional single-cell
   caption row first, then a header row, then data rows. First data cell of each
   row is the row header. data-labels drive the ≤640px stacked layout (css). */
export default function decorate(block) {
  const rows = [...block.children];
  const table = document.createElement('table');
  table.className = 'data-table';

  let i = 0;
  if (rows.length && rows[0].children.length === 1) {
    const caption = document.createElement('caption');
    caption.textContent = rows[0].textContent.trim();
    table.append(caption);
    i = 1;
  }

  const headers = rows[i] ? [...rows[i].children].map((c) => c.textContent.trim()) : [];
  const thead = document.createElement('thead');
  const htr = document.createElement('tr');
  headers.forEach((h) => {
    const th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.textContent = h;
    htr.append(th);
  });
  thead.append(htr);
  table.append(thead);

  const tbody = document.createElement('tbody');
  rows.slice(i + 1).forEach((row) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell, ci) => {
      const el = document.createElement(ci === 0 ? 'th' : 'td');
      if (ci === 0) el.setAttribute('scope', 'row');
      el.textContent = cell.textContent.trim();
      if (headers[ci]) el.setAttribute('data-label', headers[ci]);
      tr.append(el);
    });
    tbody.append(tr);
  });
  table.append(tbody);

  block.replaceChildren(table);
  block.classList.remove('data-table');
}
