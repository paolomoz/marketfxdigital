/* cmp-tax — the Fragmentation Tax ledger on paper (comparison-editorial §6).
   Ruled rows with tabular percentages and proportional bars — never KPI tiles.
   Authored default content BEFORE the block: kicker <p>, <h2>, lede <p> (links kept).
   Block rows, in order:
     1-cell rows before the first 2-cell row -> ledger caption
     2-cell rows [label, percentage]         -> ledger line items
     1-cell rows after the ledger            -> [0] total line, [1] ember exhibit,
                                                rest: prose paragraphs
   Bars are presentational (width ∝ captured percentage); the section carries the
   #fragmentation-tax anchor the hero CTA targets. */

const NAME = 'cmp-tax';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function moveInline(cell, tag, cls) {
  const out = document.createElement(tag);
  if (cls) out.className = cls;
  const p = cell.querySelector('p');
  out.append(...(p || cell).childNodes);
  return out;
}

export default function decorate(block) {
  const wrapper = block.closest(`.${NAME}-wrapper`) || block.parentElement;
  const prev = wrapper.previousElementSibling;
  const head = prev && prev.classList.contains('default-content-wrapper') ? prev : null;

  const rows = [...block.children];
  const items = [];
  const before = [];
  const after = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) items.push(cells);
    else if (cells.length === 1) (items.length ? after : before).push(cells[0]);
  });

  const section = document.createElement('section');
  section.className = 'band-light';
  section.id = 'fragmentation-tax';
  section.setAttribute('data-section', 'fragmentation-tax');
  section.setAttribute('data-intent', 'evidence');
  section.setAttribute('data-layout', 'results-ledger');
  section.setAttribute('data-items', String(items.length));

  const wrap = el('div', 'wrap');

  if (head) {
    const h = el('div', 'tax-head');
    h.setAttribute('data-reveal', '');
    const kicker = head.querySelector('p');
    const h2 = head.querySelector('h2');
    if (kicker) h.append(el('p', 'kicker', kicker.textContent.trim()));
    if (h2) h.append(el('h2', null, h2.textContent.trim()));
    [...head.querySelectorAll('p')].slice(1).forEach((p) => {
      const lede = el('p', 'lede');
      lede.append(...p.childNodes);
      h.append(lede);
    });
    wrap.append(h);
    head.remove();
  }

  const ledger = el('div', 'tax-ledger');
  ledger.setAttribute('data-reveal', '');
  before.forEach((cell) => ledger.append(el('p', 'tax-cap', cell.textContent.trim())));
  items.forEach(([labelCell, pctCell]) => {
    const row = el('div', 'tax-row');
    row.append(el('span', 'lbl', labelCell.textContent.trim()));
    const pctText = pctCell.textContent.trim();
    const pct = el('span', 'pct', pctText);
    pct.setAttribute('data-countup', '');
    row.append(pct);
    const bar = el('span', 'tax-bar');
    bar.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('i');
    fill.style.width = `${Math.min(parseFloat(pctText) * 5 || 0, 100)}%`;
    bar.append(fill);
    row.append(bar);
    ledger.append(row);
  });
  if (after[0]) ledger.append(moveInline(after[0], 'p', 'tax-total'));
  wrap.append(ledger);

  if (after[1]) {
    const ember = el('div', 'exhibit-ember-light');
    ember.setAttribute('data-reveal', '');
    ember.append(moveInline(after[1], 'p'));
    wrap.append(ember);
  }

  if (after.length > 2) {
    const prose = el('div', 'tax-prose');
    prose.setAttribute('data-reveal', '');
    after.slice(2).forEach((cell) => prose.append(moveInline(cell, 'p')));
    wrap.append(prose);
  }

  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
}
