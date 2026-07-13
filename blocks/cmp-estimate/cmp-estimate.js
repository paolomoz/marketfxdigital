/* cmp-estimate — page-specific centered CTA on paper (comparison-editorial §12).
   Block: one row, one cell carrying <h2>, lede <p>, and a CTA authored
   <strong><a> (or buttonized a.primary). */

const NAME = 'cmp-estimate';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

export default function decorate(block) {
  const h2 = block.querySelector('h2');
  const link = block.querySelector('strong a') || block.querySelector('a.primary') || block.querySelector('a');
  const paras = [...block.querySelectorAll('p')]
    .filter((p) => !p.querySelector('a') && !p.classList.contains('button-wrapper'));

  const section = document.createElement('section');
  section.className = 'band-light estimate';
  section.setAttribute('data-section', 'estimate-cta');
  section.setAttribute('data-intent', 'conversion');
  section.setAttribute('data-layout', 'centered-cta');

  const wrap = el('div', 'wrap');
  const inner = el('div', 'inner');
  inner.setAttribute('data-reveal', '');
  if (h2) inner.append(el('h2', null, h2.textContent.trim()));
  paras.forEach((p) => {
    const out = el('p', 'lede');
    out.append(...p.childNodes);
    inner.append(out);
  });
  if (link) {
    const a = el('a', 'btn btn-primary', link.textContent.trim());
    a.href = link.getAttribute('href');
    inner.append(a);
  }

  wrap.append(inner);
  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
}
