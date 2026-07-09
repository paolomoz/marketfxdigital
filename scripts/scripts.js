import {
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  buildBlock,
} from './aem.js';

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  const innerTT = window.trustedTypes.createPolicy('tt-inner', {
    createHTML: (s) => s, // avoid stack overflow
  });

  window.trustedTypes.createPolicy('default', {
    createHTML: (input, type, sink) => {
      let processedInput = input;
      if (/srcdoc\s*=/i.test(processedInput)) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('iframe[srcdoc]').forEach((el) => el.removeAttribute('srcdoc'));
        processedInput = doc.body.innerHTML;
      }
      if (sink.includes('createContextualFragment') || sink.includes('Document write')) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('script').forEach((el) => el.remove());
        processedInput = doc.body.innerHTML;
      }
      return processedInput;
    },
    createScriptURL: (input) => input,
    createScript: (input) => input,
  });
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Turns `/widgets/...` links into widget blocks.
 * @param {Element} main The container element
 */
function buildWidgetAutoBlocks(main) {
  const widgetLinks = [...main.querySelectorAll('a[href*="/widgets/"]')];
  widgetLinks.forEach((link) => {
    if (link.closest('.widget')) return;
    const newLink = link.cloneNode(true);
    const widgetBlock = buildBlock('widget', { elems: [newLink] });
    const p = link.closest('p');
    if (
      p
      && p.querySelectorAll('a').length === 1
      && p.querySelector('a') === link
      && p.textContent.trim() === link.textContent.trim()
    ) {
      p.replaceWith(widgetBlock);
    } else {
      link.replaceWith(widgetBlock);
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }
    buildWidgetAutoBlocks(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

/* stardust-behavior */
(function stardustBehavior() {
  const d = document;
  // JSON-LD (server-rendered content can't carry <script>; inject at runtime)
  try {
    const ld = d.createElement('script'); ld.type = 'application/ld+json';
    ld.textContent = "{\n  \"@context\": \"https://schema.org\",\n  \"@graph\": [\n    {\n      \"@type\": \"Organization\",\n      \"@id\": \"https://marketfxdigital.com/#organization\",\n      \"name\": \"marketFX digital\",\n      \"url\": \"https://marketfxdigital.com\",\n      \"logo\": \"https://marketfxdigital.com/assets/marketfx-icon-DSWDddq4.png\",\n      \"foundingDate\": \"2004\",\n      \"founder\": { \"@type\": \"Person\", \"name\": \"Abby Di Niro\" },\n      \"sameAs\": [\"https://www.linkedin.com/company/marketfxdigitalus\"]\n    },\n    {\n      \"@type\": \"FAQPage\",\n      \"mainEntity\": [\n        { \"@type\": \"Question\", \"name\": \"What is a full-stack marketing agency?\", \"acceptedAnswer\": { \"@type\": \"Answer\", \"text\": \"A full-stack marketing agency provides every marketing capability under one roof: strategy, paid media, SEO, content, creative, social media, CRM, and analytics. Instead of hiring five or six separate vendors who do not communicate with each other, a full-stack agency operates as a single integrated team. marketFX digital built this model specifically to eliminate the coordination gaps, data silos, and accountability problems that fragment most companies' marketing.\" } },\n        { \"@type\": \"Question\", \"name\": \"How is marketFX different from hiring multiple specialized agencies?\", \"acceptedAnswer\": { \"@type\": \"Answer\", \"text\": \"When you hire separate agencies for SEO, paid media, creative, and social, each one optimizes for their own channel without seeing the full picture. Strategy gets diluted across competing priorities, data lives in disconnected dashboards, and nobody owns the overall outcome. marketFX replaces that fragmented model with one team that shares one strategy, one dataset, and one P&L.\" } },\n        { \"@type\": \"Question\", \"name\": \"What industries do you work with?\", \"acceptedAnswer\": { \"@type\": \"Answer\", \"text\": \"We work across industries including luxury retail, franchise, consumer goods, DTC e-commerce, technology, and professional services. Our client portfolio includes Samsung, Spence Diamonds, 7-Eleven Canada, and Stonz Wear.\" } },\n        { \"@type\": \"Question\", \"name\": \"Do you work with companies outside of Scottsdale and Vancouver?\", \"acceptedAnswer\": { \"@type\": \"Answer\", \"text\": \"Yes. While our offices are in Scottsdale, Arizona and Vancouver, British Columbia, we serve clients across North America and internationally.\" } },\n        { \"@type\": \"Question\", \"name\": \"What does the onboarding process look like?\", \"acceptedAnswer\": { \"@type\": \"Answer\", \"text\": \"Onboarding starts with a strategy assessment where we audit your current marketing, identify the biggest gaps, and build a prioritized roadmap. Most clients see their first measurable improvements within 60 to 90 days.\" } },\n        { \"@type\": \"Question\", \"name\": \"Do you offer month-to-month contracts?\", \"acceptedAnswer\": { \"@type\": \"Answer\", \"text\": \"We offer flexible engagement structures, but our best results come from strategic partnerships built over time. Our average client relationship is over ten years.\" } },\n        { \"@type\": \"Question\", \"name\": \"How do you measure marketing ROI?\", \"acceptedAnswer\": { \"@type\": \"Answer\", \"text\": \"We use our Signal vs Noise framework to separate decision-grade metrics from vanity metrics. That means we track pipeline contribution, customer acquisition cost, lifetime value, and revenue attribution across every channel.\" } },\n        { \"@type\": \"Question\", \"name\": \"How quickly can I expect to see results?\", \"acceptedAnswer\": { \"@type\": \"Answer\", \"text\": \"Paid media campaigns can deliver measurable results within the first 30 days. SEO and content typically show meaningful traction within 90 to 120 days.\" } }\n      ]\n    }\n  ]\n}";
    d.head.appendChild(ld);
  } catch (e) { /* noop */ }
  function enhance() {
    d.documentElement.classList.add('js-anim');
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    d.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const co = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return; co.unobserve(e.target); if (reduce) return;
      const el = e.target; const fin = el.textContent; const m = fin.match(/^([^0-9]*)([0-9.]+)(.*)$/); if (!m) return;
      const num = parseFloat(m[2]); const dec = (m[2].split('.')[1] || '').length; let t0 = null;
      const step = (t) => { if (!t0) t0 = t; const p = Math.min((t - t0) / 1200, 1); const ease = 1 - (1 - p) ** 3; el.textContent = m[1] + (num * ease).toFixed(dec) + m[3]; if (p < 1) requestAnimationFrame(step); else el.textContent = fin; };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    d.querySelectorAll('[data-countup]').forEach((el) => co.observe(el));
  }
  if (d.readyState === 'complete') setTimeout(enhance, 400);
  else addEventListener('load', () => setTimeout(enhance, 400));
})();
