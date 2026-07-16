/* legal-header — compact dark document header. Authored head (kicker <p>, <h1>,
   optional lede <p>, last-updated <p>) is default content before the block; the
   block's single row is the breadcrumb (one cell per crumb, links preserved).
   Carries the CSS for the whole legal template (header, body/TOC, closing). */

const NAME = 'legal-header';

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
  const lede = paras.length > 2 ? paras[1]?.textContent.trim() : '';
  const updated = (paras.length > 2 ? paras[2] : paras[1])?.textContent.trim() || '';

  const section = document.createElement('section');
  section.className = 'legal-header';
  section.setAttribute('data-section', NAME);
  section.setAttribute('data-intent', 'orientation');
  section.setAttribute('data-layout', 'stacked-header');
  const wrap = el('div', 'wrap');
  section.append(wrap);

  const crumbRow = rows[0];
  if (crumbRow) {
    const nav = document.createElement('nav');
    nav.className = 'breadcrumb';
    nav.setAttribute('aria-label', 'Breadcrumb');
    const ol = document.createElement('ol');
    [...crumbRow.children].forEach((cell) => {
      const li = document.createElement('li');
      const authored = cell.querySelector('a');
      if (authored) {
        const a = el('a', null, authored.textContent.trim());
        a.href = authored.getAttribute('href');
        li.append(a);
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

  if (kicker) wrap.append(el('p', 'kicker', kicker));
  if (h1) wrap.append(el('h1', null, h1.textContent.trim()));
  if (lede) wrap.append(el('p', 'lede', lede));
  if (updated) {
    const meta = el('p', 'legal-meta');
    const dot = el('span', 'dot');
    dot.setAttribute('aria-hidden', 'true');
    meta.append(dot, document.createTextNode(` ${updated}`));
    wrap.append(meta);
  }

  block.replaceChildren(section);
  block.classList.remove(NAME);
  head?.remove();
}
