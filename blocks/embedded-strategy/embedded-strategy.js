/* embedded-strategy — decodes authored content (DA / David's Model) and rebuilds the prototype section.
   Ordinals (01–04) are generated here; authors only supply title + prose per row. */
export default function decorate(block) {
  const head = block.closest('.embedded-strategy-wrapper')?.previousElementSibling;
  const h2Text = head?.querySelector('h2')?.textContent.trim() || '';
  const ledeEl = head?.querySelector('p') || null;

  const rows = [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      title: cells[0]?.textContent.trim() || '',
      prose: cells[1]?.querySelector('p') || cells[1] || null,
    };
  });

  const section = document.createElement('section');
  section.setAttribute('data-section', 'embedded-strategy');
  section.setAttribute('data-intent', 'differentiation');
  section.setAttribute('data-layout', 'numbered-ledger-2x2');
  section.setAttribute('data-items', String(rows.length));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const headEl = document.createElement('div');
  headEl.className = 'ledger-head';
  headEl.setAttribute('data-reveal', '');
  const h2 = document.createElement('h2');
  h2.textContent = h2Text;
  headEl.append(h2);
  if (ledeEl) {
    const lede = document.createElement('p');
    lede.className = 'lede';
    lede.append(...ledeEl.childNodes);
    headEl.append(lede);
  }

  const grid = document.createElement('div');
  grid.className = 'ledger-grid';
  rows.forEach(({ title, prose }, i) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'ledger-row';
    rowEl.setAttribute('data-reveal', '');
    const ord = document.createElement('span');
    ord.className = 'ord';
    ord.setAttribute('aria-hidden', 'true');
    ord.textContent = String(i + 1).padStart(2, '0');
    const body = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = title;
    const p = document.createElement('p');
    if (prose) p.append(...prose.childNodes);
    body.append(h3, p);
    rowEl.append(ord, body);
    grid.append(rowEl);
  });

  wrap.append(headEl, grid);
  section.append(wrap);

  head?.remove();
  block.replaceChildren(section);
  block.classList.remove('embedded-strategy');
}
