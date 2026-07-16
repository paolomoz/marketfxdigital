/* legal-closing — quiet closing band (no marketing CTA; legal register).
   Rows: a single rich cell = closing paragraph(s); a 3-cell row
   [text][link][text] = the contact line. */

function linkFrom(cell) {
  const authored = cell?.querySelector('a');
  if (!authored) return null;
  const a = document.createElement('a');
  a.textContent = authored.textContent.trim();
  a.href = authored.getAttribute('href');
  return a;
}

export default function decorate(block) {
  const section = document.createElement('section');
  section.className = 'legal-closing';
  section.setAttribute('data-section', 'legal-closing');
  section.setAttribute('data-intent', 'reference');
  section.setAttribute('data-layout', 'single-line');
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  section.append(wrap);

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 3) {
      const line = document.createElement('p');
      line.className = 'contact-line';
      const s1 = document.createElement('span');
      s1.textContent = cells[0].textContent.trim();
      line.append(s1);
      const a = linkFrom(cells[1]);
      if (a) line.append(a);
      const s2 = document.createElement('span');
      s2.textContent = cells[2].textContent.trim();
      line.append(s2);
      wrap.append(line);
    } else if (cells[0]) {
      [...cells[0].childNodes].forEach((n) => wrap.append(n));
    }
  });

  block.replaceChildren(section);
  block.classList.remove('legal-closing');
}
