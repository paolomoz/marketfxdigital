/* stardust header — fetches the /nav DA fragment (content in DA) and builds the site chrome. */
export default async function decorate(block) {
  const host = block.closest('header') || block;
  host.className = 'site-header';
  let doc = null;
  try { const r = await fetch('/nav.plain.html'); if (r.ok) doc = new DOMParser().parseFromString(await r.text(), 'text/html').body; } catch (e) { /* noop */ }
  const brand = doc && (doc.querySelector('picture') || doc.querySelector('img'));
  const navUl = doc && doc.querySelector('ul');
  const cta = doc && [...doc.querySelectorAll('a')].find((a) => /book a strategy/i.test(a.textContent));
  host.innerHTML = `<div class="wrap header-bar">
    <a class="brand-lockup" href="/" aria-label="marketFX digital — home">${brand ? brand.outerHTML : ''}<span>marketFX</span></a>
    <button class="nav-burger" id="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Menu"><span></span><span></span><span></span></button>
    <nav class="site-nav" id="site-nav" aria-label="Primary">${navUl ? navUl.outerHTML : ''}</nav>
    <div class="header-cta">${cta ? `<a class="btn btn-primary" href="${cta.getAttribute('href')}">${cta.textContent.trim()}</a>` : ''}</div>
  </div>`;
  // multi-level menus: any top-level <li> with a nested <ul> becomes a dropdown.
  host.querySelectorAll('.site-nav > ul > li').forEach((li) => {
    const sub = li.querySelector(':scope > ul');
    if (!sub) return;
    li.classList.add('has-submenu');
    const link = li.querySelector(':scope > a');
    const label = link ? link.textContent.trim() : 'menu';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'submenu-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', `Toggle ${label} submenu`);
    btn.innerHTML = '<span class="chev" aria-hidden="true"></span>';
    li.insertBefore(btn, sub);
    btn.addEventListener('click', () => {
      const open = !li.classList.contains('open');
      host.querySelectorAll('.site-nav > ul > li.open').forEach((o) => {
        if (o !== li) { o.classList.remove('open'); o.querySelector(':scope > .submenu-toggle')?.setAttribute('aria-expanded', 'false'); }
      });
      li.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  // close any open dropdown when focus or a click leaves the nav
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.site-nav')) {
      host.querySelectorAll('.site-nav > ul > li.open').forEach((o) => {
        o.classList.remove('open'); o.querySelector(':scope > .submenu-toggle')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  const t = host.querySelector('#nav-toggle');
  if (t) {
    t.addEventListener('click', () => { const o = host.classList.toggle('nav-open'); t.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        host.querySelectorAll('.site-nav > ul > li.open').forEach((o) => { o.classList.remove('open'); o.querySelector(':scope > .submenu-toggle')?.setAttribute('aria-expanded', 'false'); });
        if (host.classList.contains('nav-open')) { host.classList.remove('nav-open'); t.setAttribute('aria-expanded', 'false'); t.focus(); }
      }
    });
  }
  window.addEventListener('scroll', () => {
    host.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });
}
