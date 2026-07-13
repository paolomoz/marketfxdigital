/* cmp-ranked — the agency evaluation ledger (best-omnichannel rankings page).
   Entries render as ruled ledger articles on paper — never card walls; ordinals
   are baked (presentational). Authored default content BEFORE the block:
   kicker <p>, <h2>, lede <p>. Block rows:
     1 cell, text starting "To be completed" -> a reserved slot (the live page's
       own unfilled directory entries, authored once each, verbatim note kept)
     1 cell otherwise                        -> starts a new entry (agency name)
     2 cells [field label, value]            -> a field of the current entry
       (value may be a <p> or a <ul>; inline links preserved). */

const NAME = 'cmp-ranked';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

const pad = (n) => String(n).padStart(2, '0');

export default function decorate(block) {
  const wrapper = block.closest(`.${NAME}-wrapper`) || block.parentElement;
  const prev = wrapper.previousElementSibling;
  const head = prev && prev.classList.contains('default-content-wrapper') ? prev : null;

  const section = document.createElement('section');
  section.className = 'band-light';
  section.setAttribute('data-section', 'agency-ledger');
  section.setAttribute('data-intent', 'evaluation');
  section.setAttribute('data-layout', 'ruled-ledger');

  const wrap = el('div', 'wrap');

  if (head) {
    const h = el('div', 'rk-head');
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

  const ledger = el('ol', 'rk-ledger');
  let entry = null;
  let count = 0;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      count += 1;
      const li = el('li', 'rk-entry');
      li.setAttribute('data-reveal', '');
      const text = cells[0].textContent.trim();
      const ord = el('span', 'rk-ord', pad(count));
      ord.setAttribute('aria-hidden', 'true');
      if (/^to be completed/i.test(text)) {
        li.classList.add('rk-reserved');
        li.append(ord, el('p', 'rk-note', text));
        entry = null;
      } else {
        const header = el('div', 'rk-entry-head');
        header.append(ord, el('h3', null, text));
        li.append(header);
        entry = el('div', 'rk-fields');
        li.append(entry);
      }
      ledger.append(li);
      return;
    }
    if (!entry || cells.length < 2) return;
    const field = el('div', 'rk-field');
    field.append(el('div', 'rk-label', cells[0].textContent.trim()));
    const value = el('div', 'rk-value');
    const list = cells[1].querySelector('ul');
    if (list) {
      const ul = document.createElement('ul');
      [...list.querySelectorAll('li')].forEach((li) => {
        const item = document.createElement('li');
        item.append(...li.childNodes);
        ul.append(item);
      });
      value.append(ul);
    } else {
      [...cells[1].querySelectorAll('p')].forEach((p) => {
        const out = document.createElement('p');
        out.append(...p.childNodes);
        value.append(out);
      });
      if (!value.childNodes.length) value.textContent = cells[1].textContent.trim();
    }
    field.append(value);
    entry.append(field);
  });
  section.setAttribute('data-items', String(count));
  wrap.append(ledger);

  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
}
