/* insights — decodes authored content (DA / David's Model) and rebuilds the prototype section.
   Head default content: heading + a secondary button link (View all articles). Article cards are
   block rows: [thumbnail img, category, linked title, prose]. The "Read article" link reuses the
   card's title href; decorative arrow glyphs are baked here. */
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
  const head = block.closest('.insights-wrapper')?.previousElementSibling;
  const h2Text = head?.querySelector('h2')?.textContent.trim() || '';
  const headLink = head?.querySelector('a');
  const headHref = headLink?.getAttribute('href') || '/blog';
  const headText = headLink?.textContent.trim() || 'View all articles';

  const cards = [...block.children].map((row) => {
    const cells = [...row.children];
    const titleA = cells[2]?.querySelector('a');
    return {
      img: cells[0]?.querySelector('img') || null,
      cat: cells[1]?.textContent.trim() || '',
      href: titleA?.getAttribute('href') || '#',
      title: (titleA?.textContent || cells[2]?.textContent || '').trim(),
      prose: cells[3]?.querySelector('p') || cells[3] || null,
    };
  });

  const section = document.createElement('section');
  section.setAttribute('data-section', 'insights');
  section.setAttribute('data-intent', 'editorial');
  section.setAttribute('data-layout', 'contained-3up');
  section.setAttribute('data-items', String(cards.length));
  section.setAttribute('data-media', 'thumbnails');

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const headEl = document.createElement('div');
  headEl.className = 'insights-head';
  headEl.setAttribute('data-reveal', '');
  const h2 = document.createElement('h2');
  h2.textContent = h2Text;
  headEl.append(h2, buildTextLink(headHref, headText));

  const grid = document.createElement('div');
  grid.className = 'article-grid';
  cards.forEach(({
    img, cat, href, title, prose,
  }) => {
    const article = document.createElement('article');
    article.className = 'article';
    article.setAttribute('data-reveal', '');

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    if (img) thumb.append(img);

    const catEl = document.createElement('p');
    catEl.className = 'cat';
    catEl.textContent = cat;

    const h3 = document.createElement('h3');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = title;
    h3.append(a);

    const p = document.createElement('p');
    if (prose) p.append(...prose.childNodes);

    article.append(thumb, catEl, h3, p, buildTextLink(href, 'Read article'));
    grid.append(article);
  });

  wrap.append(headEl, grid);
  section.append(wrap);

  head?.remove();
  block.replaceChildren(section);
  block.classList.remove('insights');
}
