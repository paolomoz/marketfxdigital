/* lml-chain — one-team system-chain band (David's Model decode). Authored head
   (default content before the block) carries kicker / h2 / leading paragraphs.
   Block rows:
   - 1 cell               -> a chain cell (the connecting arrows are decorative,
                              applied in CSS at desktop widths)
   - 2 cells [variant, p]  -> "prose" (measured paragraph) or "pull" (closer)
   rendered after the chain in authored order. */

const NAME = 'lml-chain';

function toneEmphasis(scope) {
  scope.querySelectorAll('em').forEach((em) => {
    const tone = document.createElement('span');
    tone.className = 'tone';
    tone.append(...em.childNodes);
    em.replaceWith(tone);
  });
}

export default function decorate(block) {
  const head = block.closest(`.${NAME}-wrapper`)?.previousElementSibling;
  const kicker = head ? [...head.querySelectorAll('p')].find((p) => !p.querySelector('a')) : null;
  const h2 = head?.querySelector('h2');
  const leadParas = head ? [...head.querySelectorAll('p')].filter((p) => p !== kicker) : [];

  const cells = [];
  const after = [];
  [...block.children].forEach((row) => {
    const rc = [...row.children];
    if (rc.length === 1) {
      cells.push(rc[0].textContent.trim());
      return;
    }
    if (rc.length >= 2) {
      after.push({ variant: rc[0].textContent.trim().toLowerCase(), cell: rc[1] });
    }
  });

  const section = document.createElement('section');
  section.setAttribute('data-section', 'one-team-model');
  section.setAttribute('data-intent', 'differentiation');
  section.setAttribute('data-layout', 'prose-chain-pull');
  section.setAttribute('data-items', String(cells.length));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  section.append(wrap);

  const headMeasure = document.createElement('div');
  headMeasure.className = 'measure';
  headMeasure.setAttribute('data-reveal', '');
  if (kicker) {
    const k = document.createElement('p');
    k.className = 'kicker';
    k.textContent = kicker.textContent.trim();
    headMeasure.append(k);
  }
  if (h2) headMeasure.append(h2);
  headMeasure.append(...leadParas);
  wrap.append(headMeasure);

  const chain = document.createElement('ul');
  chain.className = 'chain';
  chain.setAttribute('aria-label', 'How the system compounds');
  cells.forEach((text) => {
    const li = document.createElement('li');
    li.setAttribute('data-reveal', '');
    li.textContent = text;
    chain.append(li);
  });
  wrap.append(chain);

  let measure = null;
  after.forEach(({ variant, cell }) => {
    if (variant === 'pull') {
      measure = null;
      const pull = document.createElement('p');
      pull.className = 'pull';
      pull.setAttribute('data-reveal', '');
      const src = cell.querySelector('p') || cell;
      pull.append(...src.childNodes);
      toneEmphasis(pull);
      wrap.append(pull);
      return;
    }
    if (!measure) {
      measure = document.createElement('div');
      measure.className = 'measure';
      measure.setAttribute('data-reveal', '');
      wrap.append(measure);
    }
    measure.append(...cell.querySelectorAll('p'));
  });

  block.replaceChildren(section);
  block.classList.remove(NAME);
  head?.remove();
}
