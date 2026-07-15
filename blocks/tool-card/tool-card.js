/* tool-card — bordered utility card in the article flow. Single-cell rows:
   bold-line = step/kicker label, plain p = intro/question copy, list = chip row
   (plain items) or scored options (items with an <em> level tag), italic-line =
   fine print. Shape-based; all copy authored. */
export default function decorate(block) {
  const card = document.createElement('div');
  card.className = 'tool-card';
  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    [...cell.childNodes].forEach((n) => {
      if (n.tagName === 'UL' || n.tagName === 'OL') {
        const isOpts = [...n.children].some((li) => li.querySelector('em'));
        if (isOpts) {
          n.classList.add('tool-opts');
          [...n.children].forEach((li) => {
            const em = li.querySelector('em');
            const d = document.createElement('span');
            d.className = 'd';
            d.textContent = em ? em.textContent.trim() : '';
            if (em) em.remove();
            const o = document.createElement('span');
            o.className = 'o';
            o.textContent = li.textContent.trim();
            li.replaceChildren(o, d);
          });
        } else {
          n.classList.add('chip-row');
        }
      } else if (n.tagName === 'P') {
        const em = n.querySelector(':scope > em:only-child');
        if (em) {
          n.classList.add('fine');
          n.replaceChildren(...em.childNodes);
        }
      }
      card.append(n);
    });
  });
  block.replaceChildren(card);
  block.classList.remove('tool-card');
}
