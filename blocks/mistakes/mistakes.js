/* mistakes — numbered pitfall list in the article flow. Rows: [h3 title][p body].
   Ordinals are presentation, generated here: zero-padded (01, 02, …) by default,
   bare (1, 2, …) with the `plain` variant. */
export default function decorate(block) {
  const plain = block.classList.contains('plain');
  const out = document.createDocumentFragment();
  [...block.children].forEach((row, i) => {
    const [title, body] = [...row.children];
    const ord = document.createElement('span');
    ord.className = 'mist-ord';
    ord.setAttribute('aria-hidden', 'true');
    ord.textContent = plain ? String(i + 1) : String(i + 1).padStart(2, '0');
    out.append(ord);
    const h = title?.querySelector('h1, h2, h3, h4');
    if (h) {
      out.append(h);
    } else {
      const h3 = document.createElement('h3');
      h3.textContent = title?.textContent.trim() || '';
      out.append(h3);
    }
    if (body) [...body.childNodes].forEach((n) => out.append(n));
  });
  block.replaceChildren(out);
  block.classList.remove('mistakes');
}
