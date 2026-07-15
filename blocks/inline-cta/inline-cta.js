/* inline-cta — row of arrowed text links in the article flow. One row, one
   link per cell (real <a> elements, authored). */
export default function decorate(block) {
  const rowEl = document.createElement('div');
  rowEl.className = 'inline-cta-row';
  rowEl.setAttribute('data-reveal', '');
  block.querySelectorAll('a').forEach((a) => {
    a.className = 'text-link';
    const arr = document.createElement('span');
    arr.className = 'arr';
    arr.setAttribute('aria-hidden', 'true');
    arr.textContent = '→';
    a.append(document.createTextNode(' '), arr);
    rowEl.append(a);
  });
  block.replaceChildren(rowEl);
  block.classList.remove('inline-cta');
}
