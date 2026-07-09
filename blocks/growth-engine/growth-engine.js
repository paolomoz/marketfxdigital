/* growth-engine — David's Model: head + ledger mini-cards authored in DA content,
   decorative venn diagram (+ mobile fallback) baked here. */

const VENN = `
          <svg class="venn" viewBox="0 0 760 720" role="img" aria-label="Venn diagram: Owned, Earned, and Paid Media overlap into one growth engine that feeds revenue growth. Owned: website, SEO, CRM, email, loyalty, first party data. Earned: organic social, PR, reviews, UGC, partnerships, backlinks, community. Paid media: paid search, paid social, retargeting, CTV, programmatic, YouTube, display. Overlaps: authority, conversion, amplification. Engine core: data, creative, CRO, measurement.">
            <g fill="none" stroke="#00b2ec" stroke-opacity=".55" stroke-width="1.2">
              <circle cx="280" cy="240" r="190" fill="rgba(0,178,236,.045)"/>
              <circle cx="480" cy="240" r="190" fill="rgba(0,178,236,.045)"/>
              <circle cx="380" cy="400" r="190" fill="rgba(26,148,230,.06)"/>
            </g>
            <g font-family="Inter,ui-sans-serif,system-ui,sans-serif" text-anchor="middle">
              <text x="215" y="140" fill="#f8f8f8" font-size="17" font-weight="800" letter-spacing="2">OWNED</text>
              <g fill="#8c9399" font-size="12.5">
                <text x="215" y="166">Website</text><text x="215" y="184">SEO</text><text x="215" y="202">CRM</text>
                <text x="215" y="220">Email</text><text x="215" y="238">Loyalty</text><text x="215" y="256">First Party Data</text>
              </g>
              <text x="548" y="140" fill="#f8f8f8" font-size="17" font-weight="800" letter-spacing="2">EARNED</text>
              <g fill="#8c9399" font-size="12.5">
                <text x="548" y="166">Organic Social</text><text x="548" y="184">PR</text><text x="548" y="202">Reviews</text>
                <text x="548" y="220">UGC</text><text x="548" y="238">Partnerships</text><text x="548" y="256">Backlinks</text>
                <text x="548" y="274">Community</text>
              </g>
              <text x="380" y="558" fill="#f8f8f8" font-size="17" font-weight="800" letter-spacing="2">PAID MEDIA</text>
              <g fill="#8c9399" font-size="12.5">
                <text x="320" y="452">Paid Search</text><text x="320" y="470">Paid Social</text>
                <text x="320" y="488">Retargeting</text><text x="320" y="506">CTV</text>
                <text x="448" y="452">Programmatic</text><text x="448" y="470">YouTube</text>
                <text x="448" y="488">Display</text>
              </g>
              <g fill="#00b2ec" font-size="11.5" font-weight="800" letter-spacing="1.5">
                <text x="380" y="176">AUTHORITY</text>
                <text x="256" y="374">CONVERSION</text>
                <text x="506" y="374">AMPLIFICATION</text>
              </g>
              <rect x="286" y="272" width="188" height="40" rx="20" fill="#03060f" stroke="#00b2ec" stroke-opacity=".7"/>
              <text x="380" y="297" fill="#00b2ec" font-size="13.5" font-weight="800" letter-spacing="2">GROWTH ENGINE</text>
              <text x="380" y="334" fill="#8c9399" font-size="12">Data &#183; Creative &#183; CRO &#183; Measurement</text>
              <line x1="380" y1="596" x2="380" y2="646" stroke="#00b2ec" stroke-opacity=".45" stroke-width="1.2"/>
              <rect x="290" y="648" width="180" height="38" rx="19" fill="rgba(0,178,236,.08)" stroke="#00b2ec" stroke-opacity=".7"/>
              <text x="380" y="672" fill="#00b2ec" font-size="13" font-weight="800" letter-spacing="2">REVENUE GROWTH</text>
            </g>
          </svg>
          <div class="venn-fallback">
            <div><h3>Owned</h3><p>Website &#183; SEO &#183; CRM &#183; Email &#183; Loyalty &#183; First Party Data</p></div>
            <div><h3>Earned</h3><p>Organic Social &#183; PR &#183; Reviews &#183; UGC &#183; Partnerships &#183; Backlinks &#183; Community</p></div>
            <div><h3>Paid Media</h3><p>Paid Search &#183; Paid Social &#183; Retargeting &#183; CTV &#183; Programmatic &#183; YouTube &#183; Display</p></div>
            <div><h3>Growth Engine</h3><p>Authority &#183; Conversion &#183; Amplification &mdash; Data &#183; Creative &#183; CRO &#183; Measurement &rarr; Revenue Growth</p></div>
          </div>`;

function readHead(block) {
  const dc = block.closest('.growth-engine-wrapper')?.previousElementSibling;
  if (!dc || dc.querySelector('.block')) return null;
  const kids = [...dc.children];
  const h = dc.querySelector('h1, h2, h3');
  const hi = h ? kids.indexOf(h) : -1;
  const lede = kids.find((n, i) => n.tagName === 'P' && hi > -1 && i > hi);
  const data = { heading: h?.textContent.trim() || '', lede: lede?.textContent.trim() || '' };
  dc.remove();
  return data;
}

export default function decorate(block) {
  const head = readHead(block);

  // Each block row = one ledger mini-card: cell 1 = title, cell 2 = prose.
  const cards = [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      title: cells[0]?.textContent.trim() || '',
      prose: cells[1]?.textContent.trim() || '',
    };
  }).filter((c) => c.title || c.prose);

  const li = (c) => `<li data-reveal>
            <h3>${c.title}</h3>
            <p>${c.prose}</p>
            <span class="out">&rarr; Revenue Growth</span>
          </li>`;

  const section = document.createElement('section');
  section.setAttribute('data-section', 'growth-engine');
  section.setAttribute('data-intent', 'explanation');
  section.setAttribute('data-layout', 'split-diagram-ledger');
  section.setAttribute('data-media', 'svg-diagram');
  section.innerHTML = `
    <div class="wrap">
      <div class="engine-head" data-reveal>
        ${head?.heading ? `<h2>${head.heading}</h2>` : ''}
        ${head?.lede ? `<p class="lede">${head.lede}</p>` : ''}
      </div>
      <div class="engine-split">
        <div data-reveal>${VENN}
        </div>
        <ul class="engine-ledger">
          ${cards.map(li).join('\n          ')}
        </ul>
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove('growth-engine');
}
