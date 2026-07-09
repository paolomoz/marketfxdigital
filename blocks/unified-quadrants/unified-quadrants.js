/* unified-quadrants — David's-Model decode: authored default-content head (h2 + lede),
   4 quadrant block rows [title, checklist <ul>, closer], and a default-content foot
   (links paragraph + secondary link). Decorative ticks/arrow baked here. */

const NAME = 'unified-quadrants';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function siblingContent(block) {
  const wrapper = block.closest(`.${NAME}-wrapper`) || block.parentElement;
  const isDC = (n) => n && n.classList && n.classList.contains('default-content-wrapper');
  return {
    prev: isDC(wrapper && wrapper.previousElementSibling) ? wrapper.previousElementSibling : null,
    next: isDC(wrapper && wrapper.nextElementSibling) ? wrapper.nextElementSibling : null,
  };
}

export default function decorate(block) {
  const rows = [...block.children];
  const { prev, next } = siblingContent(block);

  const section = document.createElement('section');
  section.setAttribute('data-section', NAME);
  section.setAttribute('data-intent', 'capability-detail');
  section.setAttribute('data-layout', 'quadrant-ledger-table');
  section.setAttribute('data-items', '4');
  const wrap = el('div', 'wrap');

  // head
  const head = prev ? [...prev.children] : [];
  const qHead = el('div', 'quad-head');
  qHead.setAttribute('data-reveal', '');
  const h2 = head.find((n) => n.tagName === 'H2');
  const lede = head.find((n) => n.tagName === 'P');
  if (h2) qHead.append(el('h2', null, h2.textContent));
  if (lede) qHead.append(el('p', 'lede', lede.textContent));
  wrap.append(qHead);

  // quadrants
  const table = el('div', 'quad-table');
  table.setAttribute('data-reveal', '');
  rows.forEach((row) => {
    const cells = [...row.children];
    const quad = el('div', 'quad');
    const title = cells[0] ? (cells[0].querySelector('h3') || cells[0]).textContent.trim() : '';
    quad.append(el('h3', null, title));
    const ul = el('ul', 'checklist');
    const items = cells[1] ? [...cells[1].querySelectorAll('li')] : [];
    items.forEach((li) => {
      const item = document.createElement('li');
      const tick = el('span', 'tick');
      tick.setAttribute('aria-hidden', 'true');
      tick.innerHTML = '&#10003;';
      item.append(tick, document.createTextNode(li.textContent));
      ul.append(item);
    });
    quad.append(ul);
    if (cells[2]) quad.append(el('p', 'closer', cells[2].textContent.trim()));
    table.append(quad);
  });
  wrap.append(table);

  // foot
  const foot = next ? [...next.children] : [];
  if (foot.length) {
    const qFoot = el('div', 'quad-foot');
    qFoot.setAttribute('data-reveal', '');
    foot.forEach((node) => {
      const secondary = node.querySelector && node.querySelector('a.button.secondary, em a');
      if (secondary) {
        const a = el('a', 'text-link');
        a.href = secondary.getAttribute('href');
        a.append(document.createTextNode(`${secondary.textContent} `));
        const arr = el('span', 'arr');
        arr.setAttribute('aria-hidden', 'true');
        arr.innerHTML = '&rarr;';
        a.append(arr);
        qFoot.append(a);
      } else if (node.tagName === 'P') {
        const p = document.createElement('p');
        p.append(...node.childNodes);
        qFoot.append(p);
      }
    });
    wrap.append(qFoot);
  }

  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
  if (prev) prev.remove();
  if (next) next.remove();
}
