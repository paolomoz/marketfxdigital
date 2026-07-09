/* results-ledger — the three headline outcomes rendered as an auditor's results
   statement (the brand's "brief a board" voice), replacing the SaaS hero-metric
   stat band. One authored row per line item, cells: [figure, tag, metric, note].
   DA may wrap cell text in a <p>; read textContent so nesting is a non-issue. */

export default function decorate(block) {
  const rows = [...block.children];
  const t = (c) => (c ? c.textContent.trim() : '');

  const items = rows.map((row, i) => {
    const c = [...row.children];
    const figure = t(c[0]);
    const tag = t(c[1]);
    const metric = t(c[2]);
    const note = t(c[3]);
    // −43% CPA is a win, so colour every figure as a gain; the caret + word carry
    // the literal direction (the honest twist: a reduction that is still a result).
    const down = /^[−-]/.test(figure);
    const dir = down ? 'reduction' : 'increase';
    return `<li class="rl-row" data-reveal style="--i:${i}">
        <div class="rl-line">
          <div class="rl-metric">
            <span class="rl-name">${metric}</span>
            <span class="rl-tag">${tag}</span>
          </div>
          <div class="rl-figure">
            <span class="rl-num" data-countup>${figure}</span>
            <span class="rl-dir">
              <span class="rl-caret rl-${down ? 'down' : 'up'}" aria-hidden="true"></span>${dir}
            </span>
          </div>
        </div>
        <p class="rl-note">${note}</p>
      </li>`;
  }).join('');

  const section = document.createElement('section');
  section.className = 'results-ledger';
  section.setAttribute('data-section', 'results-ledger');
  section.setAttribute('data-intent', 'evidence');
  section.setAttribute('data-layout', 'statement');
  section.setAttribute('data-items', String(rows.length));
  section.innerHTML = `
    <div class="wrap">
      <div class="rl-panel" data-reveal>
        <div class="rl-head">
          <span class="rl-title">Aggregate impact</span>
          <span class="rl-meta">Selected engagements &middot; 2014&ndash;present</span>
        </div>
        <ol class="rl-list">${items}</ol>
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove('results-ledger');
}
