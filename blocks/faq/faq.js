/* faq — David's-Model decode: authored default-content head (h2) + block rows. A single-cell
   row is a group label (starts a new .faq-group); a two-cell row is a Q/A rendered as a
   details/summary accordion item. The "+" indicator is decorative, baked here. */

const NAME = 'faq';

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

export default function decorate(block) {
  const rows = [...block.children];
  const dc = defaultContentBefore(block);
  const head = dc ? [...dc.children] : [];

  const section = document.createElement('section');
  section.className = 'faq';
  section.setAttribute('data-section', 'faq');
  section.setAttribute('data-intent', 'objection-handling');
  section.setAttribute('data-layout', 'grouped-accordion');
  section.setAttribute('data-items', '8');

  const wrap = el('div', 'wrap faq-cols');
  const titleCol = document.createElement('div');
  titleCol.setAttribute('data-reveal', '');
  const h2 = head.find((n) => n.tagName === 'H2');
  if (h2) titleCol.append(el('h2', null, h2.textContent));
  wrap.append(titleCol);

  const groupsCol = document.createElement('div');
  let group = null;
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      group = el('div', 'faq-group');
      group.setAttribute('data-reveal', '');
      group.append(el('h3', null, cells[0].textContent.trim()));
      groupsCol.append(group);
      return;
    }
    if (!group) {
      group = el('div', 'faq-group');
      group.setAttribute('data-reveal', '');
      groupsCol.append(group);
    }
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.append(document.createTextNode(cells[0].textContent.trim()));
    const ind = el('span', 'ind');
    ind.setAttribute('aria-hidden', 'true');
    ind.textContent = '+';
    summary.append(ind);
    details.append(summary, el('p', null, cells[1] ? cells[1].textContent.trim() : ''));
    group.append(details);
  });
  wrap.append(groupsCol);

  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
  if (dc) dc.remove();
}
