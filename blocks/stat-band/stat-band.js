/* stardust block stat-band — template-slotted (markup baked so the DA pipeline can't strip inline SVG). */
const HTML = "\n    <div class=\"wrap\">\n      <div class=\"stat-grid\">\n        <div class=\"stat\" data-reveal>\n          <span class=\"num\" data-countup>94%</span>\n          <span class=\"cap\">Client retention</span>\n          <span class=\"attr\">Avg. client partnership 10+ years</span>\n        </div>\n        <div class=\"stat\" data-reveal>\n          <span class=\"num\" data-countup>4.2x</span>\n          <span class=\"cap\">Avg. ROAS improvement</span>\n          <span class=\"attr\">Managed paid-media portfolios, 2025</span>\n        </div>\n        <div class=\"stat\" data-reveal>\n          <span class=\"num\" data-countup>20+</span>\n          <span class=\"cap\">Years driving growth</span>\n          <span class=\"attr\">Founded 2004 &middot; Scottsdale + Vancouver</span>\n        </div>\n        <div class=\"stat\" data-reveal>\n          <span class=\"num\" data-countup>$20M+</span>\n          <span class=\"cap\">Revenue tracked for clients</span>\n          <span class=\"attr\">Cross-channel attribution reporting</span>\n        </div>\n      </div>\n    </div>\n  ";
export default function decorate(block) {
  const el = document.createElement('section');
  el.className = "stat-band";
  el.setAttribute('data-section', "stat-band");
  el.innerHTML = HTML;
  block.replaceChildren(el);
  block.classList.remove("stat-band");
}
