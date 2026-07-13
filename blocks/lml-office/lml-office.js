/* lml-office — office + contact dark split (David's Model decode). Authored
   head (default content before the block) carries kicker / h2. Block rows:
   - 1 cell                              -> engagement prose (measured column)
   - 4 cells [name, role, address, link] -> the office card */

const NAME = 'lml-office';

export default function decorate(block) {
  const head = block.closest(`.${NAME}-wrapper`)?.previousElementSibling;
  const kicker = head ? [...head.querySelectorAll('p')].find((p) => !p.querySelector('a')) : null;
  const h2 = head?.querySelector('h2');

  const prose = [];
  let card = null;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 4) {
      const a = cells[3].querySelector('a');
      card = {
        name: cells[0].textContent.trim(),
        role: cells[1].textContent.trim(),
        addr: cells[2].textContent.trim(),
        href: a ? a.getAttribute('href') : '',
        link: a ? a.textContent.trim() : cells[3].textContent.trim(),
      };
    } else if (cells[0]) {
      prose.push(...cells[0].querySelectorAll('p'));
    }
  });

  const section = document.createElement('section');
  section.setAttribute('data-section', 'office-contact');
  section.setAttribute('data-intent', 'contact');
  section.setAttribute('data-layout', 'split-7-5');
  section.innerHTML = `
    <div class="wrap">
      <div data-reveal>
        ${kicker ? `<p class="kicker">${kicker.textContent.trim()}</p>` : ''}
        ${h2 ? `<h2>${h2.textContent.trim()}</h2>` : ''}
      </div>
      <div class="office-split">
        <div class="measure" data-reveal></div>
        ${card ? `<div class="office-card" data-reveal>
          <span class="name">${card.name}</span>
          <span class="role">${card.role}</span>
          <span class="addr">${card.addr}</span>
          <a class="text-link" href="${card.href}">${card.link}</a>
        </div>` : ''}
      </div>
    </div>`;
  section.querySelector('.measure').append(...prose);

  block.replaceChildren(section);
  block.classList.remove(NAME);
  head?.remove();
}
