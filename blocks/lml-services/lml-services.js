/* lml-services — services ledger on the dim white band (David's Model decode).
   Authored head (default content before the block) carries kicker / h2 /
   intro paragraph. Block rows:
   - 1 cell                      -> a service item (two-column hairline ledger)
   - 2 cells ["resources", p]    -> the deep-dive resources strip */

const NAME = 'lml-services';

export default function decorate(block) {
  const head = block.closest(`.${NAME}-wrapper`)?.previousElementSibling;
  const kicker = head ? [...head.querySelectorAll('p')].find((p) => !p.querySelector('a')) : null;
  const h2 = head?.querySelector('h2');
  const intro = kicker ? [...head.querySelectorAll('p')].find((p) => p !== kicker) : null;

  const services = [];
  let resources = null;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2 && cells[0].textContent.trim().toLowerCase() === 'resources') {
      [, resources] = cells;
    } else if (cells[0]) {
      services.push(cells[0]);
    }
  });

  const section = document.createElement('section');
  section.className = 'band-light band-dim';
  section.setAttribute('data-section', 'services-ledger');
  section.setAttribute('data-intent', 'service-catalog');
  section.setAttribute('data-layout', 'two-column-ledger');
  section.setAttribute('data-items', String(services.length));
  section.innerHTML = `
    <div class="wrap">
      <div class="svc-head" data-reveal>
        ${kicker ? `<p class="kicker">${kicker.textContent.trim()}</p>` : ''}
        ${h2 ? `<h2>${h2.textContent.trim()}</h2>` : ''}
        ${intro ? `<p>${intro.textContent.trim()}</p>` : ''}
      </div>
      <ul class="svc-grid"></ul>
      <div class="resources" data-reveal></div>
    </div>`;

  const grid = section.querySelector('.svc-grid');
  services.forEach((cell) => {
    const li = document.createElement('li');
    li.setAttribute('data-reveal', '');
    const p = cell.querySelector('p');
    li.append(...(p || cell).childNodes);
    grid.append(li);
  });

  const strip = section.querySelector('.resources');
  if (resources) strip.append(...resources.querySelectorAll('p'));
  else strip.remove();

  block.replaceChildren(section);
  block.classList.remove(NAME);
  head?.remove();
}
