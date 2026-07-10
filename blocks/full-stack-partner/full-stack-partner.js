/* full-stack-partner — decodes authored content (DA / David's Model) and
   rebuilds the prototype section. */
export default function decorate(block) {
  const head = block.closest('.full-stack-partner-wrapper')?.previousElementSibling;
  const h2Text = head?.querySelector('h2')?.textContent.trim() || '';

  const cols = [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      title: cells[0]?.textContent.trim() || '',
      prose: cells[1]?.querySelector('p') || cells[1] || null,
    };
  });

  const section = document.createElement('section');
  section.className = 'band-light partner-light';
  section.setAttribute('data-section', 'full-stack-partner');
  section.setAttribute('data-intent', 'positioning');
  section.setAttribute('data-layout', 'editorial-3col');
  section.setAttribute('data-items', String(cols.length));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const headEl = document.createElement('div');
  headEl.className = 'partner-head';
  headEl.setAttribute('data-reveal', '');
  const h2 = document.createElement('h2');
  h2.textContent = h2Text;
  headEl.append(h2);

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

  head?.remove();
  block.replaceChildren(section);
  block.classList.remove('full-stack-partner');
}
