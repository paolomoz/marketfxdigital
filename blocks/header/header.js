/* stardust header — lifted prototype chrome + hamburger + scroll shadow (vanilla EDS block JS runs). */
export default function decorate(block) {
  const host = block.closest('header') || block;
  host.className = "site-header";
  host.innerHTML = "\n  <div class=\"wrap header-bar\">\n    <a class=\"brand-lockup\" href=\"/\" aria-label=\"marketFX digital — home\">\n      <img src=\"/img/logo.png\" alt=\"\" width=\"30\" height=\"28\">\n      <span>marketFX</span>\n    </a>\n    <button class=\"nav-burger\" id=\"nav-toggle\" aria-expanded=\"false\" aria-controls=\"site-nav\" aria-label=\"Menu\">\n      <span></span><span></span><span></span>\n    </button>\n    <nav class=\"site-nav\" id=\"site-nav\" aria-label=\"Primary\">\n      <ul>\n        <li><a href=\"/\" aria-current=\"page\">Home</a></li>\n        <li><a href=\"/services\">Services</a></li>\n        <li><a href=\"/testimonials\">Work</a></li>\n        <li><a href=\"/blog\">Insights</a></li>\n        <li><a href=\"/about-us\">About</a></li>\n        <li><a href=\"/contact-us\">Contact</a></li>\n      </ul>\n    </nav>\n    <div class=\"header-cta\">\n      <a class=\"btn btn-primary\" href=\"/contact-us\">Book a Strategy Call</a>\n    </div>\n  </div>\n";
  const toggle = host.querySelector('#nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = host.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && host.classList.contains('nav-open')) {
        host.classList.remove('nav-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
      }
    });
  }
  addEventListener('scroll', () => host.classList.toggle('scrolled', scrollY > 8), { passive: true });
}
