/* cmp-hero — comparison-editorial hero (David's-Model decode). Authored default
   content before the block: breadcrumb <ol> (last item = current page), kicker <p>,
   <h1>, lede <p>. Block rows: [guide chip, guide note] and [primary CTA, secondary
   CTA] (authored <strong><a>/<em><a>, or already buttonized as a.primary/a.secondary).
   The dark radial field, dot-grid and glow come from styles.css .hero pseudo-elements. */

const NAME = 'cmp-hero';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function readLink(scope, wrapTag) {
  const cls = wrapTag === 'strong' ? 'primary' : 'secondary';
  const a = scope.querySelector(`${wrapTag} a`) || scope.querySelector(`a.${cls}`);
  return a ? { href: a.getAttribute('href'), text: a.textContent.trim() } : null;
}

export default function decorate(block) {
  const head = block.closest(`.${NAME}-wrapper`)?.previousElementSibling;
  const crumbs = head ? [...head.querySelectorAll('ol li')] : [];
  const paras = head ? [...head.querySelectorAll(':scope > p')] : [];
  const kicker = paras[0]?.textContent.trim() || '';
  const lede = paras[1]?.textContent.trim() || '';
  const headline = head?.querySelector('h1')?.textContent.trim() || '';

  const rows = [...block.children];
  const guideCells = rows[0] ? [...rows[0].children] : [];
  const chip = guideCells[0]?.textContent.trim() || '';
  const note = guideCells[1]?.textContent.trim() || '';
  const ctaRow = rows[1] || block;
  const primary = readLink(ctaRow, 'strong');
  const secondary = readLink(ctaRow, 'em');

  const section = document.createElement('section');
  section.className = 'hero';
  section.setAttribute('data-section', 'hero');
  section.setAttribute('data-intent', 'conversion');
  section.setAttribute('data-layout', 'comparison');

  const wrap = el('div', 'wrap');

  if (crumbs.length) {
    const nav = el('nav', 'breadcrumb');
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.setAttribute('data-reveal', '');
    const ol = document.createElement('ol');
    crumbs.forEach((li, i) => {
      const item = document.createElement('li');
      const a = li.querySelector('a');
      if (a && i < crumbs.length - 1) {
        const link = el('a', null, a.textContent.trim());
        link.href = a.getAttribute('href');
        item.append(link);
      } else {
        const span = el('span', null, li.textContent.trim().replace(/^\//, ''));
        if (i === crumbs.length - 1) span.setAttribute('aria-current', 'page');
        item.append(span);
      }
      ol.append(item);
    });
    nav.append(ol);
    wrap.append(nav);
  }

  const intro = document.createElement('div');
  intro.setAttribute('data-reveal', '');
  if (kicker) intro.append(el('p', 'kicker', kicker));
  if (headline) intro.append(el('h1', null, headline));
  if (lede) intro.append(el('p', 'hero-lede', lede));
  wrap.append(intro);

  if (chip || note) {
    const guide = el('div', 'guide-note');
    guide.setAttribute('data-reveal', '');
    if (chip) guide.append(el('span', 'guide-chip', chip));
    if (note) guide.append(el('p', null, note));
    wrap.append(guide);
  }

  const actions = el('div', 'hero-actions');
  actions.setAttribute('data-reveal', '');
  if (primary) {
    const a = el('a', 'btn btn-primary', primary.text);
    a.href = primary.href;
    actions.append(a);
  }
  if (secondary) {
    const a = el('a', 'btn btn-secondary', secondary.text);
    a.href = secondary.href;
    actions.append(a);
  }
  if (actions.children.length) wrap.append(actions);

  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
  head?.remove();
}
