/* glossary — definition list with an A–Z quick-nav. David's-Model decode:
   one authored ROW per term with cells [term, definition]. Terms are sorted
   alphabetically and grouped by first letter; the nav bar links to each
   populated letter group. No external deps. */

const NAME = 'glossary';

function firstLetter(term) {
  const ch = term.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(ch) ? ch : '#';
}

export default function decorate(block) {
  const terms = [...block.children]
    .map((row) => {
      const cells = [...row.children];
      const term = (cells[0]?.textContent || '').trim();
      if (!term) return null;
      return { term, def: cells[1] || null };
    })
    .filter(Boolean)
    .sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));

  block.replaceChildren();
  block.classList.remove(NAME);

  const section = document.createElement('section');
  section.setAttribute('data-section', NAME);
  section.setAttribute('data-intent', 'reference');
  section.setAttribute('data-layout', 'definition-list');
  section.setAttribute('data-items', String(terms.length));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  // group terms by first letter
  const groups = new Map();
  terms.forEach((t) => {
    const letter = firstLetter(t.term);
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push(t);
  });
  const letters = [...groups.keys()];

  // A–Z quick-nav
  const nav = document.createElement('nav');
  nav.className = 'gl-nav';
  nav.setAttribute('aria-label', 'Jump to letter');
  const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  alphabet.forEach((letter) => {
    const active = groups.has(letter);
    const link = document.createElement(active ? 'a' : 'span');
    link.className = 'gl-nav-link';
    link.textContent = letter;
    if (active) {
      link.href = `#gl-${letter === '#' ? 'num' : letter}`;
    } else {
      link.classList.add('is-disabled');
      link.setAttribute('aria-hidden', 'true');
    }
    nav.append(link);
  });
  wrap.append(nav);

  // grouped definition lists
  letters.forEach((letter) => {
    const group = document.createElement('div');
    group.className = 'gl-group';
    group.id = `gl-${letter === '#' ? 'num' : letter}`;
    group.setAttribute('data-reveal', '');

    const heading = document.createElement('h2');
    heading.className = 'gl-letter';
    heading.setAttribute('aria-hidden', 'true');
    heading.textContent = letter;
    group.append(heading);

    const dl = document.createElement('dl');
    groups.get(letter).forEach(({ term, def }) => {
      const dt = document.createElement('dt');
      dt.textContent = term;
      const dd = document.createElement('dd');
      if (def) {
        dd.append(...def.childNodes);
      }
      dl.append(dt, dd);
    });
    group.append(dl);
    wrap.append(group);
  });

  section.append(wrap);
  block.append(section);
}
