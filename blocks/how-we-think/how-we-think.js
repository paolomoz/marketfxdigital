/* how-we-think — David's Model decode: reads the authored head (kicker / h2 /
   body paragraphs as default content) and rebuilds the prototype DARK band with
   a centered measure. No repeating rows, no decorative SVG in this section. */

export default function decorate(block) {
  const head = block.closest('.how-we-think-wrapper')?.previousElementSibling;
  const h2Text = head?.querySelector('h2')?.textContent.trim() || '';
  const paras = head ? [...head.querySelectorAll('p')] : [];
  const eyebrow = paras[0]?.textContent.trim() || '';
  const body = paras.slice(1);

  const section = document.createElement('section');
  section.setAttribute('data-section', 'how-we-think');
  section.setAttribute('data-intent', 'education');
  section.setAttribute('data-layout', 'centered-measure');

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const measure = document.createElement('div');
  measure.className = 'center-measure';
  measure.setAttribute('data-reveal', '');
  const kicker = document.createElement('p');
  kicker.className = 'kicker';
  kicker.textContent = eyebrow;
  const h2 = document.createElement('h2');
  h2.textContent = h2Text;
  measure.append(kicker, h2);
  body.forEach((p) => {
    const np = document.createElement('p');
    np.append(...p.childNodes);
    measure.append(np);
  });

  wrap.append(measure);
  section.append(wrap);

  block.replaceChildren(section);
  block.classList.remove('how-we-think');
  head?.remove();
}
