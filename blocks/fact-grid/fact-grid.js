/* fact-grid — 2-up stat tiles in the article flow. Rows: [number][caption]. */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'fact-grid';
  [...block.children].forEach((row) => {
    const [num, cap] = [...row.children];
    const li = document.createElement('li');
    const n = document.createElement('span');
    n.className = 'num';
    n.textContent = num?.textContent.trim() || '';
    const c = document.createElement('span');
    c.className = 'cap';
    c.textContent = cap?.textContent.trim() || '';
    li.append(n, c);
    ul.append(li);
  });
  block.replaceChildren(ul);
  block.classList.remove('fact-grid');
}
