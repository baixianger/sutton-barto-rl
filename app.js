// ──────────────────────────────────────────────────────────────────────────────
// APP CONTROLLER
// ──────────────────────────────────────────────────────────────────────────────

// KaTeX auto-render: called after any HTML injection
function renderMath(el) {
  if (!window.renderMathInElement) {
    // KaTeX not yet loaded — retry after short delay
    setTimeout(() => renderMath(el), 200);
    return;
  }
  renderMathInElement(el, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$',  right: '$',  display: false },
    ],
    throwOnError: false,
    strict: false,
  });
}

let currentChapter = 1;
let currentTab = 'overview';
const completedChapters = new Set(JSON.parse(localStorage.getItem('rl_completed') || '[]'));

function saveProgress() {
  localStorage.setItem('rl_completed', JSON.stringify([...completedChapters]));
}

// ── Navigation ────────────────────────────────────────────────────────────────
function buildNav() {
  const nav = document.getElementById('nav');
  nav.innerHTML = '';
  let currentPart = '';
  CHAPTERS.forEach(ch => {
    if (ch.part !== currentPart) {
      currentPart = ch.part;
      const label = document.createElement('div');
      label.className = 'part-label';
      label.textContent = ch.part;
      nav.appendChild(label);
    }
    const item = document.createElement('div');
    item.className = 'nav-item' + (ch.id === currentChapter ? ' active' : '') + (completedChapters.has(ch.id) ? ' completed' : '');
    item.id = `nav-${ch.id}`;
    item.innerHTML = `
      <span class="ch-num">Ch.${String(ch.id).padStart(2,'0')}</span>
      <span class="ch-name">${ch.title}</span>
      <div class="ch-dot"></div>`;
    item.onclick = () => loadChapter(ch.id);
    nav.appendChild(item);
  });
  updateProgress();
}

function updateProgress() {
  const total = CHAPTERS.length;
  const done = completedChapters.size;
  document.getElementById('progress-text').textContent = `${done} / ${total}`;
  document.getElementById('progress-fill').style.width = `${(done / total) * 100}%`;
}

function loadChapter(id) {
  currentChapter = id;
  currentTab = 'overview';
  // Update nav
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById(`nav-${id}`);
  if (navEl) { navEl.classList.add('active'); navEl.scrollIntoView({block:'nearest',behavior:'smooth'}); }
  // Reset tabs
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => { p.classList.remove('active'); p.innerHTML = ''; });
  document.querySelector('.tab-btn').classList.add('active');
  document.getElementById('tab-overview').classList.add('active');
  renderOverview(id);
  document.getElementById('content-area').scrollTop = 0;
}

function switchTab(tab) {
  if (currentTab === tab) return;
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.toLowerCase() === tab);
  });
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`tab-${tab}`);
  panel.classList.add('active');
  document.getElementById('content-area').scrollTop = 0;

  if (panel.innerHTML.trim() === '') {
    if (tab === 'overview') renderOverview(currentChapter);
    else if (tab === 'concepts') renderConcepts(currentChapter);
    else if (tab === 'demo') renderDemo(currentChapter);
    else if (tab === 'quiz') renderQuiz(currentChapter);
  }
}

function prevChapter() {
  if (currentChapter > 1) loadChapter(currentChapter - 1);
}

function nextChapter() {
  if (currentChapter < CHAPTERS.length) loadChapter(currentChapter + 1);
}

function closeWelcome() {
  const w = document.getElementById('welcome');
  w.style.opacity = '0';
  setTimeout(() => w.remove(), 400);
}

// ── Overview Renderer ─────────────────────────────────────────────────────────
function renderOverview(id) {
  const ch = CHAPTERS.find(c => c.id === id);
  if (!ch) return;
  const panel = document.getElementById('tab-overview');
  panel.innerHTML = `
    <div class="chapter-hero">
      <div class="chapter-tag">Chapter ${ch.id} — ${ch.part}</div>
      <h2 class="chapter-title">${ch.title}</h2>
      <p class="chapter-summary">${ch.summary}</p>
    </div>

    <div class="section-title">Key Points</div>
    <ul class="key-points">
      ${ch.keyPoints.map(p => `<li>${p}</li>`).join('')}
    </ul>

    ${ch.formulas && ch.formulas.length ? `
    <div class="section-title">Core Equations</div>
    ${ch.formulas.map(f => `
      <div class="formula-box">
        <div class="formula-label">${f.label}</div>
        <div>${f.expr}</div>
        ${f.name ? `<div class="formula-name">${f.name}</div>` : ''}
      </div>`).join('')}` : ''}

    <div style="margin-top:32px;display:flex;gap:12px;align-items:center;">
      <button class="btn btn-secondary" onclick="switchTab('concepts')">→ Concepts</button>
      <button class="btn btn-secondary" onclick="switchTab('demo')">→ Demo</button>
      <button class="btn btn-secondary" onclick="switchTab('quiz')">→ Quiz</button>
    </div>`;
  renderMath(panel);
}

// ── Concepts Renderer ─────────────────────────────────────────────────────────
function renderConcepts(id) {
  const ch = CHAPTERS.find(c => c.id === id);
  if (!ch) return;
  const panel = document.getElementById('tab-concepts');

  // Build algorithm pseudocode for key chapters
  const algos = getAlgorithmPseudocode(id);

  panel.innerHTML = `
    <div class="chapter-tag" style="margin-bottom:8px">Chapter ${ch.id} — ${ch.title}</div>
    <h2 style="font-family:var(--font-serif);font-size:28px;color:var(--white);margin-bottom:24px">${ch.subtitle || 'Core Concepts'}</h2>

    <div class="section-title">Concept Cards</div>
    <div class="concepts-grid">
      ${ch.concepts.map(c => `
        <div class="concept-card">
          <h3>${c.name}</h3>
          <p>${c.desc}</p>
        </div>`).join('')}
    </div>

    ${algos ? `<div class="section-title">Algorithm</div>${algos}` : ''}

    ${ch.formulas && ch.formulas.length ? `
    <div class="section-title">All Formulas</div>
    ${ch.formulas.map(f => `
      <div class="formula-box">
        <div class="formula-label">${f.label}</div>
        <div>${f.expr}</div>
        ${f.name ? `<div class="formula-name">${f.name}</div>` : ''}
      </div>`).join('')}` : ''}

    ${getComparisonTable(id)}`;
  renderMath(panel);
}

function getAlgorithmPseudocode(id) {
  const algos = {
    2: `<div class="algo-box">
      <div class="algo-header">◈ ε-Greedy Action Selection</div>
      <div class="algo-body">
        <div><span class="kw">Initialize:</span> Q(a) = 0, N(a) = 0, for all a ∈ {1,...,k}</div>
        <div><span class="kw">Loop</span> forever:</div>
        <div class="indent1"><span class="kw">if</span> rand() &lt; ε:</div>
        <div class="indent2">A ← random action  <span class="cmt">// explore</span></div>
        <div class="indent1"><span class="kw">else</span>:</div>
        <div class="indent2">A ← argmax_a Q(a)  <span class="cmt">// exploit</span></div>
        <div class="indent1">R ← execute(A)</div>
        <div class="indent1">N(A) ← N(A) + 1</div>
        <div class="indent1">Q(A) ← Q(A) + <span class="num">1</span>/N(A) · [R − Q(A)]  <span class="cmt">// incremental update</span></div>
      </div>
    </div>`,
    4: `<div class="algo-box">
      <div class="algo-header">◈ Value Iteration</div>
      <div class="algo-body">
        <div><span class="kw">Input:</span> MDP (S, A, p, r, γ), threshold θ > 0</div>
        <div><span class="kw">Initialize:</span> V(s) = 0 for all s ∈ S</div>
        <div><span class="kw">Loop</span>:</div>
        <div class="indent1">Δ ← 0</div>
        <div class="indent1"><span class="kw">For each</span> s ∈ S:</div>
        <div class="indent2">v ← V(s)</div>
        <div class="indent2">V(s) ← <span class="fn">max</span>_a Σ_s',r  p(s',r|s,a) [r + γ V(s')]</div>
        <div class="indent2">Δ ← <span class="fn">max</span>(Δ, |v − V(s)|)</div>
        <div><span class="kw">Until</span> Δ &lt; θ</div>
        <div><span class="cmt">// Output: π*(s) = argmax_a Σ p(s',r|s,a)[r + γV(s')]</span></div>
      </div>
    </div>`,
    6: `<div class="algo-box">
      <div class="algo-header">◈ Q-learning (off-policy TD control)</div>
      <div class="algo-body">
        <div><span class="kw">Initialize:</span> Q(s,a) for all s,a; Q(terminal,·) = 0</div>
        <div><span class="kw">For each</span> episode:</div>
        <div class="indent1">Initialize S</div>
        <div class="indent1"><span class="kw">For each</span> step of episode:</div>
        <div class="indent2">A ← ε-greedy(Q, S)</div>
        <div class="indent2">R, S' ← <span class="fn">env.step</span>(A)</div>
        <div class="indent2">Q(S,A) ← Q(S,A) + α [R + γ <span class="fn">max</span>_a Q(S',a) − Q(S,A)]</div>
        <div class="indent2">S ← S'</div>
        <div class="indent1"><span class="kw">Until</span> S is terminal</div>
      </div>
    </div>
    <div class="algo-box" style="margin-top:12px">
      <div class="algo-header">◈ SARSA (on-policy TD control)</div>
      <div class="algo-body">
        <div><span class="kw">Initialize:</span> Q(s,a) for all s,a</div>
        <div><span class="kw">For each</span> episode:</div>
        <div class="indent1">Initialize S; A ← ε-greedy(Q, S)</div>
        <div class="indent1"><span class="kw">For each</span> step:</div>
        <div class="indent2">R, S' ← <span class="fn">env.step</span>(A)</div>
        <div class="indent2">A' ← ε-greedy(Q, S')  <span class="cmt">// next action by policy</span></div>
        <div class="indent2">Q(S,A) ← Q(S,A) + α [R + γ Q(S',A') − Q(S,A)]</div>
        <div class="indent2">S ← S'; A ← A'</div>
        <div class="indent1"><span class="kw">Until</span> S is terminal</div>
      </div>
    </div>`,
    13: `<div class="algo-box">
      <div class="algo-header">◈ REINFORCE with Baseline (Monte Carlo Policy Gradient)</div>
      <div class="algo-body">
        <div><span class="kw">Input:</span> policy π(a|s,θ), baseline v̂(s,w)</div>
        <div><span class="kw">Initialize:</span> θ, w (arbitrary)</div>
        <div><span class="kw">Loop</span> forever:</div>
        <div class="indent1">Generate episode S₀,A₀,R₁,...,Sₜ using π(·|·,θ)</div>
        <div class="indent1"><span class="kw">For each</span> t = 0,1,...,T−1:</div>
        <div class="indent2">G ← return from step t</div>
        <div class="indent2">δ ← G − v̂(Sₜ, w)  <span class="cmt">// advantage estimate</span></div>
        <div class="indent2">w ← w + α_w · δ · ∇v̂(Sₜ, w)</div>
        <div class="indent2">θ ← θ + α_θ · γᵗ · δ · ∇<span class="fn">ln</span> π(Aₜ|Sₜ, θ)</div>
      </div>
    </div>`,
  };
  return algos[id] || '';
}

function getComparisonTable(id) {
  const tables = {
    6: `<div class="section-title" style="margin-top:24px">Method Comparison</div>
    <table class="compare-table">
      <tr><th>Property</th><th>SARSA</th><th>Q-learning</th><th>Expected SARSA</th></tr>
      <tr><td>On/Off-policy</td><td class="hl-green">On-policy</td><td class="hl-amber">Off-policy</td><td class="hl-green">On-policy</td></tr>
      <tr><td>Update target</td><td>Q(S',A') — actual next action</td><td>max_a Q(S',a)</td><td>Σ_a π(a|S')Q(S',a)</td></tr>
      <tr><td>Cliff Walking</td><td>Safer path (accounts for ε)</td><td>Optimal path (risky)</td><td>Between SARSA and Q-learning</td></tr>
      <tr><td>Convergence</td><td>To π* (if ε→0)</td><td>To Q* directly</td><td>To Q* (eliminates A' variance)</td></tr>
    </table>`,
    2: `<div class="section-title" style="margin-top:24px">Strategy Comparison</div>
    <table class="compare-table">
      <tr><th>Strategy</th><th>Exploration</th><th>Strengths</th><th>Weaknesses</th></tr>
      <tr><td class="hl-amber">ε-Greedy</td><td>Random (ε prob)</td><td>Simple, works well</td><td>Wastes exploration on clearly bad arms</td></tr>
      <tr><td class="hl-cyan">UCB</td><td>Principled uncertainty</td><td>Sublinear regret, no random exploration</td><td>More complex, harder with nonstationary</td></tr>
      <tr><td class="hl-purple">Optimistic Init</td><td>Early forced exploration</td><td>No explicit ε needed</td><td>Fails on nonstationary, one-shot exploration</td></tr>
      <tr><td class="hl-green">Gradient Bandit</td><td>Softmax preferences</td><td>Relative action values, natural stochastic</td><td>Sensitive to learning rate</td></tr>
    </table>`,
  };
  return tables[id] || '';
}

// ── Demo Renderer ─────────────────────────────────────────────────────────────
function renderDemo(id) {
  const panel = document.getElementById('tab-demo');
  const demo = DEMOS[id] || defaultDemo(id);

  panel.innerHTML = `
    <div class="chapter-tag" style="margin-bottom:8px">Interactive Demo — Chapter ${id}</div>
    <h2 style="font-family:var(--font-serif);font-size:28px;color:var(--white);margin-bottom:8px">${demo.title}</h2>
    ${demo.description ? `<p style="font-family:var(--font-serif);font-size:15px;color:var(--text2);margin-bottom:24px;line-height:1.6">${demo.description}</p>` : ''}
    <div id="demo-mount"></div>`;

  demo.render(document.getElementById('demo-mount'));
  renderMath(panel);
}

// ── Quiz Renderer ─────────────────────────────────────────────────────────────
function renderQuiz(id) {
  const ch = CHAPTERS.find(c => c.id === id);
  if (!ch || !ch.quiz) return;
  const panel = document.getElementById('tab-quiz');
  const questions = ch.quiz;
  let score = 0, answered = 0;

  panel.innerHTML = `
    <div class="chapter-tag" style="margin-bottom:8px">Chapter ${id} — Comprehension Quiz</div>
    <h2 style="font-family:var(--font-serif);font-size:28px;color:var(--white);margin-bottom:24px">${ch.title}</h2>
    <div id="quiz-score-banner" style="display:none;background:rgba(74,240,160,0.1);border:1px solid var(--green);border-radius:8px;padding:16px 24px;margin-bottom:24px;font-family:var(--font-mono);font-size:13px;color:var(--green);"></div>
    ${questions.map((q, qi) => `
      <div class="quiz-question" id="qq-${qi}">
        <div class="q-number">Question ${qi + 1} of ${questions.length}</div>
        <div class="q-text">${q.q}</div>
        <div class="q-options">
          ${q.options.map((opt, oi) => `
            <div class="q-option" id="qo-${qi}-${oi}" onclick="answerQ(${qi}, ${oi}, ${q.correct})">
              <span class="q-letter">${String.fromCharCode(65+oi)}</span>
              <span>${opt}</span>
            </div>`).join('')}
        </div>
        <div class="q-explanation" id="qe-${qi}">${q.explanation}</div>
      </div>`).join('')}
    <div class="complete-btn-wrap" id="complete-wrap" style="display:none">
      <button class="btn btn-primary" onclick="markComplete(${id})">✓ Mark Chapter Complete</button>
      <span id="final-score" style="font-family:var(--font-mono);font-size:13px;color:var(--text2)"></span>
    </div>`;

  window._quizState = { questions, score: 0, answered: 0, total: questions.length };
  renderMath(panel);
}

function answerQ(qi, oi, correct) {
  const opts = document.querySelectorAll(`[id^="qo-${qi}-"]`);
  // Already answered?
  if ([...opts].some(o => o.classList.contains('correct') || o.classList.contains('wrong'))) return;

  const isCorrect = oi === correct;
  if (isCorrect) {
    window._quizState.score++;
    opts[oi].classList.add('correct');
  } else {
    opts[oi].classList.add('wrong');
    opts[correct].classList.add('correct');
  }
  opts.forEach(o => o.classList.add('revealed'));

  document.getElementById(`qe-${qi}`).classList.add('show');
  window._quizState.answered++;

  // Show score if all answered
  if (window._quizState.answered === window._quizState.total) {
    const s = window._quizState.score, t = window._quizState.total;
    const pct = Math.round(s/t*100);
    const banner = document.getElementById('quiz-score-banner');
    const msg = pct === 100 ? '🎉 Perfect score!' : pct >= 75 ? '✓ Well done!' : pct >= 50 ? 'Good attempt — review the concepts.' : 'Review the chapter concepts and try again.';
    banner.textContent = `Score: ${s}/${t} (${pct}%) — ${msg}`;
    banner.style.display = 'block';
    banner.style.background = pct >= 75 ? 'rgba(74,240,160,0.1)' : 'rgba(245,166,35,0.08)';
    banner.style.borderColor = pct >= 75 ? 'var(--green)' : 'var(--amber)';
    banner.style.color = pct >= 75 ? 'var(--green)' : 'var(--amber)';
    document.getElementById('complete-wrap').style.display = 'flex';
    document.getElementById('final-score').textContent = `${s}/${t} correct`;
    document.getElementById('content-area').scrollTop = 0;
  }
}

function markComplete(id) {
  completedChapters.add(id);
  saveProgress();
  const navEl = document.getElementById(`nav-${id}`);
  if (navEl) navEl.classList.add('completed');
  updateProgress();

  const btn = document.querySelector('.complete-btn-wrap .btn-primary');
  btn.textContent = '✓ Completed!';
  btn.style.background = 'var(--green)';
  btn.disabled = true;

  // Auto-advance suggestion
  if (id < CHAPTERS.length) {
    setTimeout(() => {
      const wrap = document.getElementById('complete-wrap');
      if (wrap) {
        wrap.innerHTML += `<button class="btn btn-secondary" onclick="loadChapter(${id+1})" style="margin-left:8px">Next: Ch.${id+1} →</button>`;
      }
    }, 500);
  }
}

// ── Keyboard shortcuts ────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
  if (e.key === 'ArrowRight' || e.key === 'l') nextChapter();
  if (e.key === 'ArrowLeft' || e.key === 'h') prevChapter();
  if (e.key === '1') switchTab('overview');
  if (e.key === '2') switchTab('concepts');
  if (e.key === '3') switchTab('demo');
  if (e.key === '4') switchTab('quiz');
});

// ── Initialize ────────────────────────────────────────────────────────────────
buildNav();
loadChapter(1);
