/* approach-cards — David's Model decode: reads the authored head (kicker / h2 as
   default content) and one block row per capability card ([title, prose]), then
   rebuilds the dark 2x2 card grid. The dark surface is the default body field;
   .diagram-head / .cap-grid / .cap-card come from the reused foundation
   (styles/styles.css). No decorative SVG in this register. */

export default function decorate(block) {
  const head = block.closest('.approach-cards-wrapper')?.previousElementSibling;
  const kicker = head?.querySelector('p')?.textContent.trim() || '';
  const heading = head?.querySelector('h2')?.textContent.trim() || '';

  const cards = [...block.children].map((row) => {
    const cells = [...row.children];
    const title = cells[0]?.textContent.trim() || '';
    const prose = cells[1]?.innerHTML.trim() || '';
    return `
        <div class="cap-card">
          <h3>${title}</h3>
          <p>${prose}</p>
        </div>`;
  }).join('');

  const section = document.createElement('section');
  section.setAttribute('data-section', 'approach-cards');
  section.setAttribute('data-intent', 'inform');
  section.setAttribute('data-layout', 'card-grid');
  section.innerHTML = `
    <div class="wrap">
      <div class="diagram-head" data-reveal>
        <p class="kicker">${kicker}</p>
        <h2>${heading}</h2>
      </div>
      <div class="cap-grid" data-reveal>${cards}
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove('approach-cards');
  head?.remove();
}
