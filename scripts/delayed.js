// Delayed phase — post-LCP third-party integrations (analytics + widgets).
// Captured from the source site. Placeholders flagged for the brand team.

// --- Google Analytics 4 + Google Tag Manager (captured: G-71V438BM6F / GTM-T994VXBG) ---
(function loadGA() {
  const s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=G-71V438BM6F';
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-71V438BM6F');
}());
(function loadGTM() {
  (function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const f = d.getElementsByTagName(s)[0]; const j = d.createElement(s); const dl = l !== 'dataLayer' ? '&l=' + l : '';
    j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
  }(window, document, 'script', 'dataLayer', 'GTM-T994VXBG'));
}());

// --- OpenAI assistant widget (captured SDK) ---
(function loadOpenAIWidget() {
  const s = document.createElement('script');
  s.async = true; s.src = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';
  document.head.appendChild(s);
}());

// --- Apollo.io visitor tracking — PLACEHOLDER app id: brand team to supply ---
(function loadApollo() {
  const APOLLO_APP_ID = 'REPLACE_WITH_APOLLO_APP_ID'; // TODO(brand): real Apollo app id
  if (APOLLO_APP_ID.startsWith('REPLACE')) return; // no-op until configured
  const s = document.createElement('script');
  s.async = true; s.src = `https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=${Math.random()}`;
  s.onload = () => window.trackingFunctions?.onLoad({ appId: APOLLO_APP_ID });
  document.head.appendChild(s);
}());
