/* definitions — term/definition list in the article flow. Rows: [term][definition]. */
export default function decorate(block) {
  const dl = document.createElement('dl');
  dl.className = 'defs';
  [...block.children].forEach((row) => {
    const [term, def] = [...row.children];
    const dt = document.createElement('dt');
    dt.textContent = term?.textContent.trim() || '';
    const dd = document.createElement('dd');
    if (def) {
      const p = def.querySelector('p');
      dd.textContent = (p || def).textContent.trim();
    }
    dl.append(dt, dd);
  });
  block.replaceChildren(dl);
  block.classList.remove('definitions');
}
