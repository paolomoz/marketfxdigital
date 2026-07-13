/* cmp-quadrants — bordered quadrant table on the dark ground (comparison-editorial
   "Integration Gap" register; reuses styles.css .quad-table/.quad geometry).
   Authored default content BEFORE the block: kicker <p>, <h2>, then lede/extra <p>s
   (links preserved). Default content AFTER the block becomes a foot paragraph.
   Block rows:
     1 cell  -> brand strip (its <p>s render as a framed label above the table)
     2 cells -> [<h3>, body <p>s]
     3 cells -> [cell kicker, <h3>, body <p>s]
   An `anchor-<id>` variant sets the section id (in-page CTA targets). */

const NAME = 'cmp-quadrants';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function movePara(p) {
  const out = document.createElement('p');
  out.append(...p.childNodes);
  return out;
}

function dcSibling(node) {
  return node && node.classList && node.classList.contains('default-content-wrapper') ? node : null;
}

export default function decorate(block) {
  const wrapper = block.closest(`.${NAME}-wrapper`) || block.parentElement;
  const prev = dcSibling(wrapper.previousElementSibling);
  const next = dcSibling(wrapper.nextElementSibling);
  const rows = [...block.children];
  const anchor = [...block.classList].find((c) => c.startsWith('anchor-'));

  const section = document.createElement('section');
  if (anchor) section.id = anchor.slice('anchor-'.length);
  section.setAttribute('data-section', 'quadrants');
  section.setAttribute('data-intent', 'framework');
  section.setAttribute('data-layout', 'quadrant-table');

  const wrap = el('div', 'wrap');

  if (prev) {
    const head = el('div', 'gap-head');
    head.setAttribute('data-reveal', '');
    const kicker = prev.querySelector('p');
    const h2 = prev.querySelector('h2');
    if (kicker) head.append(el('p', 'kicker', kicker.textContent.trim()));
    if (h2) head.append(el('h2', null, h2.textContent.trim()));
    [...prev.querySelectorAll('p')].slice(1).forEach((p, i) => {
      const out = movePara(p);
      if (i === 0) out.className = 'lede';
      head.append(out);
    });
    wrap.append(head);
  }

  const table = el('div', 'quad-table');
  table.setAttribute('data-reveal', '');
  let cellCount = 0;
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      const brand = el('div', 'quad-brand');
      [...cells[0].querySelectorAll('p')].forEach((p) => brand.append(movePara(p)));
      wrap.append(brand);
      return;
    }
    const [kickerCell, titleCell, bodyCell] = cells.length >= 3
      ? cells : [null, cells[0], cells[1]];
    const quad = el('div', 'quad');
    if (kickerCell) quad.append(el('p', 'quad-kicker', kickerCell.textContent.trim()));
    const h3 = titleCell?.querySelector('h3') || titleCell;
    if (h3) quad.append(el('h3', null, h3.textContent.trim()));
    if (bodyCell) [...bodyCell.querySelectorAll('p')].forEach((p) => quad.append(movePara(p)));
    table.append(quad);
    cellCount += 1;
  });
  section.setAttribute('data-items', String(cellCount));
  wrap.append(table);

  if (next) {
    const foot = el('div', 'quad-foot');
    foot.setAttribute('data-reveal', '');
    [...next.querySelectorAll('p')].forEach((p) => foot.append(movePara(p)));
    wrap.append(foot);
    next.remove();
  }

  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
  prev?.remove();
}
