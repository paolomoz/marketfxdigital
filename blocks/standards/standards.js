/* standards — David's Model decode. This is the About "Standards That Guide
   Every Engagement" 01–04 section. It mirrors the embedded-strategy numbered
   ledger, but adds a kicker eyebrow and emits data-section="standards" (the
   prototype's own section identity), which embedded-strategy.js does not — so it
   is authored as its own thin block. Reuses foundation .ledger-head / .ledger-grid
   / .ledger-row / .ord (styles/styles.css). Ordinals 01–04 are generated here;
   authors supply title + prose per row. No decorative SVG in this section. */

export default function decorate(block) {
  const head = block.closest('.standards-wrapper')?.previousElementSibling;
  const h2Text = head?.querySelector('h2')?.textContent.trim() || '';
  const eyebrow = head?.querySelector('p')?.textContent.trim() || '';

  const rows = [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      title: cells[0]?.textContent.trim() || '',
      prose: cells[1]?.querySelector('p') || cells[1] || null,
    };
  });

  const section = document.createElement('section');
  section.setAttribute('data-section', 'standards');
  section.setAttribute('data-intent', 'trust');
  section.setAttribute('data-layout', 'numbered-ledger');
  section.setAttribute('data-items', String(rows.length));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const headEl = document.createElement('div');
  headEl.className = 'ledger-head';
  headEl.setAttribute('data-reveal', '');
  const kicker = document.createElement('p');
  kicker.className = 'kicker';
  kicker.textContent = eyebrow;
  const h2 = document.createElement('h2');
  h2.textContent = h2Text;
  headEl.append(kicker, h2);

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

  block.replaceChildren(section);
  block.classList.remove('standards');
  head?.remove();
}
