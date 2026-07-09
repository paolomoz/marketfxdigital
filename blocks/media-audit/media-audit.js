/* media-audit — David's Model decode: reads the authored head + prose (kicker /
   h2 / paragraphs as default content, LEFT column) and two block rows — the
   "What We Evaluate" checklist card (the row carrying a <ul>) and the tinted
   proof exhibit ([value, source]) — then rebuilds the dark split. Dark surface
   is the default body field; .cap-card / .checklist / .exhibit come from the
   reused foundation (styles/styles.css). The .audit-split / .audit-rail layout
   lives in media-audit.css. No decorative SVG in this register. */

export default function decorate(block) {
  const head = block.closest('.media-audit-wrapper')?.previousElementSibling;
  const kicker = head?.querySelector('p')?.textContent.trim() || '';
  const heading = head?.querySelector('h2')?.textContent.trim() || '';
  const prose = head ? [...head.querySelectorAll('p')].slice(1)
    .map((p) => `<p>${p.innerHTML.trim()}</p>`).join('\n        ') : '';

  const rows = [...block.children];
  const cardRow = rows.find((r) => r.querySelector('ul'));
  const exhibitRow = rows.find((r) => !r.querySelector('ul'));

  const cardCells = cardRow ? [...cardRow.children] : [];
  const cardTitle = cardCells[0]?.textContent.trim() || '';
  const items = cardRow ? [...cardRow.querySelectorAll('li')]
    .map((li) => `<li><span class="tick" aria-hidden="true">&#10003;</span><span>${li.innerHTML.trim()}</span></li>`)
    .join('\n            ') : '';

  const exCells = exhibitRow ? [...exhibitRow.children] : [];
  const val = exCells[0]?.innerHTML.trim() || '';
  const src = exCells[1]?.innerHTML.trim() || '';

  const section = document.createElement('section');
  section.setAttribute('data-section', 'media-audit');
  section.setAttribute('data-intent', 'inform');
  section.setAttribute('data-layout', 'split');
  section.innerHTML = `
    <div class="wrap audit-split">
      <div data-reveal>
        <p class="kicker">${kicker}</p>
        <h2>${heading}</h2>
        ${prose}
      </div>
      <div class="audit-rail" data-reveal>
        <div class="cap-card">
          <h3>${cardTitle}</h3>
          <ul class="checklist">
            ${items}
          </ul>
        </div>
        <div class="exhibit">
          <span class="val">${val}</span>
          <span class="src">${src}</span>
        </div>
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove('media-audit');
  head?.remove();
}
