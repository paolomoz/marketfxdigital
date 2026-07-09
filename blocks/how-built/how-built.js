/* how-built — David's Model decode: reads the authored head (kicker / h2 / lede
   as default content) and card block rows [title, prose], then rebuilds the
   prototype DARK three-card grid on the foundation .cap-card treatment. No
   decorative SVG in this section. */

export default function decorate(block) {
  const head = block.closest('.how-built-wrapper')?.previousElementSibling;
  const h2Text = head?.querySelector('h2')?.textContent.trim() || '';
  const paras = head ? [...head.querySelectorAll('p')] : [];
  const eyebrow = paras[0]?.textContent.trim() || '';
  const ledeEl = paras[1] || null;

  const cards = [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      title: cells[0]?.textContent.trim() || '',
      prose: cells[1]?.querySelector('p') || cells[1] || null,
    };
  });

  const section = document.createElement('section');
  section.setAttribute('data-section', 'how-built');
  section.setAttribute('data-intent', 'education');
  section.setAttribute('data-layout', 'three-card-grid');
  section.setAttribute('data-items', String(cards.length));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const headEl = document.createElement('div');
  headEl.className = 'built-head';
  headEl.setAttribute('data-reveal', '');
  const kicker = document.createElement('p');
  kicker.className = 'kicker';
  kicker.textContent = eyebrow;
  const h2 = document.createElement('h2');
  h2.textContent = h2Text;
  headEl.append(kicker, h2);
  if (ledeEl) {
    const lede = document.createElement('p');
    lede.className = 'lede';
    lede.append(...ledeEl.childNodes);
    headEl.append(lede);
  }

  const grid = document.createElement('ul');
  grid.className = 'cards-3';
  cards.forEach(({ title, prose }) => {
    const li = document.createElement('li');
    li.className = 'cap-card';
    li.setAttribute('data-reveal', '');
    const h3 = document.createElement('h3');
    h3.textContent = title;
    const p = document.createElement('p');
    if (prose) p.append(...prose.childNodes);
    li.append(h3, p);
    grid.append(li);
  });

  wrap.append(headEl, grid);
  section.append(wrap);

  block.replaceChildren(section);
  block.classList.remove('how-built');
  head?.remove();
}
