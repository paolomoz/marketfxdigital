/* legal-doc — David's-Model decode of a full legal document (privacy / terms).
   Authored head (kicker <p>, <h1>, lede <p>, last-updated <p>) is default
   content before the block; the block table is a list of typed rows
   (first cell = token): breadcrumb | prose | h2 | h3 | contact | closing |
   closing-contact. The decode rebuilds the prototype's exact document DOM:
   a compact dark legal header (kicker / h1 / last-updated pill), a white
   band with a sticky numbered TOC derived from the h2 rows (static top
   list on mobile), a ~70ch reading column with hanging clause numbers, an
   address card, and a quiet closing contact line (no marketing CTA band —
   legal register). All copy lives in DA; only presentation (clause
   numbers, anchor ids, TOC, scaffolding) is generated here. No baked SVG.
   Styles in this block's css. */

const NAME = 'legal-doc';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

// anchor id from a heading ("Children's Privacy" -> "childrens-privacy")
function slugify(text) {
  return text.toLowerCase()
    .replace(/['’]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// move rich childNodes (p / ul with inline a/em/strong) from a cell
function moveChildren(cell, target) {
  if (!cell) return;
  [...cell.childNodes].forEach((n) => target.append(n));
}

// fresh link from an authored cell (sheds any .button decoration)
function linkFrom(cell) {
  const authored = cell?.querySelector('a');
  if (!authored) return null;
  const a = el('a', null, authored.textContent.trim());
  a.href = authored.getAttribute('href');
  return a;
}

function headBefore(block) {
  const wrapper = block.closest(`.${NAME}-wrapper`) || block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  return prev && prev.classList.contains('default-content-wrapper') ? prev : null;
}

export default function decorate(block) {
  const rows = [...block.children];

  // ---- authored head (default content before the block) ----
  const head = headBefore(block);
  const headEls = head ? [...head.children] : [];
  const h1 = headEls.find((n) => n.tagName === 'H1');
  const paras = headEls.filter((n) => n.tagName === 'P');
  const kicker = paras[0]?.textContent.trim() || '';
  const lede = paras[1]?.textContent.trim() || '';
  const updated = paras[2]?.textContent.trim() || '';

  // ---- 1 · legal-header — compact dark band ----
  const header = document.createElement('section');
  header.className = 'legal-header';
  header.setAttribute('data-section', 'legal-header');
  header.setAttribute('data-intent', 'orientation');
  header.setAttribute('data-layout', 'stacked-header');
  const headerWrap = el('div', 'wrap');
  header.append(headerWrap);

  // ---- 2 · document body — white ground: TOC rail + reading column ----
  const body = document.createElement('section');
  body.className = 'band-light legal-doc-body';
  body.setAttribute('data-section', 'document-body');
  body.setAttribute('data-intent', 'reference');
  body.setAttribute('data-layout', 'toc-rail-plus-column');
  const bodyWrap = el('div', 'wrap doc-grid');
  body.append(bodyWrap);

  const toc = document.createElement('nav');
  toc.className = 'toc';
  toc.setAttribute('aria-labelledby', 'toc-label');
  const tocLabel = el('p', 'toc-label', 'On this page');
  tocLabel.id = 'toc-label';
  const tocList = document.createElement('ol');
  toc.append(tocLabel, tocList);

  const doc = el('div', 'doc');
  bodyWrap.append(toc, doc);

  // ---- 3 · legal-closing — quiet contact line, no marketing CTA ----
  const closing = document.createElement('section');
  closing.className = 'legal-closing';
  closing.setAttribute('data-section', 'legal-closing');
  closing.setAttribute('data-intent', 'reference');
  closing.setAttribute('data-layout', 'single-line');
  const closingWrap = el('div', 'wrap');
  closing.append(closingWrap);
  let hasClosing = false;

  let clause = null; // current clause <section>
  let clauseCount = 0;
  const target = () => clause || doc;

  rows.forEach((row) => {
    const cells = [...row.children];
    const token = cells[0]?.textContent.trim().toLowerCase() || '';

    switch (token) {
      case 'breadcrumb': {
        const nav = document.createElement('nav');
        nav.className = 'breadcrumb';
        nav.setAttribute('aria-label', 'Breadcrumb');
        const ol = document.createElement('ol');
        cells.slice(1).forEach((cell) => {
          const li = document.createElement('li');
          const a = linkFrom(cell);
          if (a) li.append(a);
          else {
            const span = el('span', null, cell.textContent.trim());
            span.setAttribute('aria-current', 'page');
            li.append(span);
          }
          ol.append(li);
        });
        nav.append(ol);
        headerWrap.append(nav);
        break;
      }
      case 'h2': {
        clauseCount += 1;
        const text = cells[1]?.textContent.trim() || '';
        const id = slugify(text);
        clause = el('section', 'clause');
        clause.setAttribute('data-section', `clause-${clauseCount}`);
        const h2 = document.createElement('h2');
        h2.id = id;
        h2.append(el('span', 'sn', `${clauseCount}.`), el('span', null, text));
        clause.append(h2);
        doc.append(clause);
        const a = el('a', null, text);
        a.href = `#${id}`;
        const li = document.createElement('li');
        li.append(a);
        tocList.append(li);
        break;
      }
      case 'h3':
        target().append(el('h3', null, cells[1]?.textContent.trim() || ''));
        break;
      case 'prose': {
        const holder = document.createElement('div');
        moveChildren(cells[1], holder);
        const dest = target();
        [...holder.children].forEach((child) => {
          if (dest === doc && child.tagName === 'P') child.classList.add('doc-intro');
          dest.append(child);
        });
        break;
      }
      case 'contact': {
        const card = document.createElement('address');
        card.className = 'contact-card';
        card.append(el('span', 'org', cells[1]?.textContent.trim() || ''));
        card.append(el('span', 'loc', cells[2]?.textContent.trim() || ''));
        const em = el('span', 'em');
        moveChildren(cells[3]?.querySelector('p') || cells[3], em);
        em.querySelectorAll('a').forEach((a) => {
          a.className = '';
          a.removeAttribute('class');
        });
        card.append(em);
        target().append(card);
        break;
      }
      case 'closing': {
        moveChildren(cells[1], closingWrap);
        hasClosing = true;
        break;
      }
      case 'closing-contact': {
        const line = el('p', 'contact-line');
        line.append(el('span', null, cells[1]?.textContent.trim() || ''));
        const a = linkFrom(cells[2]);
        if (a) line.append(a);
        if (cells[3]) line.append(el('span', null, cells[3].textContent.trim()));
        closingWrap.append(line);
        hasClosing = true;
        break;
      }
      default:
        break;
    }
  });

  // heading stack (after breadcrumb)
  if (kicker) headerWrap.append(el('p', 'kicker', kicker));
  if (h1) headerWrap.append(el('h1', null, h1.textContent.trim()));
  if (lede) headerWrap.append(el('p', 'lede', lede));
  if (updated) {
    const meta = el('p', 'legal-meta');
    const dot = el('span', 'dot');
    dot.setAttribute('aria-hidden', 'true');
    meta.append(dot, document.createTextNode(` ${updated}`));
    headerWrap.append(meta);
  }

  const sections = [header, body];
  if (hasClosing) sections.push(closing);
  block.replaceChildren(...sections);
  block.classList.remove(NAME);
  head?.remove();

  /* TOC scrollspy — additive wayfinding only; TOC fully functional without JS */
  if ('IntersectionObserver' in window) {
    const map = {};
    tocList.querySelectorAll('a').forEach((a) => {
      map[a.getAttribute('href').slice(1)] = a;
    });
    let current = null;
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        if (current) current.removeAttribute('aria-current');
        current = map[e.target.id];
        if (current) current.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.keys(map).forEach((id) => {
      const t = doc.querySelector(`#${id}`);
      if (t) spy.observe(t);
    });
  }
}
