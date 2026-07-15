/* references — source list in the article flow. Rows: single cell per source
   (inline links preserved). */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'refs';
  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    const li = document.createElement('li');
    if (cell) {
      const p = cell.querySelector('p');
      [...(p || cell).childNodes].forEach((n) => li.append(n));
    }
    ul.append(li);
  });
  block.replaceChildren(ul);
  block.classList.remove('references');
}
