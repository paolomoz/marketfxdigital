/* cmp-phases — time-to-impact comparison (agency-vs-in-house "Speed to Output").
   Two engagement tracks rendered as facing panels over a shared month axis; the
   live page's chart region and its per-phase bullet dupes are authored ONCE here.
   Authored default content BEFORE the block: kicker <p>, <h2>, lede <p>.
   Block rows:
     1 cell  -> axis labels (a <ul>, e.g. Month 1 … Month 6)
     4 cells -> one track: [track title, phases caption, phases <ul>
                ("Phase — output" items), summary line]. */

const NAME = 'cmp-phases';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

export default function decorate(block) {
  const wrapper = block.closest(`.${NAME}-wrapper`) || block.parentElement;
  const prev = wrapper.previousElementSibling;
  const head = prev && prev.classList.contains('default-content-wrapper') ? prev : null;

  const section = document.createElement('section');
  section.setAttribute('data-section', 'speed-to-output');
  section.setAttribute('data-intent', 'evidence');
  section.setAttribute('data-layout', 'phase-tracks');

  const wrap = el('div', 'wrap');

  if (head) {
    const h = el('div', 'ph-head');
    h.setAttribute('data-reveal', '');
    const kicker = head.querySelector('p');
    const h2 = head.querySelector('h2');
    if (kicker) h.append(el('p', 'kicker', kicker.textContent.trim()));
    if (h2) h.append(el('h2', null, h2.textContent.trim()));
    [...head.querySelectorAll('p')].slice(1).forEach((p, i) => {
      const out = el('p', i === 0 ? 'lede' : null);
      out.append(...p.childNodes);
      h.append(out);
    });
    wrap.append(h);
    head.remove();
  }

  const tracks = el('div', 'ph-tracks');
  tracks.setAttribute('data-reveal', '');
  let axis = null;
  let trackCount = 0;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      axis = el('ul', 'ph-axis');
      [...cells[0].querySelectorAll('li')].forEach((li) => axis.append(el('li', null, li.textContent.trim())));
      return;
    }
    const [title, cap, phases, summary] = cells;
    const panel = el('div', 'ph-track');
    if (title) panel.append(el('h3', null, title.textContent.trim()));
    if (cap) panel.append(el('p', 'ph-cap', cap.textContent.trim()));
    const ul = el('ul', 'ph-list');
    if (phases) {
      [...phases.querySelectorAll('li')].forEach((li) => {
        const item = document.createElement('li');
        item.append(...li.childNodes);
        ul.append(item);
      });
    }
    panel.append(ul);
    if (summary) panel.append(el('p', 'ph-sum', summary.textContent.trim()));
    tracks.append(panel);
    trackCount += 1;
  });
  section.setAttribute('data-items', String(trackCount));
  if (axis) wrap.append(axis);
  wrap.append(tracks);

  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
}
