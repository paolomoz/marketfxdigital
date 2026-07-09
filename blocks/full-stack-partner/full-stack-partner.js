/* stardust block full-stack-partner — template-slotted (markup baked so the DA pipeline can't strip inline SVG). */
const HTML = "\n    <div class=\"wrap\">\n      <div class=\"partner-head\" data-reveal>\n        <h2>A full-stack marketing partner for enterprise, franchise, and multi-location brands</h2>\n      </div>\n      <div class=\"partner-cols\">\n        <div data-reveal>\n          <h3>Who we help</h3>\n          <p>Enterprise brands, franchise systems, multi-location operators, and growth-focused marketing leaders who need one accountable partner instead of five fragmented vendors.</p>\n        </div>\n        <div data-reveal>\n          <h3>What we do</h3>\n          <p>We audit, optimize, and scale marketing performance across <a href=\"/paid-media-audit-and-strategy\">paid media</a>, <a href=\"/seo-and-ai-visibility-consulting\">SEO and AI visibility</a>, <a href=\"/marketing-analytics-consulting\">analytics</a>, CRM, content, and conversion, unified into one growth system.</p>\n        </div>\n        <div data-reveal>\n          <h3>Why we're different</h3>\n          <p>A senior, integrated team measured on revenue, not activity. Start with a <a href=\"/marketing-audit-services\">full-funnel marketing audit</a> or work with us as your <a href=\"/multi-location-franchise-marketing-agency\">multi-location marketing partner</a>.</p>\n        </div>\n      </div>\n    </div>\n  ";
export default function decorate(block) {
  const el = document.createElement('section');
  el.className = "band-light partner-light";
  el.setAttribute('data-section', "full-stack-partner");
  el.innerHTML = HTML;
  block.replaceChildren(el);
  block.classList.remove("full-stack-partner");
}
