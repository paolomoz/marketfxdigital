/* difference — David's Model decode: reads the authored head (kicker / h2 as
   default content) and column block rows [title, prose], then rebuilds the
   prototype WHITE editorial 3-column section (varied anatomy vs how-built).
   Reuses foundation .band-light / .partner-light / .partner-head / .partner-cols.
   No decorative SVG in this section. */

export default function decorate(block) {
  const head = block.closest('.difference-wrapper')?.previousElementSibling;
  const h2Text = head?.querySelector('h2')?.textContent.trim() || '';
  const eyebrow = head?.querySelector('p')?.textContent.trim() || '';

  const cols = [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      title: cells[0]?.textContent.trim() || '',
      prose: cells[1]?.querySelector('p') || cells[1] || null,
    };
  });

  const section = document.createElement('section');
  section.className = 'band-light partner-light';
  section.setAttribute('data-section', 'difference');
  section.setAttribute('data-intent', 'education');
  section.setAttribute('data-layout', 'editorial-columns');
  section.setAttribute('data-items', String(cols.length));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const headEl = document.createElement('div');
  headEl.className = 'partner-head';
  headEl.setAttribute('data-reveal', '');
  const kicker = document.createElement('p');
  kicker.className = 'kicker';
  kicker.textContent = eyebrow;
  const h2 = document.createElement('h2');
  h2.textContent = h2Text;
  headEl.append(kicker, h2);

  const colsEl = document.createElement('div');
  colsEl.className = 'partner-cols';
  cols.forEach(({ title, prose }) => {
    const col = document.createElement('div');
    col.setAttribute('data-reveal', '');
    const h3 = document.createElement('h3');
    h3.textContent = title;
    const p = document.createElement('p');
    if (prose) p.append(...prose.childNodes);
    col.append(h3, p);
    colsEl.append(col);
  });

  wrap.append(headEl, colsEl);
  section.append(wrap);

  block.replaceChildren(section);
  block.classList.remove('difference');
  head?.remove();
}
