/* related — David's-Model decode. Reads authored head (<h2> + lede <p>) as
   default content before the block; each block row = [link, note] → an editorial
   44px+ row. Styles in this block's css. No baked SVG. */

const NAME = 'related';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function headBefore(block) {
  const wrapper = block.closest(`.${NAME}-wrapper`) || block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  return prev && prev.classList.contains('default-content-wrapper') ? prev : null;
}

export default function decorate(block) {
  const rows = [...block.children];
  const head = headBefore(block);
  const headEls = head ? [...head.children] : [];
  const h2 = headEls.find((n) => n.tagName === 'H2');
  const lede = headEls.find((n) => n.tagName === 'P');

  const section = document.createElement('section');
  section.setAttribute('data-section', NAME);
  section.setAttribute('data-intent', 'navigation');
  section.setAttribute('data-layout', 'editorial-rows');

  const wrap = el('div', 'wrap');
  const intro = document.createElement('div');
  intro.setAttribute('data-reveal', '');
  if (h2) intro.append(el('h2', null, h2.textContent.trim()));
  if (lede) intro.append(el('p', null, lede.textContent.trim()));
  wrap.append(intro);

  const list = el('ul', 'related-rows');
  list.setAttribute('data-reveal', '');
  rows.forEach((row) => {
    const cells = [...row.children];
    const a = cells[0]?.querySelector('a');
    if (!a) return;
    const note = cells[1]?.textContent.trim() || '';
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    const label = el('span', null, a.textContent.trim());
    if (note) label.append(el('span', 'note', note));
    const arr = el('span', 'arr', '→');
    arr.setAttribute('aria-hidden', 'true');
    link.append(label, arr);
    li.append(link);
    list.append(li);
  });
  wrap.append(list);

  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
  head?.remove();
}
