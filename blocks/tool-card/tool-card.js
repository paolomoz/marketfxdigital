/* tool-card — bordered utility card in the article flow. Single-cell rows in
   order: bold-line kicker, h3 title, intro p, chip list (ul), fine-print p.
   Shape-based: the ul becomes the chip row; the p after the ul is fine print. */
export default function decorate(block) {
  const card = document.createElement('div');
  card.className = 'tool-card';
  let seenList = false;
  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    [...cell.childNodes].forEach((n) => {
      if (n.tagName === 'UL' || n.tagName === 'OL') {
        n.classList.add('chip-row');
        seenList = true;
      } else if (n.tagName === 'P' && seenList) {
        n.classList.add('fine');
      }
      card.append(n);
    });
  });
  block.replaceChildren(card);
  block.classList.remove('tool-card');
}
