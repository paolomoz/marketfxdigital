/* lml-narrative — dark narrative band with verbatim pull-emphasis (David's
   Model decode). Authored head (default content before the block) carries the
   kicker and an optional h2; block rows are [variant, content] where variant
   is "prose" or "pull". Consecutive prose rows group into one measured column;
   a pull row renders as the large pull-emphasis paragraph. An authored <em>
   inside a pull marks the tone-accented phrase (semantic emphasis in content,
   cyan accent in presentation). */

const NAME = 'lml-narrative';

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

  const section = document.createElement('section');
  section.className = 'market';
  section.setAttribute('data-section', 'narrative');
  section.setAttribute('data-intent', 'education');
  section.setAttribute('data-layout', 'measured-prose-pull');
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  section.append(wrap);

  let measure = null;
  const openMeasure = () => {
    if (measure) return measure;
    measure = document.createElement('div');
    measure.className = 'measure';
    measure.setAttribute('data-reveal', '');
    wrap.append(measure);
    return measure;
  };

  // authored head opens the first measure
  const first = openMeasure();
  if (kicker) {
    const k = document.createElement('p');
    k.className = 'kicker';
    k.textContent = kicker.textContent.trim();
    first.append(k);
  }
  if (h2) first.append(h2);

  [...block.children].forEach((row) => {
    const [variantCell, contentCell] = [...row.children];
    if (!contentCell) return;
    const variant = variantCell.textContent.trim().toLowerCase();
    if (variant === 'pull') {
      measure = null;
      const pull = document.createElement('p');
      pull.className = 'pull';
      pull.setAttribute('data-reveal', '');
      const src = contentCell.querySelector('p') || contentCell;
      pull.append(...src.childNodes);
      toneEmphasis(pull);
      wrap.append(pull);
      return;
    }
    const m = openMeasure();
    m.append(...contentCell.querySelectorAll('p'));
  });

  block.replaceChildren(section);
  block.classList.remove(NAME);
  head?.remove();
}
