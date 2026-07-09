/* values — David's Model decode: reads the authored head (kicker / h2 as default
   content) and value block rows [name, description], then rebuilds the prototype
   WHITE compact 5-up chip row. No decorative SVG in this section. */

export default function decorate(block) {
  const head = block.closest('.values-wrapper')?.previousElementSibling;
  const h2Text = head?.querySelector('h2')?.textContent.trim() || '';
  const eyebrow = head?.querySelector('p')?.textContent.trim() || '';

  const chips = [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      title: cells[0]?.textContent.trim() || '',
      desc: cells[1]?.querySelector('p') || cells[1] || null,
    };
  });

  const section = document.createElement('section');
  section.className = 'band-light';
  section.setAttribute('data-section', 'values');
  section.setAttribute('data-intent', 'trust');
  section.setAttribute('data-layout', 'five-chip-row');
  section.setAttribute('data-items', String(chips.length));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const headEl = document.createElement('div');
  headEl.className = 'center-measure';
  headEl.setAttribute('data-reveal', '');
  const kicker = document.createElement('p');
  kicker.className = 'kicker';
  kicker.textContent = eyebrow;
  const h2 = document.createElement('h2');
  h2.textContent = h2Text;
  headEl.append(kicker, h2);

  const row = document.createElement('ul');
  row.className = 'value-row';
  chips.forEach(({ title, desc }) => {
    const li = document.createElement('li');
    li.className = 'value-chip';
    li.setAttribute('data-reveal', '');
    const h3 = document.createElement('h3');
    h3.textContent = title;
    const p = document.createElement('p');
    if (desc) p.append(...desc.childNodes);
    li.append(h3, p);
    row.append(li);
  });

  wrap.append(headEl, row);
  section.append(wrap);

  block.replaceChildren(section);
  block.classList.remove('values');
  head?.remove();
}
