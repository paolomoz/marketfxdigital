/* band-light — David's-Model decode: reads authored default-content head + block rows
   (logo rows + quote rows) and rebuilds the exact prototype light band wrapping the
   platform-band and performance-testimonials sections. Only decorative marks are baked. */

const NAME = 'band-light';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function defaultContentBefore(block) {
  const wrapper = block.closest(`.${NAME}-wrapper`) || block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  return prev && prev.classList.contains('default-content-wrapper') ? prev : null;
}

export default function decorate(block) {
  const rows = [...block.children];

  // ---- authored head (default content, before the block) ----
  const dc = defaultContentBefore(block);
  const head = dc ? [...dc.children] : [];
  const take = (i, tag) => (head[i] && head[i].tagName === tag ? head[i] : null);
  const platH2 = take(0, 'H2');
  const platP = take(1, 'P');
  const perfH2 = take(2, 'H2');
  let idx = 3;
  let primaryLink;
  let secondaryLink;
  let chips;
  let perfIntro;
  for (; idx < head.length; idx += 1) {
    const node = head[idx];
    const prim = node.querySelector && node.querySelector('a.button.primary, strong a');
    const sec = node.querySelector && node.querySelector('a.button.secondary, em a');
    if (prim) primaryLink = prim;
    else if (sec) secondaryLink = sec;
    else if (node.tagName === 'UL') chips = node;
    else if (node.tagName === 'P') perfIntro = node;
  }

  // ---- authored rows: logos + quotes ----
  const logos = [];
  const quotes = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    const img = row.querySelector('img');
    if (img) {
      logos.push({ img, label: cells[1] ? cells[1].textContent.trim() : '' });
    } else {
      quotes.push({
        quote: cells[0] ? cells[0].textContent.trim() : '',
        who: cells[1] ? cells[1].textContent.trim() : '',
        role: cells[2] ? cells[2].textContent.trim() : '',
      });
    }
  });
  const groups = [];
  logos.forEach(({ img, label }) => {
    if (label || groups.length === 0) groups.push({ label, items: [] });
    groups[groups.length - 1].items.push(img);
  });

  // ---- rebuild ----
  const band = el('div', 'band-light');

  // platform-band
  const platform = document.createElement('section');
  platform.className = 'platforms';
  platform.setAttribute('data-section', 'platform-band');
  platform.setAttribute('data-intent', 'credibility');
  platform.setAttribute('data-layout', 'contained-logo-grid');
  platform.setAttribute('data-items', '13');
  platform.setAttribute('data-media', 'logos');
  const pWrap = el('div', 'wrap');
  const pHead = el('div', 'head');
  pHead.setAttribute('data-reveal', '');
  if (platH2) pHead.append(el('h2', null, platH2.textContent));
  if (platP) pHead.append(el('p', null, platP.textContent));
  pWrap.append(pHead);
  groups.forEach((g) => {
    const grp = el('div', 'logo-group');
    grp.setAttribute('data-reveal', '');
    grp.append(el('p', 'glabel', g.label));
    const ul = el('ul', 'logo-flow');
    g.items.forEach((src) => {
      const li = document.createElement('li');
      const im = document.createElement('img');
      im.src = src.getAttribute('src');
      im.alt = src.getAttribute('alt') || '';
      im.width = 480;
      im.height = 200;
      im.loading = 'lazy';
      li.append(im);
      ul.append(li);
    });
    grp.append(ul);
    pWrap.append(grp);
  });
  platform.append(pWrap);
  band.append(platform);

  // performance-testimonials
  const perf = document.createElement('section');
  perf.setAttribute('data-section', 'performance-testimonials');
  perf.setAttribute('data-intent', 'evidence');
  perf.setAttribute('data-layout', 'split-quote-pair');
  perf.setAttribute('data-items', '2');
  const perfWrap = el('div', 'wrap');
  const perfCols = el('div', 'perf-cols');

  const colL = document.createElement('div');
  colL.setAttribute('data-reveal', '');
  if (perfH2) colL.append(el('h2', null, perfH2.textContent));
  if (primaryLink) {
    const a = el('a', 'btn btn-primary perf-btn', primaryLink.textContent);
    a.href = primaryLink.getAttribute('href');
    colL.append(a);
  }
  perfCols.append(colL);

  const colR = document.createElement('div');
  colR.setAttribute('data-reveal', '');
  if (perfIntro) colR.append(el('p', null, perfIntro.textContent));
  if (chips) {
    const ul = el('ul', 'chip-list');
    ul.setAttribute('aria-label', 'Performance marketing system');
    [...chips.querySelectorAll('li')].forEach((li) => ul.append(el('li', null, li.textContent)));
    colR.append(ul);
  }
  if (secondaryLink) {
    const actions = el('div', 'perf-actions');
    const a = el('a', 'text-link');
    a.href = secondaryLink.getAttribute('href');
    a.append(document.createTextNode(`${secondaryLink.textContent} `));
    const arr = el('span', 'arr');
    arr.setAttribute('aria-hidden', 'true');
    arr.innerHTML = '&rarr;';
    a.append(arr);
    actions.append(a);
    colR.append(actions);
  }
  perfCols.append(colR);
  perfWrap.append(perfCols);

  const pair = el('div', 'quote-pair');
  quotes.forEach((q) => {
    const fig = document.createElement('figure');
    fig.setAttribute('data-reveal', '');
    const bq = document.createElement('blockquote');
    const qm = el('span', 'qmark');
    qm.setAttribute('aria-hidden', 'true');
    qm.innerHTML = '&ldquo;';
    bq.append(qm, el('p', null, q.quote));
    const cap = document.createElement('figcaption');
    cap.append(el('span', 'who', q.who), el('span', 'role', q.role));
    fig.append(bq, cap);
    pair.append(fig);
  });
  perfWrap.append(pair);
  perf.append(perfWrap);
  band.append(perf);

  block.replaceChildren(band);
  block.classList.remove(NAME);
  if (dc) dc.remove();
}
