/* article-body — David's-Model decode of the FULL captured article. The DA block
   is a list of typed rows (first cell = token, remaining cells = editable text /
   inline links). This decode dispatches each row into the prototype's exact prose
   DOM: a white band-light section, single ≤72ch <article class="prose"> holding
   headings (with anchor ids), paragraphs, tinted takeaway cards, a fact grid,
   plabel eyebrows, six cost-layer rows, styled data tables (with per-cell
   data-labels for the ≤640px stack), the sizing tool card, numbered mistakes, a
   definitions list, references, an inline CTA row, and all inline links verbatim.
   All copy lives in DA; only presentation (classes, ordinals, table scaffolding)
   is generated here. No baked SVG. Styles in this block's css. */

const NAME = 'article-body';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

// move rich childNodes (p / ul / ol with inline a/em/strong) from a cell
function moveChildren(cell, target) {
  if (!cell) return;
  [...cell.childNodes].forEach((n) => target.append(n));
}

export default function decorate(block) {
  const rows = [...block.children];

  const section = document.createElement('section');
  section.className = 'band-light article-body';
  section.setAttribute('data-section', NAME);
  section.setAttribute('data-intent', 'education');
  section.setAttribute('data-layout', 'single-column-prose');

  const wrap = el('div', 'wrap');
  const article = el('article', 'prose');

  // target = where new nodes attach (article, or an open card)
  let target = article;
  // grouping state for consecutive same-type rows that share one container
  let group = null; // { type, container }
  // active data table being built
  let table = null;
  let tableHeaders = [];

  const flushGroup = () => { group = null; };
  const closeTable = () => { table = null; tableHeaders = []; };

  const attach = (node) => { target.append(node); };

  rows.forEach((row) => {
    const cells = [...row.children];
    const token = (cells[0]?.textContent.trim().toLowerCase()) || '';
    const c = (i) => cells[i];
    const t = (i) => cells[i]?.textContent.trim() || '';

    // any non-`tr` token closes an open table
    if (token !== 'tr' && table) closeTable();
    // any token that is not part of the current group flushes it
    if (group && token !== group.type) flushGroup();

    switch (token) {
      case 'card-open': {
        const card = el('div', t(1) || 'takeaway-card');
        card.setAttribute('data-reveal', '');
        attach(card);
        target = card;
        break;
      }
      case 'card-close':
        target = article;
        break;
      case 'k':
        attach(el('span', 'k', t(1)));
        break;
      case 'label': {
        const s = el('span', 'plabel', t(1));
        attach(s);
        break;
      }
      case 'label-signal': {
        const s = el('span', 'plabel plabel-signal', t(1));
        attach(s);
        break;
      }
      case 'h2': {
        const h = el('h2', null, t(2));
        if (t(1)) h.id = t(1);
        attach(h);
        break;
      }
      case 'h3': {
        const h = el('h3', null, t(2));
        if (t(1)) h.id = t(1);
        attach(h);
        break;
      }
      case 'prose': {
        const holder = document.createElement('div');
        moveChildren(c(1), holder);
        [...holder.children].forEach((child) => attach(child));
        break;
      }
      case 'fact': {
        if (!group) {
          group = { type: 'fact', container: el('ul', 'fact-grid') };
          attach(group.container);
        }
        const li = document.createElement('li');
        li.append(el('span', 'num', t(1)));
        li.append(el('span', 'cap', t(2)));
        group.container.append(li);
        break;
      }
      case 'cost-layer': {
        const layer = el('div', 'cost-layer');
        layer.setAttribute('data-reveal', '');
        const ord = el('span', 'ord', t(1));
        ord.setAttribute('aria-hidden', 'true');
        const bodyDiv = document.createElement('div');
        const lt = el('p', 'lt');
        lt.append(document.createTextNode(`${t(2)} `));
        if (t(3)) lt.append(el('span', 'tag', t(3)));
        bodyDiv.append(lt);
        bodyDiv.append(el('p', null, t(4)));
        if (t(5)) bodyDiv.append(el('span', 'range', t(5)));
        layer.append(ord, bodyDiv);
        attach(layer);
        break;
      }
      case 'mistake': {
        const ord = el('span', 'mist-ord', t(1));
        ord.setAttribute('aria-hidden', 'true');
        const h = el('h3', null, t(3));
        if (t(2)) h.id = t(2);
        attach(ord);
        attach(h);
        attach(el('p', null, t(4)));
        break;
      }
      case 'def': {
        if (!group) {
          group = { type: 'def', container: el('dl', 'defs') };
          attach(group.container);
        }
        group.container.append(el('dt', null, t(1)));
        group.container.append(el('dd', null, t(2)));
        break;
      }
      case 'ref': {
        if (!group) {
          group = { type: 'ref', container: el('ul', 'refs') };
          attach(group.container);
        }
        group.container.append(el('li', null, t(1)));
        break;
      }
      case 'step':
        attach(el('span', 'tool-step', t(1)));
        break;
      case 'opt': {
        if (!group) {
          group = { type: 'opt', container: el('ul', 'tool-opts') };
          attach(group.container);
        }
        const li = document.createElement('li');
        li.append(el('span', 'o', t(1)));
        li.append(el('span', 'd', t(2)));
        group.container.append(li);
        break;
      }
      case 'chip': {
        if (!group) {
          group = { type: 'chip', container: el('ul', 'chip-row') };
          attach(group.container);
        }
        group.container.append(el('li', null, t(1)));
        break;
      }
      case 'fine':
        attach(el('p', 'fine', t(1)));
        break;
      case 'table': {
        table = el('table', 'data-table');
        tableHeaders = cells.slice(2).map((x) => x.textContent.trim());
        if (t(1)) table.append(el('caption', null, t(1)));
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        tableHeaders.forEach((h) => {
          const th = el('th', null, h);
          th.setAttribute('scope', 'col');
          tr.append(th);
        });
        thead.append(tr);
        table.append(thead);
        table.append(document.createElement('tbody'));
        attach(table);
        break;
      }
      case 'tr': {
        if (!table) break;
        const tbody = table.querySelector('tbody');
        const tr = document.createElement('tr');
        cells.slice(1).forEach((cell, i) => {
          const val = cell.textContent.trim();
          let node;
          if (i === 0) {
            node = el('th', null, val);
            node.setAttribute('scope', 'row');
          } else {
            node = el('td', null, val);
          }
          if (tableHeaders[i]) node.setAttribute('data-label', tableHeaders[i]);
          tr.append(node);
        });
        tbody.append(tr);
        break;
      }
      case 'inline-cta': {
        const cta = el('div', 'inline-cta-row');
        cta.setAttribute('data-reveal', '');
        for (let i = 1; i + 1 < cells.length; i += 2) {
          const href = cells[i].textContent.trim();
          const text = cells[i + 1].textContent.trim();
          const a = document.createElement('a');
          a.className = 'text-link';
          a.href = href;
          a.innerHTML = `${text} <span class="arr" aria-hidden="true">&rarr;</span>`;
          cta.append(a);
        }
        attach(cta);
        break;
      }
      default:
        break;
    }
  });

  wrap.append(article);
  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
}
