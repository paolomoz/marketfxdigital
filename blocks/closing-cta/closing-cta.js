/* stardust block closing-cta — template-slotted (markup baked so the DA pipeline can't strip inline SVG). */
const HTML = "\n    <div class=\"wrap\">\n      <div data-reveal>\n        <p class=\"kicker\">30-min strategy call</p>\n        <h2>Ready to unify your marketing?</h2>\n        <p class=\"lede\">Book a 30-minute strategy session. No pitch deck, just a focused conversation about what's working and what isn't.</p>\n        <div class=\"closing-actions\">\n          <a class=\"btn btn-primary\" href=\"/contact-us\">Book a Strategy Call</a>\n          <a class=\"text-link\" href=\"/marketing-audit-services\">Request a Marketing Audit <span class=\"arr\" aria-hidden=\"true\">&rarr;</span></a>\n        </div>\n        <ul class=\"closing-notes\">\n          <li>No pitch deck, just answers</li>\n          <li>Reply within 24 hours</li>\n          <li>Scottsdale, AZ &middot; Vancouver, BC</li>\n          <li><a href=\"mailto:info@marketfxdigital.com\">info@marketfxdigital.com</a></li>\n        </ul>\n      </div>\n      <div class=\"exhibit-ember\" data-reveal>\n        <span class=\"val\">7-Eleven Canada: <strong>10+ year partnership</strong>, multimillion-dollar program built without headcount increase</span>\n        <span class=\"src\">Client outcome &middot; marketFX client results</span>\n      </div>\n    </div>\n  ";
export default function decorate(block) {
  const el = document.createElement('section');
  el.className = "closing";
  el.setAttribute('data-section', "closing-cta");
  el.innerHTML = HTML;
  block.replaceChildren(el);
  block.classList.remove("closing-cta");
}
