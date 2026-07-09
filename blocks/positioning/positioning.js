/* positioning — David's Model decode: reads the authored head (kicker / h2 /
   body paragraphs as default content) and the quote-card block row [quote,
   follow], then rebuilds the prototype WHITE split: copy left, dark quote card
   right. No decorative SVG in this section. */

export default function decorate(block) {
  const head = block.closest('.positioning-wrapper')?.previousElementSibling;
  const h2Text = head?.querySelector('h2')?.textContent.trim() || '';
  const paras = head ? [...head.querySelectorAll('p')] : [];
  const eyebrow = paras[0]?.textContent.trim() || '';
  const body = paras.slice(1);

  // quote-card = the single block row [quote, follow]
  const row = block.querySelector(':scope > div');
  const cells = row ? [...row.children] : [];
  const quote = cells[0] || null;
  const follow = cells[1] || null;

  const section = document.createElement('section');
  section.className = 'band-light';
  section.setAttribute('data-section', 'positioning');
  section.setAttribute('data-intent', 'education');
  section.setAttribute('data-layout', 'split-7-5');

  const wrap = document.createElement('div');
  wrap.className = 'wrap pos-split';

  const copy = document.createElement('div');
  copy.className = 'pos-copy';
  copy.setAttribute('data-reveal', '');
  const kicker = document.createElement('p');
  kicker.className = 'kicker';
  kicker.textContent = eyebrow;
  const h2 = document.createElement('h2');
  h2.textContent = h2Text;
  copy.append(kicker, h2);
  body.forEach((p) => {
    const np = document.createElement('p');
    np.append(...p.childNodes);
    copy.append(np);
  });

  const card = document.createElement('div');
  card.className = 'quote-card';
  card.setAttribute('data-reveal', '');
  const bq = document.createElement('blockquote');
  const q = document.createElement('p');
  q.className = 'q';
  if (quote) q.append(...quote.childNodes);
  const f = document.createElement('p');
  f.className = 'follow';
  if (follow) f.append(...follow.childNodes);
  bq.append(q, f);
  card.append(bq);

  wrap.append(copy, card);
  section.append(wrap);

  block.replaceChildren(section);
  block.classList.remove('positioning');
  head?.remove();
}
