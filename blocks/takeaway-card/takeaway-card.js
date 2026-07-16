/* takeaway-card — tinted callout card in the article flow. Rows: [kicker h3][rich
   body (p/ul)]. All copy authored; only the card chrome is presentation. */
export default function decorate(block) {
  const card = document.createElement('div');
  card.className = 'takeaway-card';
  card.setAttribute('data-reveal', '');
  [...block.children].forEach((row) => {
    const [kicker, body] = [...row.children];
    if (kicker && kicker.textContent.trim()) {
      const h = kicker.querySelector('h1, h2, h3, h4');
      // keep the authored heading level (lead cards use h2 so the outline
      // never jumps h1 -> h3; mid-article cards use h3)
      const k = document.createElement(h ? h.tagName.toLowerCase() : 'h3');
      k.className = 'k';
      k.textContent = (h || kicker).textContent.trim();
      card.append(k);
    }
    if (body) [...body.childNodes].forEach((n) => card.append(n));
  });
  block.replaceChildren(card);
  block.classList.remove('takeaway-card');
}
