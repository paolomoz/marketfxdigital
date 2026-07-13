/* lml-audience — who-we-serve white band (David's Model decode). Authored head
   (default content before the block) carries kicker / h2 / lede. Block rows:
   - 2 cells [title, tail]            -> audience ledger item (2x2 grid)
   - 2 cells, first cell starts <em>  -> quote card [quote, follow]
   - 1 cell (prose)                   -> measured paragraph in the split below
   The split renders measure + quote card side by side; with no quote row the
   measure runs full width. */

const NAME = 'lml-audience';

export default function decorate(block) {
  const head = block.closest(`.${NAME}-wrapper`)?.previousElementSibling;
  const kicker = head ? [...head.querySelectorAll('p')].find((p) => !p.querySelector('a')) : null;
  const h2 = head?.querySelector('h2');
  const lede = kicker ? [...head.querySelectorAll('p')].find((p) => p !== kicker) : null;

  const items = [];
  const prose = [];
  let quote = null;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2 && cells[0].querySelector(':scope > p > em:first-child, :scope > em:first-child')) {
      quote = { q: cells[0].textContent.trim(), follow: cells[1].textContent.trim() };
    } else if (cells.length >= 2) {
      items.push({ title: cells[0].textContent.trim(), tail: cells[1].textContent.trim() });
    } else if (cells[0]) {
      prose.push(...cells[0].querySelectorAll('p'));
    }
  });

  const section = document.createElement('section');
  section.className = 'band-light';
  section.setAttribute('data-section', 'who-we-serve');
  section.setAttribute('data-intent', 'qualification');
  section.setAttribute('data-layout', quote ? 'ledger-2x2-plus-quote' : 'ledger-2x2');
  section.setAttribute('data-items', String(items.length));
  section.innerHTML = `
    <div class="wrap">
      <div class="serve-head" data-reveal>
        ${kicker ? `<p class="kicker">${kicker.textContent.trim()}</p>` : ''}
        ${h2 ? `<h2>${h2.textContent.trim()}</h2>` : ''}
        ${lede ? `<p class="lede">${lede.textContent.trim()}</p>` : ''}
      </div>
      <ul class="serve-grid">
        ${items.map((it) => `<li data-reveal><strong>${it.title}</strong> ${it.tail}</li>`).join('\n')}
      </ul>
      <div class="serve-split${quote ? '' : ' no-quote'}">
        <div class="measure" data-reveal></div>
        ${quote ? `<div class="quote-card" data-reveal><blockquote><p class="q">${quote.q}</p><p class="follow">${quote.follow}</p></blockquote></div>` : ''}
      </div>
    </div>`;
  section.querySelector('.measure').append(...prose);

  block.replaceChildren(section);
  block.classList.remove(NAME);
  head?.remove();
}
