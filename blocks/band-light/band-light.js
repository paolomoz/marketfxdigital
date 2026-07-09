/* stardust generated block — recreates the prototype section verbatim so all lifted CSS matches. */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block.querySelector(':scope > div');
  const el = document.createElement('div'); el.className = "band-light"; 
  if (cell) { while (cell.firstChild) el.appendChild(cell.firstChild); }
  block.replaceChildren(el);
  block.classList.remove("band-light");
}
