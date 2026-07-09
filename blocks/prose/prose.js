/* prose — generic long-form reading band for migrated pages. Lifts the authored
   cell content (headings/paragraphs/lists/tables/images/quotes) into a white
   band with a readable measure. David's-Model 'text'-style block. */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block.querySelector(':scope > div');
  const section = document.createElement('section');
  section.className = 'band-light prose-band';
  section.setAttribute('data-section', 'prose');
  const wrap = document.createElement('div');
  wrap.className = 'wrap prose-body';
  if (cell) while (cell.firstChild) wrap.appendChild(cell.firstChild);
  section.appendChild(wrap);
  block.replaceChildren(section);
  block.classList.remove('prose');
}
