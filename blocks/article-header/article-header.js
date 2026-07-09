/* article-header — David's-Model decode. Reads the authored head (kicker <p>,
   <h1>, lede <p>) as default content before the block, plus three block rows
   tokened breadcrumb / byline / meta. Rebuilds the compact dark article header.
   Dot-grid + radial background are CSS (this block's css). No baked SVG. */

const NAME = 'article-header';

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
  const h1 = headEls.find((n) => n.tagName === 'H1');
  const paras = headEls.filter((n) => n.tagName === 'P');
  const kicker = paras[0]?.textContent.trim() || '';
  const lede = paras[1]?.textContent.trim() || '';

  const section = document.createElement('section');
  section.className = NAME;
  section.setAttribute('data-section', NAME);
  section.setAttribute('data-intent', 'orientation');
  section.setAttribute('data-layout', 'stacked-header');

  const wrap = el('div', 'wrap');

  // rows: breadcrumb | byline | meta (token = first cell text)
  let crumbRow;
  let bylineRow;
  let metaRow;
  rows.forEach((row) => {
    const cells = [...row.children];
    const token = cells[0]?.textContent.trim().toLowerCase();
    const rest = cells.slice(1);
    if (token === 'breadcrumb') crumbRow = rest;
    else if (token === 'byline') bylineRow = rest;
    else if (token === 'meta') metaRow = rest;
  });

  // breadcrumb
  if (crumbRow) {
    const nav = el('nav', 'breadcrumb');
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.setAttribute('data-reveal', '');
    const ol = document.createElement('ol');
    crumbRow.forEach((cell) => {
      const li = document.createElement('li');
      const a = cell.querySelector('a');
      if (a) {
        const link = el('a', null, a.textContent.trim());
        link.href = a.getAttribute('href');
        li.append(link);
      } else {
        const span = el('span', null, cell.textContent.trim());
        span.setAttribute('aria-current', 'page');
        li.append(span);
      }
      ol.append(li);
    });
    nav.append(ol);
    wrap.append(nav);
  }

  // heading stack
  const stack = document.createElement('div');
  stack.setAttribute('data-reveal', '');
  if (kicker) stack.append(el('p', 'kicker', kicker));
  if (h1) stack.append(el('h1', null, h1.textContent.trim()));
  if (lede) stack.append(el('p', 'lede', lede));

  if (bylineRow) {
    const byline = el('p', 'article-byline');
    byline.append(el('span', 'who', bylineRow[0]?.textContent.trim() || ''));
    bylineRow.slice(1).forEach((c) => {
      byline.append(el('span', null, '·'));
      byline.append(el('span', null, c.textContent.trim()));
    });
    stack.append(byline);
  }
  if (metaRow) {
    const meta = el('p', 'article-meta');
    metaRow.forEach((c, i) => {
      if (i) meta.append(el('span', null, '·'));
      meta.append(el('span', null, c.textContent.trim()));
    });
    stack.append(meta);
  }
  wrap.append(stack);

  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
  head?.remove();
}
