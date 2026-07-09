/* author-box — David's-Model decode. One block row holds the captured author
   fields [initials, name, role, bio, profile-link]. Rebuilds the hairline
   author card. Styles in this block's css. No baked SVG. */

const NAME = 'author-box';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  const cells = row ? [...row.children] : [];
  const initials = cells[0]?.textContent.trim() || '';
  const name = cells[1]?.textContent.trim() || '';
  const role = cells[2]?.textContent.trim() || '';
  const bio = cells[3]?.textContent.trim() || '';
  const link = cells[4]?.querySelector('a');

  const section = document.createElement('section');
  section.setAttribute('data-section', NAME);
  section.setAttribute('data-intent', 'trust');
  section.setAttribute('data-layout', 'hairline-card');

  const wrap = el('div', 'wrap');
  const card = el('div', 'author-card');
  card.setAttribute('data-reveal', '');

  const avatar = el('div', 'author-avatar', initials);
  avatar.setAttribute('aria-hidden', 'true');

  const body = document.createElement('div');
  body.append(el('span', 'who', name));
  body.append(el('span', 'role', role));
  body.append(el('p', null, bio));
  if (link) {
    const a = document.createElement('a');
    a.className = 'text-link';
    a.href = link.getAttribute('href');
    a.innerHTML = `${link.textContent.trim()} <span class="arr" aria-hidden="true">&rarr;</span>`;
    body.append(a);
  }

  card.append(avatar, body);
  wrap.append(card);
  section.append(wrap);
  block.replaceChildren(section);
  block.classList.remove(NAME);
}
