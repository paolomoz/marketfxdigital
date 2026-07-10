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
  // DA wraps each cell's text in a <p>; unwrap it so we emit one clean styled
  // paragraph instead of nesting <p> (which the browser splits, dropping the class).
  const inner = (c) => {
    if (!c) return '';
    const p = c.children.length === 1 && c.firstElementChild?.tagName === 'P' ? c.firstElementChild : c;
    return p.innerHTML.trim();
  };
  rows.forEach((r) => {
    const [num, title, subtitle, situation, did, result, reviewed, takeaway] = [...r.children];
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
        <p>${inner(situation)}</p>
        <p>${inner(did)}</p>
        ${result ? `<p class="cs-result">${inner(result)}</p>` : ''}
        ${ul ? `<div class="cs-reviewed"><span class="cs-reviewed-label">What we reviewed first</span>${ul.outerHTML}</div>` : ''}
        ${takeaway ? `<p class="cs-takeaway">${inner(takeaway)}</p>` : ''}
      </div>`;
    list.appendChild(li);
  });
  wrap.appendChild(list);
  section.appendChild(wrap);
  block.replaceChildren(section);
  block.classList.remove('case-studies');
}
