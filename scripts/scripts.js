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

/* article flow: classify eyebrow labels — a default-content paragraph whose
   entire text is one <em> (muted) or <strong> (signal) line. Text equality
   keeps bold-lead paragraphs (<strong>Term:</strong> rest…) out. */
function decorateArticleLabels(main) {
  main.querySelectorAll('.section.article-flow > .default-content-wrapper p').forEach((p) => {
    const only = p.children.length === 1 ? p.firstElementChild : null;
    if (!only || (only.tagName !== 'STRONG' && only.tagName !== 'EM')) return;
    if (p.textContent.trim() !== only.textContent.trim()) return;
    p.classList.add('plabel');
    if (only.tagName === 'STRONG') p.classList.add('plabel-signal');
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
  decorateArticleLabels(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  // a11y: skip link as the first focusable element (audit F-006)
  const skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#main';
  skip.textContent = 'Skip to main content';
  document.body.prepend(skip);
  const main = doc.querySelector('main');
  if (main) {
    main.id = main.id || 'main';
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

/* a11y: screen readers announce a trailing "right arrow" on headings/links;
   move the decorative glyph into an aria-hidden span (audit F-015) */
function wrapTrailingArrows() {
  document.querySelectorAll('main h1, main h2, main h3, main h4, main a').forEach((node) => {
    const last = node.lastChild;
    if (last && last.nodeType === Node.TEXT_NODE && /\u2192\s*$/.test(last.textContent)) {
      last.textContent = `${last.textContent.replace(/\s*\u2192\s*$/, '')} `;
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '\u2192';
      node.append(arrow);
    }
  });
}

/* article flow: link the "What You'll Learn" list items to their matching
   h2/h3 anchors (moved from the retired article-body DSL decode; audit F-012) */
function decorateLearnToc() {
  document.querySelectorAll('main .section.article-flow').forEach((section) => {
    const label = [...section.querySelectorAll('p > em:only-child, p > strong:only-child')]
      .find((s) => /^what you.?ll learn|^what you will learn/i.test(s.textContent.trim()));
    if (!label) return;
    let list = label.closest('p').nextElementSibling;
    while (list && list.tagName !== 'UL') list = list.nextElementSibling;
    if (!list) return;
    const heads = [...section.querySelectorAll('h2[id], h3[id]')]
      .map((h) => ({ id: h.id, words: new Set(h.textContent.toLowerCase().match(/[a-z]{4,}/g) || []) }));
    [...list.children].forEach((li) => {
      const words = (li.textContent.toLowerCase().match(/[a-z]{4,}/g) || []);
      let best = null; let bestScore = 1; // require >=2 overlapping words
      heads.forEach((h) => {
        const score = words.filter((w) => h.words.has(w)).length;
        if (score > bestScore) { best = h; bestScore = score; }
      });
      if (best) {
        const a = document.createElement('a');
        a.href = `#${best.id}`;
        while (li.firstChild) a.append(li.firstChild);
        li.append(a);
      }
    });
    list.classList.add('learn-toc');
  });
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  // page-type JSON-LD is now server-rendered via the json-ld metadata
  // property in each DA doc (audit F-009 closed); no client injection needed
  wrapTrailingArrows();
  decorateLearnToc();
  loadDelayed();
}

loadPage();

/* stardust-behavior */
(function stardustBehavior() {
  const d = document;
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
      const step = (t) => {
        if (!t0) t0 = t;
        const p = Math.min((t - t0) / 1200, 1);
        const ease = 1 - (1 - p) ** 3;
        el.textContent = m[1] + (num * ease).toFixed(dec) + m[3];
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = fin;
      };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    d.querySelectorAll('[data-countup]').forEach((el) => co.observe(el));
  }
  if (d.readyState === 'complete') setTimeout(enhance, 400);
  else window.addEventListener('load', () => setTimeout(enhance, 400));
}());
