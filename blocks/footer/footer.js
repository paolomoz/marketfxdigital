/* stardust footer — fetches the /footer DA fragment (content in DA) and builds the footer grid. */
export default async function decorate(block) {
  const host = block.closest('footer') || block;
  host.className = 'footer';
  let doc = null;
  try { const r = await fetch('/footer.plain.html'); if (r.ok) doc = new DOMParser().parseFromString(await r.text(), 'text/html').body; } catch (e) { /* noop */ }
  if (!doc) return;
  const nodes = [...(doc.querySelector('div') || doc).children];
  const brandMedia = doc.querySelector('picture, img');
  // brand blurb = first <p> without a link-image (the paragraph after the logo)
  const ps = nodes.filter((n) => n.tagName === 'P');
  const blurb = ps.find((p) => !p.querySelector('img, picture') && p.textContent.length > 60);
  // column groups: each <h3> followed by its <ul> (or <p> for certifications)
  const cols = [];
  nodes.forEach((n, i) => { if (n.tagName === 'H3') { const next = nodes[i + 1]; cols.push({ title: n.textContent.trim(), body: next }); } });
  const legal = ps.find((p) => /rights reserved/i.test(p.textContent));
  const certs = cols.find((c) => /certification/i.test(c.title));
  const linkCols = cols.filter((c) => c !== certs);
  const grid = `<div class="footer-grid">
    <div class="footer-brand"><a class="brand-lockup" href="/" aria-label="marketFX digital — home">${brandMedia ? brandMedia.outerHTML : ''}<span>marketFX</span></a>${blurb ? `<p>${blurb.innerHTML}</p>` : ''}</div>
    ${linkCols.map((c) => `<nav aria-label="${c.title}"><h3>${c.title}</h3>${c.body && c.body.tagName === 'UL' ? c.body.outerHTML.replace('<ul>', '<ul class="footer-links">') : ''}</nav>`).join('')}
  </div>
  ${certs ? `<div class="footer-certs"><h3>${certs.title}</h3>${certs.body ? certs.body.outerHTML : ''}</div>` : ''}
  ${legal ? `<div class="footer-legal">${legal.innerHTML}</div>` : ''}`;
  host.innerHTML = `<div class="wrap">${grid}</div>`;
  // footer marks render at <=40px: swap content-bus media to small webply renditions (audit F-008)
  host.querySelectorAll('img[src*="media_"]').forEach((img) => {
    const [base] = img.src.split('?');
    img.src = `${base}?width=200&format=webply&optimize=medium`;
    img.loading = 'lazy';
  });
}
