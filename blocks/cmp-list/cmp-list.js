/* cmp-list — ruled editorial list (comparison-editorial "honest take" / "strong
   fit" registers). Authored default content BEFORE the block: kicker <p>, <h2>,
   then lede/extra <p>s (links preserved). Block rows are single-cell:
     - a cell whose entire content is <em>…</em> renders as a closing line
       (the em is an authoring marker, unwrapped on decode);
     - every other cell is one ruled list item (inline <strong>/links kept).
   Variants: default = ruled list on paper; `dark` = ruled list on the dark ground;
   `checklist` = two-column ticked checklist on dark (ticks baked, decorative);
   `ordered` = numbered ruled list on dark (counters baked);
   `columns` = two-column ruled list. */

const NAME = 'cmp-list';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function isCloser(cell) {
  const p = cell.querySelector('p') || cell;
  const em = p.querySelector(':scope > em');
  return em && p.textContent.trim() === em.textContent.trim() ? em : null;
}

export default function decorate(block) {
  const wrapper = block.closest(`.${NAME}-wrapper`) || block.parentElement;
  const prev = wrapper.previousElementSibling;
  const head = prev && prev.classList.contains('default-content-wrapper') ? prev : null;
  const dark = block.classList.contains('dark')
    || block.classList.contains('checklist')
    || block.classList.contains('ordered')
    || block.classList.contains('columns');
  const checklist = block.classList.contains('checklist');
  const ordered = block.classList.contains('ordered');
  const columns = block.classList.contains('columns') || checklist;

  const items = [];
  const closers = [];
  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    const em = isCloser(cell);
    if (em) closers.push(em);
    else items.push(cell);
  });

  const section = document.createElement('section');
  if (!dark) section.className = 'band-light';
  section.setAttribute('data-section', 'ruled-list');
  section.setAttribute('data-intent', 'explanation');
  section.setAttribute('data-layout', checklist ? 'two-col-checklist' : 'ruled-list');
  section.setAttribute('data-items', String(items.length));

  const wrap = el('div', 'wrap');

  if (head) {
    const h = el('div', 'cl-head');
    h.setAttribute('data-reveal', '');
    const kicker = head.querySelector('p');
    const h2 = head.querySelector('h2');
    if (kicker) h.append(el('p', 'kicker', kicker.textContent.trim()));
    if (h2) h.append(el('h2', null, h2.textContent.trim()));
    [...head.querySelectorAll('p')].slice(1).forEach((p, i) => {
      const out = el('p', i === 0 ? 'lede' : null);
      out.append(...p.childNodes);
      h.append(out);
    });
    wrap.append(h);
    head.remove();
  }

  const list = el(ordered ? 'ol' : 'ul', `cl-list${columns ? ' cl-cols' : ''}${checklist ? ' cl-check' : ''}${ordered ? ' cl-num' : ''}`);
  list.setAttribute('data-reveal', '');
  items.forEach((cell) => {
    const li = document.createElement('li');
    if (checklist) {
      const tick = el('span', 'tick');
      tick.setAttribute('aria-hidden', 'true');
      tick.innerHTML = '&#10003;';
      li.append(tick);
    }
    const body = el('span', 'cl-item');
    [...cell.querySelectorAll('p')].forEach((p) => body.append(...p.childNodes));
    if (!body.childNodes.length) body.append(...cell.childNodes);
    li.append(body);
    list.append(li);
  });
  wrap.append(list);

  closers.forEach((em) => {
    const p = el('p', 'cl-close');
    p.setAttribute('data-reveal', '');
    p.append(...em.childNodes);
    wrap.append(p);
  });

  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
}
