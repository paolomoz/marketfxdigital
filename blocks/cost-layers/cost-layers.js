/* cost-layers — ruled cost-breakdown rows in the article flow. Rows:
   [h3 title][tag][p body][range] (tag and range may be empty). Ordinals are
   presentation, generated here. */
export default function decorate(block) {
  const out = document.createDocumentFragment();
  [...block.children].forEach((row, i) => {
    const [title, tag, body, range] = [...row.children];
    const layer = document.createElement('div');
    layer.className = 'cost-layer';
    layer.setAttribute('data-reveal', '');
    const ord = document.createElement('span');
    ord.className = 'ord';
    ord.setAttribute('aria-hidden', 'true');
    ord.textContent = String(i + 1).padStart(2, '0');
    const div = document.createElement('div');
    const lt = document.createElement('p');
    lt.className = 'lt';
    lt.append(document.createTextNode(`${title?.textContent.trim() || ''} `));
    const tagText = tag?.textContent.trim();
    if (tagText) {
      const t = document.createElement('span');
      t.className = 'tag';
      t.textContent = tagText;
      lt.append(t);
    }
    div.append(lt);
    const p = document.createElement('p');
    p.textContent = body?.textContent.trim() || '';
    div.append(p);
    const rangeText = range?.textContent.trim();
    if (rangeText) {
      const r = document.createElement('span');
      r.className = 'range';
      r.textContent = rangeText;
      div.append(r);
    }
    layer.append(ord, div);
    out.append(layer);
  });
  block.replaceChildren(out);
  block.classList.remove('cost-layers');
}
