/* cmp-approach — light editorial split: prose column + diagnostic proof-exhibit CTA
   (comparison-editorial §10). Authored default content BEFORE the block: kicker <p>,
   <h2>, prose <p>s (links preserved) -> left column. Block: one row, one cell
   carrying <h3>, <p>, and a CTA authored <strong><a> (or buttonized a.primary)
   -> the right-hand cyan exhibit. */

const NAME = 'cmp-approach';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

export default function decorate(block) {
  const wrapper = block.closest(`.${NAME}-wrapper`) || block.parentElement;
  const prev = wrapper.previousElementSibling;
  const head = prev && prev.classList.contains('default-content-wrapper') ? prev : null;

  const section = document.createElement('section');
  section.className = 'band-light';
  section.setAttribute('data-section', 'approach');
  section.setAttribute('data-intent', 'offer-summary');
  section.setAttribute('data-layout', 'split-prose-exhibit');

  const wrap = el('div', 'wrap');
  const cols = el('div', 'approach-cols');

  const prose = document.createElement('div');
  prose.setAttribute('data-reveal', '');
  if (head) {
    const kicker = head.querySelector('p');
    const h2 = head.querySelector('h2');
    if (kicker) prose.append(el('p', 'kicker', kicker.textContent.trim()));
    if (h2) prose.append(el('h2', null, h2.textContent.trim()));
    [...head.querySelectorAll('p')].slice(1).forEach((p) => {
      const out = document.createElement('p');
      out.append(...p.childNodes);
      prose.append(out);
    });
    head.remove();
  }
  cols.append(prose);

  const exhibit = el('div', 'diag-exhibit');
  exhibit.setAttribute('data-reveal', '');
  const h3 = block.querySelector('h3');
  if (h3) exhibit.append(el('h3', null, h3.textContent.trim()));
  const link = block.querySelector('strong a') || block.querySelector('a.primary') || block.querySelector('a');
  [...block.querySelectorAll('p')]
    .filter((p) => !p.querySelector('a') && !p.classList.contains('button-wrapper'))
    .forEach((p) => {
      const out = document.createElement('p');
      out.append(...p.childNodes);
      exhibit.append(out);
    });
  if (link) {
    const a = el('a', 'btn btn-primary', link.textContent.trim());
    a.href = link.getAttribute('href');
    exhibit.append(a);
  }
  cols.append(exhibit);

  wrap.append(cols);
  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
}
