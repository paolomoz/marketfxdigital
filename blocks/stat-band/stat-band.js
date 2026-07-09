/* stat-band — David's Model decode: one authored block row per stat, cells in
   order [number, caption, attribution]. Rebuilds the prototype 4-up stat grid.
   No decorative SVG in this section. */

export default function decorate(block) {
  const rows = [...block.children];
  const stats = rows.map((row) => {
    const cells = [...row.children];
    const num = cells[0]?.textContent.trim() || '';
    const cap = cells[1]?.textContent.trim() || '';
    const attr = cells[2]?.textContent.trim() || '';
    return `<div class="stat" data-reveal>
          <span class="num" data-countup>${num}</span>
          <span class="cap">${cap}</span>
          <span class="attr">${attr}</span>
        </div>`;
  }).join('\n        ');

  const section = document.createElement('section');
  section.className = 'stat-band';
  section.setAttribute('data-section', 'stat-band');
  section.setAttribute('data-intent', 'evidence');
  section.setAttribute('data-layout', 'contained-4up');
  section.setAttribute('data-items', String(rows.length));
  section.innerHTML = `
    <div class="wrap">
      <div class="stat-grid">
        ${stats}
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove('stat-band');
}
