/* embedded-partner — decodes authored content (DA / David's Model) and rebuilds
   the prototype section. Everything here is non-repeating prose, so it is authored
   as DEFAULT CONTENT (bare siblings before the block): heading, lede, "What You Get"
   subhead, a native <ul>, the creed quote, and its follow-up.
   Decorative tick glyphs and the blockquote wrapper are baked here. */
const TICK = '✓';

export default function decorate(block) {
  const head = block.closest('.embedded-partner-wrapper')?.previousElementSibling;
  const nodes = [...(head?.children || [])];

  const h2El = nodes.find((n) => n.tagName === 'H2');
  const h3El = nodes.find((n) => n.tagName === 'H3');
  const listEl = nodes.find((n) => n.tagName === 'UL');
  const paras = nodes.filter((n) => n.tagName === 'P');
  const [ledeEl, quoteEl, followEl] = paras;

  const items = listEl ? [...listEl.children].map((li) => li.textContent.trim()) : [];

  const section = document.createElement('section');
  section.className = 'partner-band';
  section.setAttribute('data-section', 'embedded-partner');
  section.setAttribute('data-intent', 'offer-summary');
  section.setAttribute('data-layout', 'contained-band-quote');
  section.setAttribute('data-items', String(items.length));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const headEl = document.createElement('div');
  headEl.className = 'head';
  headEl.setAttribute('data-reveal', '');
  const h2 = document.createElement('h2');
  h2.textContent = h2El?.textContent.trim() || '';
  headEl.append(h2);
  if (ledeEl) {
    const lede = document.createElement('p');
    lede.className = 'lede';
    lede.append(...ledeEl.childNodes);
    headEl.append(lede);
  }
  const h3 = document.createElement('h3');
  h3.textContent = h3El?.textContent.trim() || 'What You Get';
  headEl.append(h3);

  const ul = document.createElement('ul');
  ul.className = 'get-list';
  ul.setAttribute('data-reveal', '');
  items.forEach((text) => {
    const li = document.createElement('li');
    const tick = document.createElement('span');
    tick.className = 'tick';
    tick.setAttribute('aria-hidden', 'true');
    tick.textContent = TICK;
    li.append(tick, document.createTextNode(text));
    ul.append(li);
  });

  const creed = document.createElement('div');
  creed.className = 'creed';
  creed.setAttribute('data-reveal', '');
  const blockquote = document.createElement('blockquote');
  const quoteP = document.createElement('p');
  if (quoteEl) quoteP.append(...quoteEl.childNodes);
  blockquote.append(quoteP);
  creed.append(blockquote);
  if (followEl) {
    const follow = document.createElement('p');
    follow.className = 'follow';
    follow.append(...followEl.childNodes);
    creed.append(follow);
  }

  wrap.append(headEl, ul, creed);
  section.append(wrap);

  head?.remove();
  block.replaceChildren(section);
  block.classList.remove('embedded-partner');
}
