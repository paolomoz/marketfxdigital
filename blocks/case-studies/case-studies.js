/* case-studies — numbered two-column divided list (reproduces the live /testimonials
   layout in the brand system). One authored row per case; cells:
   [number, title, subtitle, situation, whatWeDid, result, reviewed(<ul>), takeaway]. */
export default function decorate(block) {
  const rows = [...block.children];
  const section = document.createElement('section');
  section.className = 'band-light case-studies';
  section.setAttribute('data-section', 'case-studies');
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  // Reabsorb the authored section head (default content in the same section, before
  // the block) as a centered intro on the white band.
  const introDC = block.parentElement?.previousElementSibling;
  if (introDC && introDC.classList.contains('default-content-wrapper')) {
    const intro = document.createElement('div');
    intro.className = 'cs-intro';
    while (introDC.firstChild) intro.appendChild(introDC.firstChild);
    wrap.appendChild(intro);
    introDC.remove();
  }
  const list = document.createElement('ol');
  list.className = 'cs-list';
  const cell = (r, i) => r.children[i]?.textContent.trim() || '';
  rows.forEach((r) => {
    const [num, title, subtitle, situation, did, result, reviewed, takeaway] = [...r.children].map((c) => c);
    const ul = reviewed?.querySelector('ul');
    const li = document.createElement('li');
    li.className = 'cs-item';
    li.innerHTML = `
      <div class="cs-head">
        <span class="cs-num">${num?.textContent.trim() || ''}</span>
        <h3>${title?.textContent.trim() || ''}</h3>
        <p class="cs-sub">${subtitle?.textContent.trim() || ''}</p>
      </div>
      <div class="cs-body">
        <p>${situation?.innerHTML.trim() || ''}</p>
        <p>${did?.innerHTML.trim() || ''}</p>
        ${result ? `<p class="cs-result">${result.innerHTML.trim()}</p>` : ''}
        ${ul ? `<div class="cs-reviewed"><span class="cs-reviewed-label">What we reviewed first</span>${ul.outerHTML}</div>` : ''}
        ${takeaway ? `<p class="cs-takeaway">${takeaway.innerHTML.trim()}</p>` : ''}
      </div>`;
    list.appendChild(li);
  });
  wrap.appendChild(list);
  section.appendChild(wrap);
  block.replaceChildren(section);
  block.classList.remove('case-studies');
}
