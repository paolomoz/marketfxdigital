/* lml-hero — local-market-lander hero (David's Model decode). Authored head
   (default content before the block) carries kicker / h1 / lede; block rows:
   row 1 = breadcrumb current-page label (1 cell), row 2 = CTA links
   (<strong><a> primary, <em><a> secondary). The "Home" crumb, the dark radial
   background, dot-grid and glow are presentation (CSS pseudo-elements). The
   tone accent on the h1's final sentence is presentational and applied here. */

const NAME = 'lml-hero';

function readLink(scope, wrapTag) {
  const cls = wrapTag === 'strong' ? 'primary' : 'secondary';
  const a = scope.querySelector(`${wrapTag} a`) || scope.querySelector(`a.${cls}`);
  return a ? { href: a.getAttribute('href'), text: a.textContent.trim() } : null;
}

/* split "First part. Last sentence." -> tone-wrap the last sentence */
function toneHeadline(text) {
  const t = text.trim();
  const m = t.match(/^([\s\S]*[.!?])\s+(\S[\s\S]*)$/);
  if (!m) return document.createTextNode(t);
  const [, lead, last] = m;
  const frag = document.createDocumentFragment();
  frag.append(document.createTextNode(`${lead} `));
  const tone = document.createElement('span');
  tone.className = 'tone';
  tone.textContent = last;
  frag.append(tone);
  return frag;
}

export default function decorate(block) {
  const head = block.closest(`.${NAME}-wrapper`)?.previousElementSibling;
  const h1Text = head?.querySelector('h1')?.textContent.trim() || '';
  const paras = head ? [...head.querySelectorAll('p')].filter((p) => !p.querySelector('a')) : [];
  const kicker = paras[0]?.textContent.trim() || '';
  const lede = paras[1]?.textContent.trim() || '';

  const rows = [...block.children];
  const crumbRow = rows.find((r) => r.children.length === 1 && !r.querySelector('a'));
  const crumbLabel = crumbRow?.textContent.trim() || '';
  const primary = readLink(block, 'strong');
  const secondary = readLink(block, 'em');

  const section = document.createElement('section');
  section.className = 'hero';
  section.setAttribute('data-section', 'hero');
  section.setAttribute('data-intent', 'orientation');
  section.setAttribute('data-layout', 'local-lander');
  section.innerHTML = `
    <div class="wrap">
      <nav aria-label="Breadcrumb" data-reveal>
        <ol class="crumb">
          <li><a href="/">Home</a></li>
          <li aria-current="page">${crumbLabel}</li>
        </ol>
      </nav>
      <div data-reveal>
        <p class="kicker">${kicker}</p>
        <h1></h1>
        <p class="hero-lede">${lede}</p>
        <div class="hero-actions">
          ${primary ? `<a class="btn btn-primary" href="${primary.href}">${primary.text}</a>` : ''}
          ${secondary ? `<a class="btn btn-secondary" href="${secondary.href}">${secondary.text}</a>` : ''}
        </div>
      </div>
    </div>`;
  section.querySelector('h1').append(toneHeadline(h1Text));

  block.replaceChildren(section);
  block.classList.remove(NAME);
  head?.remove();
}
