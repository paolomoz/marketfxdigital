/* stardust block trust-logo-bar — template-slotted (markup baked so the DA pipeline can't strip inline SVG). */
const HTML = "\n    <div class=\"wrap\">\n      <p class=\"trust-label\">Trusted by category leaders</p>\n      <ul class=\"trust-row\" data-reveal>\n        <li><img src=\"https://marketfxdigital.com/assets/hp-DkVbsNNc.png\" alt=\"HP logo\" width=\"512\" height=\"512\" loading=\"lazy\" style=\"max-height:34px\"></li>\n        <li><img src=\"https://marketfxdigital.com/assets/samsung-1hMQWdQo.png\" alt=\"Samsung logo\" width=\"820\" height=\"291\" loading=\"lazy\" style=\"max-height:26px\"></li>\n        <li><img src=\"https://marketfxdigital.com/assets/7-eleven-CklDHIwG.png\" alt=\"7-Eleven logo\" width=\"741\" height=\"724\" loading=\"lazy\" style=\"max-height:36px\"></li>\n        <li><img src=\"https://marketfxdigital.com/assets/spence-diamonds-rK6esc_k.png\" alt=\"Spence Diamonds logo\" width=\"302\" height=\"85\" loading=\"lazy\" style=\"max-height:24px\"></li>\n        <li><img src=\"https://marketfxdigital.com/assets/cactus-club-cafe-4jS2anqk.png\" alt=\"Cactus Club Cafe logo\" width=\"263\" height=\"21\" loading=\"lazy\" style=\"max-height:12px\"></li>\n        <li><img src=\"https://marketfxdigital.com/assets/sap-DFXCEQF9.png\" alt=\"SAP logo\" width=\"542\" height=\"269\" loading=\"lazy\" style=\"max-height:30px\"></li>\n      </ul>\n    </div>\n  ";
export default function decorate(block) {
  const el = document.createElement('section');
  el.className = "trust";
  el.setAttribute('data-section', "trust-logo-bar");
  el.innerHTML = HTML;
  block.replaceChildren(el);
  block.classList.remove("trust-logo-bar");
}
