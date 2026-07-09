/* resource-cards — lead-gated resource grid (matches live behaviour: every card
   is a CTA to /contact-us). David's-Model decode: one authored ROW per resource
   with cells [title, description]. Optional third cell overrides the CTA label. */

const NAME = 'resource-cards';
const CTA_HREF = '/contact-us';
const CTA_LABEL = 'Request access';

function buildCard({ title, desc, cta }) {
  const a = document.createElement('a');
  a.className = 'rc-card';
  a.href = CTA_HREF;
  a.setAttribute('data-reveal', '');

  const h3 = document.createElement('h3');
  h3.className = 'rc-title';
  h3.textContent = title;
  a.append(h3);

  if (desc) {
    const p = document.createElement('p');
    p.className = 'rc-desc';
    p.textContent = desc;
    a.append(p);
  }

  const label = document.createElement('span');
  label.className = 'rc-cta';
  label.append(document.createTextNode(`${cta || CTA_LABEL} `));
  const arr = document.createElement('span');
  arr.className = 'rc-arr';
  arr.setAttribute('aria-hidden', 'true');
  arr.textContent = '→';
  label.append(arr);
  a.append(label);

  return a;
}

export default function decorate(block) {
  const cards = [...block.children]
    .map((row) => {
      const cells = [...row.children];
      const title = (cells[0]?.textContent || '').trim();
      if (!title) return null;
      return {
        title,
        desc: (cells[1]?.textContent || '').trim(),
        cta: (cells[2]?.textContent || '').trim(),
      };
    })
    .filter(Boolean);

  block.replaceChildren();
  block.classList.remove(NAME);

  const section = document.createElement('section');
  section.setAttribute('data-section', NAME);
  section.setAttribute('data-intent', 'lead-gen');
  section.setAttribute('data-layout', 'card-grid');
  section.setAttribute('data-items', String(cards.length));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const grid = document.createElement('div');
  grid.className = 'rc-grid';
  grid.setAttribute('role', 'list');
  cards.forEach((card) => {
    const el = buildCard(card);
    el.setAttribute('role', 'listitem');
    grid.append(el);
  });

  wrap.append(grid);
  section.append(wrap);
  block.append(section);
}
