/* article-cards — dynamic, query-index driven blog grid.
   Authoring: an OPTIONAL single number (e.g. "3") in the block limits how many
   cards render (home "From the Blog"); no number = show all (/blog index).
   Fetches /query-index.json, keeps entries under /blog/, sorts by date desc,
   and rebuilds a card grid. Graceful: any fetch error or empty result renders
   nothing (the block collapses silently). No external deps. */

const NAME = 'article-cards';
const INDEX = '/query-index.json';

function fmtDate(value) {
  if (!value) return '';
  // query-index lastModified is unix seconds (string or number); allow ISO too.
  const num = Number(value);
  const d = Number.isFinite(num) && num > 0 ? new Date(num * 1000) : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function dateKey(entry) {
  const v = entry.lastModified || entry.publishDate || entry.date || 0;
  const num = Number(v);
  if (Number.isFinite(num) && num > 0) return num;
  const t = Date.parse(v);
  return Number.isNaN(t) ? 0 : t / 1000;
}

function buildCard(entry) {
  const article = document.createElement('article');
  article.className = 'ac-card';
  article.setAttribute('data-reveal', '');

  const a = document.createElement('a');
  a.className = 'ac-link';
  a.href = entry.path;

  const media = document.createElement('div');
  media.className = 'ac-media';
  if (entry.image) {
    const img = document.createElement('img');
    img.src = entry.image;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    // explicit dims lock the 16:10 box so images don't cause CLS
    img.width = 1600;
    img.height = 1000;
    media.append(img);
  } else {
    media.classList.add('ac-media--placeholder');
    media.setAttribute('aria-hidden', 'true');
  }
  a.append(media);

  const body = document.createElement('div');
  body.className = 'ac-body';

  const cat = entry.category || entry.tags || '';
  if (cat && String(cat).trim()) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'ac-eyebrow';
    eyebrow.textContent = String(cat).replace(/^\[|\]$/g, '').replace(/"/g, '').trim();
    body.append(eyebrow);
  }

  const h3 = document.createElement('h3');
  h3.className = 'ac-title';
  h3.textContent = entry.title || entry.path;
  body.append(h3);

  if (entry.description) {
    const p = document.createElement('p');
    p.className = 'ac-desc';
    p.textContent = entry.description;
    body.append(p);
  }

  const meta = document.createElement('p');
  meta.className = 'ac-meta';
  const date = fmtDate(entry.lastModified || entry.publishDate || entry.date);
  meta.append(date ? document.createTextNode(date) : document.createTextNode(''));
  const arr = document.createElement('span');
  arr.className = 'ac-arr';
  arr.setAttribute('aria-hidden', 'true');
  arr.textContent = 'Read article →';
  meta.append(arr);
  body.append(meta);

  a.append(body);
  article.append(a);
  return article;
}

export default async function decorate(block) {
  // authored rows ([link, description] per article) make the list visible in
  // the raw HTML for crawlers; the index still enriches image/date/category
  const authored = [...block.querySelectorAll(':scope > div')].map((row) => {
    const a = row.querySelector('a');
    if (!a) return null;
    const cells = [...row.children];
    return {
      path: new URL(a.href, window.location.href).pathname,
      title: a.textContent.trim(),
      description: cells[1] ? cells[1].textContent.trim() : '',
    };
  }).filter(Boolean);

  // author may drop a plain number in the block to cap the list (e.g. home = 3)
  const limitMatch = authored.length ? null : block.textContent.match(/\d+/);
  const limit = limitMatch ? parseInt(limitMatch[0], 10) : null;

  block.replaceChildren();
  block.classList.remove(NAME);

  let entries = [];
  try {
    const resp = await fetch(INDEX);
    if (!resp.ok) throw new Error('index unavailable');
    const json = await resp.json();
    entries = Array.isArray(json?.data) ? json.data : [];
  } catch (e) {
    if (!authored.length) return; // graceful: render nothing
  }

  let posts;
  if (authored.length) {
    const byPath = new Map(entries.map((e) => [e.path, e]));
    posts = authored
      .map((e) => ({ ...(byPath.get(e.path) || {}), ...e }))
      .sort((a, b) => dateKey(b) - dateKey(a));
  } else {
    posts = entries
      .filter((e) => typeof e.path === 'string' && e.path.startsWith('/blog/'))
      .sort((a, b) => dateKey(b) - dateKey(a));
  }

  const list = limit ? posts.slice(0, limit) : posts;
  if (!list.length) return; // graceful: nothing to show

  const section = document.createElement('section');
  section.setAttribute('data-section', NAME);
  section.setAttribute('data-intent', 'editorial');
  section.setAttribute('data-layout', 'auto-fill-grid');
  section.setAttribute('data-items', String(list.length));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const grid = document.createElement('div');
  grid.className = 'ac-grid';
  grid.setAttribute('role', 'list');
  list.forEach((entry) => {
    const card = buildCard(entry);
    card.setAttribute('role', 'listitem');
    grid.append(card);
  });

  wrap.append(grid);
  section.append(wrap);
  block.append(section);
}
