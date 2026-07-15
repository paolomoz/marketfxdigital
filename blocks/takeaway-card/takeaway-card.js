/* takeaway-card — tinted callout card in the article flow. Rows: [kicker h3][rich
   body (p/ul)]. All copy authored; only the card chrome is presentation. */
export default function decorate(block) {
  const card = document.createElement('div');
  card.className = 'takeaway-card';
  card.setAttribute('data-reveal', '');
  [...block.children].forEach((row) => {
    const [kicker, body] = [...row.children];
    if (kicker && kicker.textContent.trim()) {
      const h = kicker.querySelector('h1, h2, h3, h4') || kicker;
      const k = document.createElement('h3');
      k.className = 'k';
      k.textContent = h.textContent.trim();
      card.append(k);
    }
    if (body) [...body.childNodes].forEach((n) => card.append(n));
  });
  block.replaceChildren(card);
  block.classList.remove('takeaway-card');
}
