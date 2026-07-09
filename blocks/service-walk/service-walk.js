/* service-walk — David's Model decode: each authored block row is one service.
   Cells, in order: [title, prose, checklist (native <ul>), proof-stat, related-link <a>].
   The block generates the 01..07 ordinal, builds the two-column editorial row
   (ordinal + title left; prose + cyan-check list + tinted proof exhibit + tappable
   related-link row right) and rebuilds the prototype .band-light.walk section.
   The ✓ tick + → arrow are decorative and baked here; the number is generated. */

const NAME = 'service-walk';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

export default function decorate(block) {
  const rows = [...block.children];

  const section = document.createElement('section');
  section.className = 'band-light walk';
  section.setAttribute('data-section', NAME);
  section.setAttribute('data-intent', 'service-catalog');
  section.setAttribute('data-layout', 'two-col-editorial-walk');
  section.setAttribute('data-items', String(rows.length));

  const wrap = el('div', 'wrap');

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const title = cells[0] ? cells[0].textContent.trim() : '';
    const prose = cells[1] ? cells[1].textContent.trim() : '';
    const listItems = cells[2] ? [...cells[2].querySelectorAll('li')] : [];
    const proofHTML = cells[3] ? cells[3].innerHTML.trim() : '';
    const relatedA = cells[4] ? cells[4].querySelector('a') : null;

    const article = el('article', 'svc');
    article.setAttribute('data-reveal', '');

    const svcHead = el('div', 'svc-head');
    const ord = el('span', 'ord', String(i + 1).padStart(2, '0'));
    ord.setAttribute('aria-hidden', 'true');
    svcHead.append(ord, el('h2', null, title));
    article.append(svcHead);

    const body = el('div', 'svc-body');
    if (prose) body.append(el('p', 'svc-intro', prose));

    if (listItems.length) {
      const ul = el('ul', 'svc-list');
      listItems.forEach((li) => {
        const item = document.createElement('li');
        const tick = el('span', 'tick');
        tick.setAttribute('aria-hidden', 'true');
        tick.innerHTML = '&#10003;';
        item.append(tick, document.createTextNode(li.textContent.trim()));
        ul.append(item);
      });
      body.append(ul);
    }

    if (proofHTML) {
      const exhibit = el('div', 'svc-exhibit');
      const p = document.createElement('p');
      p.innerHTML = proofHTML;
      exhibit.append(p);
      body.append(exhibit);
    }

    if (relatedA) {
      const read = document.createElement('a');
      read.className = 'read-row';
      read.href = relatedA.getAttribute('href');
      const label = el('span', 'rlabel', relatedA.textContent.trim());
      const arr = el('span', 'arr');
      arr.setAttribute('aria-hidden', 'true');
      arr.innerHTML = '&rarr;';
      read.append(label, arr);
      body.append(read);
    }

    article.append(body);
    wrap.append(article);
  });

  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
}
