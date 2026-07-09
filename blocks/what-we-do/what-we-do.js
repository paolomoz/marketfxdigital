/* what-we-do — David's Model decode: reads the authored kicker / h2 / prose
   paragraphs (including the inline performance-marketing-agency link) held in
   the block's single cell, then rebuilds the white reading band. The white
   surface comes from the reused .band-light foundation (styles/styles.css);
   the ≤72ch reading measure comes from base p rules. .prose-band spacing is in
   what-we-do.css. */

export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block;
  const kicker = cell.querySelector('p')?.textContent.trim() || '';
  const heading = cell.querySelector('h2')?.textContent.trim() || '';
  // body paragraphs = every <p> after the kicker (preserve inline links via innerHTML)
  const bodyParas = [...cell.querySelectorAll('p')].slice(1)
    .map((p) => `<p>${p.innerHTML.trim()}</p>`).join('\n      ');

  const section = document.createElement('section');
  section.className = 'band-light prose-band';
  section.setAttribute('data-section', 'what-we-do');
  section.setAttribute('data-intent', 'inform');
  section.setAttribute('data-layout', 'prose-column');
  section.innerHTML = `
    <div class="wrap" data-reveal>
      <p class="kicker">${kicker}</p>
      <h2>${heading}</h2>
      ${bodyParas}
    </div>`;

  block.replaceChildren(section);
  block.classList.remove('what-we-do');
}
