/* lml-faq — local-lander FAQ: light-band single-column accordion (David's
   Model decode; distinct from the site-wide grouped dark `faq` register).
   Authored head (default content before the block) carries kicker / h2; each
   block row is [question, answer]. The "+" indicator is decorative, baked
   here. */

const NAME = 'lml-faq';

export default function decorate(block) {
  const head = block.closest(`.${NAME}-wrapper`)?.previousElementSibling;
  const kicker = head ? [...head.querySelectorAll('p')].find((p) => !p.querySelector('a')) : null;
  const h2 = head?.querySelector('h2');
  const rows = [...block.children].filter((r) => r.children.length >= 2);

  const section = document.createElement('section');
  section.className = 'band-light faq';
  section.setAttribute('data-section', 'faq');
  section.setAttribute('data-intent', 'objection-handling');
  section.setAttribute('data-layout', 'accordion');
  section.setAttribute('data-items', String(rows.length));
  section.innerHTML = `
    <div class="wrap">
      <div class="faq-head" data-reveal>
        ${kicker ? `<p class="kicker">${kicker.textContent.trim()}</p>` : ''}
        ${h2 ? `<h2>${h2.textContent.trim()}</h2>` : ''}
      </div>
      <div class="faq-list" data-reveal></div>
    </div>`;

  const list = section.querySelector('.faq-list');
  rows.forEach((row) => {
    const [q, a] = [...row.children];
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.append(document.createTextNode(q.textContent.trim()));
    const ind = document.createElement('span');
    ind.className = 'ind';
    ind.setAttribute('aria-hidden', 'true');
    ind.textContent = '+';
    summary.append(ind);
    const answer = document.createElement('p');
    answer.textContent = a.textContent.trim();
    details.append(summary, answer);
    list.append(details);
  });

  block.replaceChildren(section);
  block.classList.remove(NAME);
  head?.remove();
}
