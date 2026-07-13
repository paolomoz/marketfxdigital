/* cmp-exhibit — cyan proof-exhibit card (comparison-editorial template).
   Default register: TL;DR band — one row [kicker, body] (body keeps inline links).
   `cta` variant: diagnostic call-to-action card — one cell carrying <h3>, <p>,
   and a CTA authored <strong><a> (or buttonized a.primary). */

const NAME = 'cmp-exhibit';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

export default function decorate(block) {
  const cta = block.classList.contains('cta');
  const section = document.createElement('section');
  section.setAttribute('data-section', cta ? 'diagnostic-cta' : 'tldr');
  section.setAttribute('data-intent', cta ? 'conversion' : 'summary');
  section.setAttribute('data-layout', 'contained-exhibit');
  section.className = cta ? 'cmpx-cta-band' : 'tldr';

  const wrap = el('div', 'wrap');
  const card = el('div', cta ? 'diag-exhibit' : 'tldr-card');
  card.setAttribute('data-reveal', '');

  if (cta) {
    const h3 = block.querySelector('h3');
    const link = block.querySelector('strong a') || block.querySelector('a.primary') || block.querySelector('a');
    const paras = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('a') && !p.classList.contains('button-wrapper'));
    if (h3) card.append(el('h3', null, h3.textContent.trim()));
    paras.forEach((p) => {
      const out = document.createElement('p');
      out.append(...p.childNodes);
      card.append(out);
    });
    if (link) {
      const a = el('a', 'btn btn-primary', link.textContent.trim());
      a.href = link.getAttribute('href');
      card.append(a);
    }
  } else {
    const cells = block.querySelector(':scope > div') ? [...block.querySelector(':scope > div').children] : [];
    const kicker = cells[0]?.textContent.trim() || '';
    if (kicker) card.append(el('p', 'kicker', kicker));
    const body = cells[1];
    if (body) {
      [...body.querySelectorAll('p')].forEach((p) => {
        const out = document.createElement('p');
        out.append(...p.childNodes);
        card.append(out);
      });
    }
  }

  wrap.append(card);
  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
}
