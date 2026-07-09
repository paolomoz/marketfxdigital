/* leadership — David's Model decode: reads the authored head (kicker / h2 / body
   paragraphs as default content) and rebuilds the prototype WHITE single-column
   section. No repeating rows, no decorative SVG in this section. */

export default function decorate(block) {
  const head = block.closest('.leadership-wrapper')?.previousElementSibling;
  const h2Text = head?.querySelector('h2')?.textContent.trim() || '';
  const paras = head ? [...head.querySelectorAll('p')] : [];
  const eyebrow = paras[0]?.textContent.trim() || '';
  const body = paras.slice(1);

  const section = document.createElement('section');
  section.className = 'band-light';
  section.setAttribute('data-section', 'leadership');
  section.setAttribute('data-intent', 'trust');
  section.setAttribute('data-layout', 'single-column');

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const copy = document.createElement('div');
  copy.className = 'lead-copy';
  copy.setAttribute('data-reveal', '');
  const kicker = document.createElement('p');
  kicker.className = 'kicker';
  kicker.textContent = eyebrow;
  const h2 = document.createElement('h2');
  h2.textContent = h2Text;
  copy.append(kicker, h2);
  body.forEach((p) => {
    const np = document.createElement('p');
    np.append(...p.childNodes);
    copy.append(np);
  });

  wrap.append(copy);
  section.append(wrap);

  block.replaceChildren(section);
  block.classList.remove('leadership');
  head?.remove();
}
