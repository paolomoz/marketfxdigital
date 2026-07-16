/* legal-contact — address card inside the legal reading column. One row:
   [org][location][contact line with mailto link]. */
export default function decorate(block) {
  const cells = [...(block.firstElementChild?.children || [])];
  const card = document.createElement('address');
  card.className = 'contact-card';
  const org = document.createElement('span');
  org.className = 'org';
  org.textContent = cells[0]?.textContent.trim() || '';
  const loc = document.createElement('span');
  loc.className = 'loc';
  loc.textContent = cells[1]?.textContent.trim() || '';
  const em = document.createElement('span');
  em.className = 'em';
  const rich = cells[2]?.querySelector('p') || cells[2];
  if (rich) [...rich.childNodes].forEach((n) => em.append(n));
  em.querySelectorAll('a').forEach((a) => a.removeAttribute('class'));
  card.append(org, loc, em);
  block.replaceChildren(card);
  block.classList.remove('legal-contact');
}
