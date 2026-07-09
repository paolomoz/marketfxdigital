/* capabilities — decodes authored content (DA / David's Model) and rebuilds the prototype section.
   Head default content: heading, lede (inline links), a secondary button link (link-alone),
   and two plain exhibit lines (value + source). Cards are block rows (linked title + prose). */
const ARROW = '→';

function buildTextLink(href, text) {
  const a = document.createElement('a');
  a.className = 'text-link';
  a.href = href;
  a.append(document.createTextNode(`${text} `));
  const arr = document.createElement('span');
  arr.className = 'arr';
  arr.setAttribute('aria-hidden', 'true');
  arr.textContent = ARROW;
  a.append(arr);
  return a;
}

export default function decorate(block) {
  const head = block.closest('.capabilities-wrapper')?.previousElementSibling;

  let h2Text = '';
  let ledeEl = null;
  let btnHref = '/services';
  let btnText = 'Explore all services';
  const exhibit = [];
  [...(head?.children || [])].forEach((el) => {
    if (el.tagName === 'H2') { h2Text = el.textContent.trim(); return; }
    if (el.tagName !== 'P') return;
    const a = el.querySelector('a');
    if (a && el.textContent.trim() === a.textContent.trim()) {
      btnHref = a.getAttribute('href');
      btnText = a.textContent.trim();
    } else if (a) {
      ledeEl = el;
    } else {
      exhibit.push(el.textContent.trim());
    }
  });

  const cards = [...block.children].map((row) => {
    const cells = [...row.children];
    const a = cells[0]?.querySelector('a');
    return {
      href: a?.getAttribute('href') || '#',
      title: (a?.textContent || cells[0]?.textContent || '').trim(),
      prose: cells[1]?.querySelector('p') || cells[1] || null,
    };
  });

  const section = document.createElement('section');
  section.setAttribute('data-section', 'capabilities');
  section.setAttribute('data-intent', 'service-catalog');
  section.setAttribute('data-layout', 'split-rail-grid');
  section.setAttribute('data-items', String(cards.length));

  const wrap = document.createElement('div');
  wrap.className = 'wrap cap-split';

  const rail = document.createElement('div');
  rail.className = 'cap-rail';
  rail.setAttribute('data-reveal', '');
  const h2 = document.createElement('h2');
  h2.textContent = h2Text;
  rail.append(h2);
  if (ledeEl) {
    const lede = document.createElement('p');
    lede.className = 'lede';
    lede.append(...ledeEl.childNodes);
    rail.append(lede);
  }
  rail.append(buildTextLink(btnHref, btnText));
  if (exhibit.length) {
    const ex = document.createElement('div');
    ex.className = 'exhibit';
    const val = document.createElement('span');
    val.className = 'val';
    val.textContent = exhibit[0] || '';
    const src = document.createElement('span');
    src.className = 'src';
    src.textContent = exhibit[1] || '';
    ex.append(val, src);
    rail.append(ex);
  }

  const grid = document.createElement('div');
  grid.className = 'cap-grid';
  cards.forEach(({ href, title, prose }) => {
    const card = document.createElement('div');
    card.className = 'cap-card';
    card.setAttribute('data-reveal', '');
    const h3 = document.createElement('h3');
    const a = document.createElement('a');
    a.href = href;
    a.append(document.createTextNode(`${title} `));
    const arr = document.createElement('span');
    arr.className = 'arr';
    arr.setAttribute('aria-hidden', 'true');
    arr.textContent = ARROW;
    a.append(arr);
    h3.append(a);
    const p = document.createElement('p');
    if (prose) p.append(...prose.childNodes);
    card.append(h3, p);
    grid.append(card);
  });

  wrap.append(rail, grid);
  section.append(wrap);

  head?.remove();
  block.replaceChildren(section);
  block.classList.remove('capabilities');
}
