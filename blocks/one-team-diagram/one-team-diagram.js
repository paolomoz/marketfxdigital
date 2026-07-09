/* one-team-diagram — David's Model: editorial text authored in DA content,
   decorative diagram chrome (chart lines/spokes, hub, lucide node icons) baked here (aria-hidden). */

const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

/* 8 lucide icons + hub positions, in prototype order. Node LABELS come from authored content. */
const NODES = [
  { pos: 'left:50%;top:13%', icon: svg('<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/>'), label: 'Strategy' },
  { pos: 'left:76.163%;top:23.837%', icon: svg('<path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14"/><path d="M8 6v8"/>'), label: 'Paid Media' },
  { pos: 'left:87%;top:50%', icon: svg('<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>'), label: 'SEO & AI Visibility' },
  { pos: 'left:76.163%;top:76.163%', icon: svg('<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>'), label: 'Content' },
  { pos: 'left:50%;top:87%', icon: svg('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>'), label: 'Social' },
  { pos: 'left:23.837%;top:76.163%', icon: svg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>'), label: 'CRM' },
  { pos: 'left:13%;top:50%', icon: svg('<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>'), label: 'CRO' },
  { pos: 'left:23.837%;top:23.837%', icon: svg('<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>'), label: 'Measurement' },
];

const LINES = [
  'x1="500" y1="225" x2="500" y2="500" style="animation:ge-flow 3s linear 0s infinite"',
  'x1="694.454" y1="305.546" x2="500" y2="500" style="animation:ge-flow 3s linear 0.3s infinite"',
  'x1="775" y1="500" x2="500" y2="500" style="animation:ge-flow 3s linear 0.6s infinite"',
  'x1="694.454" y1="694.454" x2="500" y2="500" style="animation:ge-flow 3s linear 0.9s infinite"',
  'x1="500" y1="775" x2="500" y2="500" style="animation:ge-flow 3s linear 1.2s infinite"',
  'x1="305.546" y1="694.454" x2="500" y2="500" style="animation:ge-flow 3s linear 1.5s infinite"',
  'x1="225" y1="500" x2="500" y2="500" style="animation:ge-flow 3s linear 1.8s infinite"',
  'x1="305.546" y1="305.546" x2="500" y2="500" style="animation:ge-flow 3s linear 2.1s infinite"',
];

function readHead(block) {
  const dc = block.closest('.one-team-diagram-wrapper')?.previousElementSibling;
  if (!dc || dc.querySelector('.block')) return null;
  const kids = [...dc.children];
  const h = dc.querySelector('h1, h2, h3');
  const hi = h ? kids.indexOf(h) : -1;
  const before = kids.filter((n, i) => n.tagName === 'P' && (hi === -1 || i < hi));
  const after = kids.filter((n, i) => n.tagName === 'P' && hi > -1 && i > hi);
  const data = {
    kicker: before[0]?.textContent.trim() || '',
    heading: h?.textContent.trim() || '',
    lede: after[0]?.textContent.trim() || '',
  };
  dc.remove();
  return data;
}

export default function decorate(block) {
  const head = readHead(block);
  const labels = [...block.children]
    .map((row) => row.textContent.trim())
    .filter(Boolean);

  const nodes = NODES.map((n, i) => ({ ...n, label: labels[i] || n.label }));

  const line = (attrs) => `<line ${attrs} stroke="url(#ge-line)" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="6 8"/>`;
  const nodeLi = (n) => `<li class="ge-node" style="${n.pos}"><div>${n.icon}<span>${n.label}</span></div></li>`;
  const mLi = (n) => `<li>${n.icon}<span>${n.label}</span></li>`;

  const section = document.createElement('section');
  section.className = 'band-light one-team';
  section.setAttribute('data-section', 'one-team-diagram');
  section.setAttribute('data-intent', 'explanation');
  section.setAttribute('data-layout', 'centered-diagram');
  section.setAttribute('data-media', 'svg-diagram');
  section.innerHTML = `
    <div class="wrap">
      <div class="diagram-head" data-reveal>
        ${head?.kicker ? `<p class="kicker">${head.kicker}</p>` : ''}
        ${head?.heading ? `<h2>${head.heading}</h2>` : ''}
        ${head?.lede ? `<p>${head.lede}</p>` : ''}
      </div>
      <div class="ge-wrap" data-reveal>
        <div class="ge-chart">
          <svg viewBox="0 0 1000 1000" class="ge-lines" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="ge-line" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="1000"><stop offset="0%" stop-color="rgba(0,178,236,.15)"/><stop offset="50%" stop-color="rgba(0,178,236,.7)"/><stop offset="100%" stop-color="rgba(0,178,236,.15)"/></linearGradient>
              <radialGradient id="ge-hub-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(0,178,236,.35)"/><stop offset="100%" stop-color="rgba(0,178,236,0)"/></radialGradient>
            </defs>
            <circle cx="500" cy="500" r="203.5" fill="url(#ge-hub-glow)"/>
            ${LINES.map(line).join('\n            ')}
          </svg>
          <div class="ge-hub"><div class="ge-hub-inner"><span class="ge-ping" aria-hidden="true"></span><span class="ge-hub-text"><span class="k">Integrated</span><span class="t">Growth Partner</span></span></div></div>
          <ul class="ge-nodes">
            ${nodes.map(nodeLi).join('\n            ')}
          </ul>
        </div>
        <div class="ge-mobile">
          <div class="ge-hub-badge"><span class="k">Integrated</span><span class="t">Growth Partner</span></div>
          <ul class="ge-mgrid">
            ${nodes.map(mLi).join('\n            ')}
          </ul>
        </div>
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove('one-team-diagram');
}
