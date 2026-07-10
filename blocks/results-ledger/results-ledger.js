/* results-ledger — headline figures rendered as an auditor's statement (the brand's
   "brief a board" voice), replacing the SaaS hero-metric stat band.
   One authored row per line item. Two shapes are accepted:
     4 cells: [figure, tag, metric, note]   (e.g. testimonials outcomes)
     3 cells: [figure, metric, note]        (e.g. credentials — no tag)
   A signed figure (+… / −…) gets a directional caret + word (increase/reduction);
   an absolute figure (94%, 20+, $20M+) shows the figure alone.
   Optional header: a default-content head (h2 + optional p) authored in the same
   section, before the block, is reabsorbed as the statement title + meta.
   DA may wrap cell text in a <p>; read textContent so nesting is a non-issue. */

export default function decorate(block) {
  const rows = [...block.children];
  const t = (c) => (c ? c.textContent.trim() : '');

  const items = rows.map((row, i) => {
    const cells = [...row.children];
    let figure;
    let tag;
    let metric;
    let note;
    if (cells.length >= 4) {
      [figure, tag, metric, note] = cells.map(t);
    } else {
      [figure, metric, note] = cells.map(t);
      tag = '';
    }
    // −43% CPA is a win, so colour every figure as a gain; the caret + word carry
    // the literal direction (the honest twist: a reduction that is still a result).
    const signed = /^[+−-]/.test(figure);
    const down = /^[−-]/.test(figure);
    const dir = down ? 'reduction' : 'increase';
    return `<li class="rl-row" data-reveal style="--i:${i}">
        <div class="rl-line">
          <div class="rl-metric">
            <span class="rl-name">${metric}</span>
            ${tag ? `<span class="rl-tag">${tag}</span>` : ''}
          </div>
          <div class="rl-figure">
            <span class="rl-num" data-countup>${figure}</span>
            ${signed ? `<span class="rl-dir"><span class="rl-caret rl-${down ? 'down' : 'up'}" aria-hidden="true"></span>${dir}</span>` : ''}
          </div>
        </div>
        ${note ? `<p class="rl-note">${note}</p>` : ''}
      </li>`;
  }).join('');

  // optional authored header (default content in the same section, before the block)
  const headDC = block.parentElement?.previousElementSibling;
  let header = '';
  if (headDC && headDC.classList.contains('default-content-wrapper')) {
    const h = headDC.querySelector('h1, h2, h3');
    const m = headDC.querySelector('p');
    header = `<div class="rl-head">
          <span class="rl-title">${h ? h.textContent.trim() : ''}</span>
          ${m ? `<span class="rl-meta">${m.textContent.trim()}</span>` : ''}
        </div>`;
    headDC.remove();
  }

  const section = document.createElement('section');
  section.className = 'results-ledger';
  section.setAttribute('data-section', 'results-ledger');
  section.setAttribute('data-intent', 'evidence');
  section.setAttribute('data-layout', 'statement');
  section.setAttribute('data-items', String(rows.length));
  section.innerHTML = `
    <div class="wrap">
      <div class="rl-panel" data-reveal>
        ${header}
        <ol class="rl-list">${items}</ol>
      </div>
    </div>`;

  block.replaceChildren(section);
  block.classList.remove('results-ledger');
}
