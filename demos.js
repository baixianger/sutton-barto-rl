// ──────────────────────────────────────────────────────────────────────────────
// INTERACTIVE DEMOS for each chapter
// ──────────────────────────────────────────────────────────────────────────────

const DEMOS = {};

// ── CHAPTER 2: Multi-Armed Bandit ────────────────────────────────────────────
DEMOS[2] = {
  title: "k-Armed Bandit Simulator",
  description: "Compare ε-greedy, UCB, and Optimistic initialization strategies on a 10-armed bandit.",
  render(container) {
    container.innerHTML = `
    <div class="demo-container">
      <div class="demo-header"><div class="demo-dot"></div>10-Armed Bandit Simulation</div>
      <div class="demo-controls">
        <div class="ctrl-group">
          <div class="ctrl-label">Strategy</div>
          <select class="ctrl-select" id="b-strategy">
            <option value="egreedy">ε-Greedy</option>
            <option value="ucb">UCB</option>
            <option value="optimistic">Optimistic Init</option>
          </select>
        </div>
        <div class="ctrl-group">
          <div class="ctrl-label">ε / c / Q₀</div>
          <input class="ctrl-input" id="b-param" type="number" value="0.1" step="0.05" min="0" max="5">
        </div>
        <div class="ctrl-group">
          <div class="ctrl-label">Steps</div>
          <input class="ctrl-input" id="b-steps" type="number" value="1000" step="100" min="100" max="5000">
        </div>
        <button class="btn btn-primary" id="b-run">▶ Run</button>
        <button class="btn btn-secondary" id="b-reset">Reset</button>
      </div>
      <div class="demo-canvas-wrap">
        <canvas id="b-canvas" width="600" height="300" style="background:#0a0a0f;border-radius:4px;flex:1;min-width:300px;"></canvas>
        <div class="stats-panel" id="b-stats">
          <div class="stat-row"><span class="stat-key">Total Steps</span><span class="stat-val" id="b-stat-steps">–</span></div>
          <div class="stat-row"><span class="stat-key">Avg Reward</span><span class="stat-val" id="b-stat-avg">–</span></div>
          <div class="stat-row"><span class="stat-key">% Optimal</span><span class="stat-val" id="b-stat-opt">–</span></div>
          <div class="stat-row"><span class="stat-key">Best Arm</span><span class="stat-val" id="b-stat-best">–</span></div>
          <div style="margin-top:16px;font-family:var(--font-mono);font-size:9px;color:var(--text2);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Arm Q-values</div>
          <div id="b-arms" style="display:flex;flex-direction:column;gap:3px;"></div>
        </div>
      </div>
    </div>`;

    const canvas = document.getElementById('b-canvas');
    const ctx = canvas.getContext('2d');
    const K = 10;
    let trueValues, Q, N, totalReward, optimalCount, rewardHistory, running;

    function init() {
      trueValues = Array.from({length: K}, () => gaussRand(0, 1));
      const param = parseFloat(document.getElementById('b-param').value) || 0.1;
      const strategy = document.getElementById('b-strategy').value;
      const initQ = strategy === 'optimistic' ? param : 0;
      Q = Array(K).fill(initQ);
      N = Array(K).fill(0);
      totalReward = 0; optimalCount = 0;
      rewardHistory = [];
      running = false;
      drawInit();
    }

    function gaussRand(mu, sigma) {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return mu + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }

    function selectAction(step, strategy, param) {
      if (strategy === 'egreedy') {
        return Math.random() < param ? Math.floor(Math.random() * K) : Q.indexOf(Math.max(...Q));
      } else if (strategy === 'ucb') {
        if (step === 0) return 0;
        return Q.map((q, i) => N[i] === 0 ? Infinity : q + param * Math.sqrt(Math.log(step + 1) / N[i]))
               .reduce((bi, v, i, a) => v > a[bi] ? i : bi, 0);
      } else { // optimistic
        return Q.indexOf(Math.max(...Q));
      }
    }

    function drawInit() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#5555777';
      ctx.font = '12px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Press ▶ Run to start simulation', canvas.width/2, canvas.height/2);
    }

    function drawChart() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0d0d18';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const pad = {l:40, r:10, t:20, b:30};
      const cw = canvas.width - pad.l - pad.r;
      const ch = canvas.height - pad.t - pad.b;

      // Grid
      ctx.strokeStyle = '#1e1e32';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = pad.t + (ch * i) / 5;
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + cw, y); ctx.stroke();
      }

      if (rewardHistory.length < 2) return;

      const windowSize = 50;
      const smoothed = [];
      for (let i = 0; i < rewardHistory.length; i++) {
        const start = Math.max(0, i - windowSize);
        const avg = rewardHistory.slice(start, i + 1).reduce((a,b)=>a+b,0) / (i - start + 1);
        smoothed.push(avg);
      }

      const minR = Math.min(...smoothed);
      const maxR = Math.max(...smoothed, 0.1);

      // Axes
      ctx.strokeStyle = '#2a2a42'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + ch); ctx.lineTo(pad.l + cw, pad.t + ch); ctx.stroke();

      // Labels
      ctx.fillStyle = '#5555777'; ctx.font = '9px JetBrains Mono, monospace'; ctx.textAlign = 'right';
      ctx.fillText(maxR.toFixed(1), pad.l - 4, pad.t + 4);
      ctx.fillText(minR.toFixed(1), pad.l - 4, pad.t + ch);
      ctx.textAlign = 'center';
      ctx.fillText('Steps', pad.l + cw/2, pad.t + ch + 18);
      ctx.fillText('0', pad.l, pad.t + ch + 14);
      ctx.fillText(rewardHistory.length, pad.l + cw, pad.t + ch + 14);

      // Chart title
      ctx.fillStyle = '#8888aa'; ctx.font = '10px JetBrains Mono, monospace'; ctx.textAlign = 'left';
      ctx.fillText('Avg Reward (smoothed, window=50)', pad.l + 4, pad.t + 14);

      // Line
      ctx.beginPath();
      ctx.strokeStyle = '#f5a623'; ctx.lineWidth = 1.5;
      smoothed.forEach((v, i) => {
        const x = pad.l + (i / (smoothed.length - 1)) * cw;
        const y = pad.t + ch - ((v - minR) / (maxR - minR)) * ch;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Current point
      const lastX = pad.l + cw, lastY = pad.t + ch - ((smoothed[smoothed.length-1] - minR) / (maxR - minR)) * ch;
      ctx.beginPath(); ctx.arc(lastX, lastY, 3, 0, Math.PI*2);
      ctx.fillStyle = '#f5a623'; ctx.fill();
    }

    function updateStats() {
      const step = rewardHistory.length;
      document.getElementById('b-stat-steps').textContent = step;
      document.getElementById('b-stat-avg').textContent = step ? (totalReward/step).toFixed(3) : '–';
      document.getElementById('b-stat-opt').textContent = step ? (100*optimalCount/step).toFixed(1)+'%' : '–';
      const bestArm = trueValues.indexOf(Math.max(...trueValues));
      document.getElementById('b-stat-best').textContent = `Arm ${bestArm} (q*=${trueValues[bestArm].toFixed(2)})`;

      const armsDiv = document.getElementById('b-arms');
      const maxQ = Math.max(...Q);
      armsDiv.innerHTML = trueValues.map((tv, i) => {
        const pct = Q[i] === maxQ ? 100 : Math.max(0, ((Q[i] - Math.min(...Q)) / (maxQ - Math.min(...Q) + 0.01)) * 100);
        return `<div style="font-family:var(--font-mono);font-size:10px;color:var(--text2);display:flex;align-items:center;gap:6px;">
          <span style="width:36px">A${i}: </span>
          <div style="flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:${i===bestArm?'var(--green)':'var(--amber)'};"></div>
          </div>
          <span style="width:36px;text-align:right;color:${Q[i]===maxQ?'var(--amber2)':'var(--text2)'}">${Q[i].toFixed(2)}</span>
        </div>`;
      }).join('');
    }

    async function runSim() {
      if (running) return;
      running = true;
      init();
      const steps = parseInt(document.getElementById('b-steps').value) || 1000;
      const strategy = document.getElementById('b-strategy').value;
      const param = parseFloat(document.getElementById('b-param').value) || 0.1;
      const bestArm = trueValues.indexOf(Math.max(...trueValues));
      const batchSize = 20;

      for (let t = 0; t < steps && running; t++) {
        const a = selectAction(t, strategy, param);
        const r = gaussRand(trueValues[a], 1);
        N[a]++;
        Q[a] += (r - Q[a]) / N[a];
        totalReward += r;
        if (a === bestArm) optimalCount++;
        rewardHistory.push(r);

        if (t % batchSize === 0 || t === steps - 1) {
          drawChart();
          updateStats();
          await new Promise(r => setTimeout(r, 0));
        }
      }
      running = false;
    }

    document.getElementById('b-run').onclick = runSim;
    document.getElementById('b-reset').onclick = () => { running = false; init(); };
    init();
  }
};

// ── CHAPTER 4: Grid World Value Iteration ────────────────────────────────────
DEMOS[4] = {
  title: "Grid World — Value Iteration",
  description: "Watch Dynamic Programming compute the optimal value function on a grid world in real time.",
  render(container) {
    container.innerHTML = `
    <div class="demo-container">
      <div class="demo-header"><div class="demo-dot"></div>Grid World Value Iteration</div>
      <div class="demo-controls">
        <div class="ctrl-group">
          <div class="ctrl-label">Grid Size</div>
          <select class="ctrl-select" id="gw-size">
            <option value="4">4×4</option>
            <option value="6" selected>6×6</option>
            <option value="8">8×8</option>
          </select>
        </div>
        <div class="ctrl-group">
          <div class="ctrl-label">Discount γ</div>
          <input class="ctrl-input" id="gw-gamma" type="number" value="0.9" step="0.05" min="0.1" max="1">
        </div>
        <div class="ctrl-group">
          <div class="ctrl-label">Convergence θ</div>
          <input class="ctrl-input" id="gw-theta" type="number" value="0.001" step="0.001" min="0.0001">
        </div>
        <button class="btn btn-primary" id="gw-run">▶ Iterate</button>
        <button class="btn btn-secondary" id="gw-reset">Reset</button>
        <div class="ctrl-group">
          <div class="ctrl-label">Sweep #</div>
          <span class="stat-val" id="gw-sweep" style="font-family:var(--font-mono);font-size:14px;">0</span>
        </div>
      </div>
      <div class="demo-canvas-wrap">
        <canvas id="gw-canvas" width="400" height="400" style="background:#0a0a0f;border-radius:4px;"></canvas>
        <div class="stats-panel">
          <div class="stat-row"><span class="stat-key">Sweeps</span><span class="stat-val" id="gw-stat-sweeps">0</span></div>
          <div class="stat-row"><span class="stat-key">Max Δ</span><span class="stat-val" id="gw-stat-delta">–</span></div>
          <div class="stat-row"><span class="stat-key">Converged</span><span class="stat-val" id="gw-stat-conv">No</span></div>
          <div style="height:16px"></div>
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--text2);line-height:1.8">
            <div>🟦 = Goal (+1)</div>
            <div>🟥 = Wall (blocked)</div>
            <div>⬜ = Empty (-0.04/step)</div>
            <div>Arrows = optimal policy</div>
            <div style="margin-top:8px;color:var(--text3)">Colors: darker = lower value<br>brighter = higher value</div>
          </div>
        </div>
      </div>
    </div>`;

    const canvas = document.getElementById('gw-canvas');
    const ctx = canvas.getContext('2d');
    let N, V, walls, goalPos, startPos, running;
    const DIRS = [{r:-1,c:0,s:'↑'},{r:1,c:0,s:'↓'},{r:0,c:-1,s:'←'},{r:0,c:1,s:'→'}];

    function initGrid() {
      N = parseInt(document.getElementById('gw-size').value);
      V = Array.from({length:N}, ()=>Array(N).fill(0));
      walls = new Set();
      goalPos = {r:0, c:N-1};
      startPos = {r:N-1, c:0};
      // Add some walls
      const wallFrac = 0.15;
      const numWalls = Math.floor(N*N*wallFrac);
      let placed = 0;
      while (placed < numWalls) {
        const r = Math.floor(Math.random()*N), c = Math.floor(Math.random()*N);
        const key = `${r},${c}`;
        if (!walls.has(key) && !(r===0&&c===N-1) && !(r===N-1&&c===0)) {
          walls.add(key); placed++;
        }
      }
      document.getElementById('gw-stat-sweeps').textContent = '0';
      document.getElementById('gw-stat-delta').textContent = '–';
      document.getElementById('gw-stat-conv').textContent = 'No';
      document.getElementById('gw-sweep').textContent = '0';
      draw();
    }

    function isWall(r,c) { return walls.has(`${r},${c}`); }
    function isGoal(r,c) { return r===goalPos.r && c===goalPos.c; }
    function isValid(r,c) { return r>=0&&r<N&&c>=0&&c<N&&!isWall(r,c); }

    function transition(r,c,dir) {
      const nr = r+dir.r, nc = c+dir.c;
      if (!isValid(nr,nc)) return {r,c}; // bounce back
      return {r:nr, c:nc};
    }

    function getReward(r,c) {
      if (isGoal(r,c)) return 1;
      return -0.04;
    }

    function sweep() {
      const gamma = parseFloat(document.getElementById('gw-gamma').value);
      let delta = 0;
      const newV = V.map(row=>[...row]);
      for (let r=0;r<N;r++) for (let c=0;c<N;c++) {
        if (isWall(r,c) || isGoal(r,c)) continue;
        let maxVal = -Infinity;
        for (const dir of DIRS) {
          const {r:nr,c:nc} = transition(r,c,dir);
          const val = getReward(nr,nc) + gamma*V[nr][nc];
          if (val > maxVal) maxVal = val;
        }
        delta = Math.max(delta, Math.abs(maxVal - V[r][c]));
        newV[r][c] = maxVal;
      }
      V = newV;
      return delta;
    }

    function draw() {
      canvas.width = canvas.offsetWidth || 400;
      canvas.height = canvas.width;
      const cw = canvas.width, ch = canvas.height;
      const cellW = cw/N, cellH = ch/N;
      ctx.clearRect(0,0,cw,ch);

      // Find value range
      let minV = Infinity, maxV = -Infinity;
      for (let r=0;r<N;r++) for (let c=0;c<N;c++) {
        if (!isWall(r,c)) { minV=Math.min(minV,V[r][c]); maxV=Math.max(maxV,V[r][c]); }
      }

      for (let r=0;r<N;r++) for (let c=0;c<N;c++) {
        const x=c*cellW, y=r*cellH;
        if (isWall(r,c)) {
          ctx.fillStyle='#1a1a2e'; ctx.fillRect(x,y,cellW,cellH);
          ctx.fillStyle='#2a2a42'; ctx.font=`${cellW*0.5}px sans-serif`;
          ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.fillText('▪', x+cellW/2, y+cellH/2);
        } else if (isGoal(r,c)) {
          ctx.fillStyle='#1a3a1a'; ctx.fillRect(x,y,cellW,cellH);
          ctx.fillStyle='#4af0a0'; ctx.font=`${Math.min(cellW,cellH)*0.4}px sans-serif`;
          ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.fillText('G', x+cellW/2, y+cellH/2);
          ctx.fillStyle='#4af0a0'; ctx.font='9px JetBrains Mono,monospace';
          ctx.fillText('+1', x+cellW/2, y+cellH*0.75);
        } else {
          const t = maxV===minV ? 0.5 : (V[r][c]-minV)/(maxV-minV);
          // Color: dark blue → amber
          const r2=Math.floor(t*245+(1-t)*15), g2=Math.floor(t*120+(1-t)*15), b2=Math.floor(t*20+(1-t)*40);
          ctx.fillStyle=`rgb(${r2},${g2},${b2})`; ctx.fillRect(x,y,cellW,cellH);
          // Value text
          ctx.fillStyle=t>0.5?'#ffe':' #888';
          ctx.font=`${Math.max(8,cellW*0.22)}px JetBrains Mono,monospace`;
          ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.fillText(V[r][c].toFixed(2), x+cellW/2, y+cellH*0.4);
          // Best action arrow
          const gamma = parseFloat(document.getElementById('gw-gamma').value);
          let bestDir=null, bestVal=-Infinity;
          for (const dir of DIRS) {
            const {r:nr,c:nc}=transition(r,c,dir);
            const val=getReward(nr,nc)+gamma*V[nr][nc];
            if(val>bestVal){bestVal=val;bestDir=dir;}
          }
          if(bestDir){
            ctx.fillStyle=t>0.5?'rgba(255,255,220,0.9)':'rgba(200,200,180,0.8)';
            ctx.font=`${Math.max(10,cellW*0.35)}px sans-serif`;
            ctx.fillText(bestDir.s, x+cellW/2, y+cellH*0.72);
          }
        }
        // Cell border
        ctx.strokeStyle='rgba(10,10,15,0.8)'; ctx.lineWidth=1;
        ctx.strokeRect(x,y,cellW,cellH);
      }
    }

    let sweepCount = 0;
    async function runVI() {
      if (running) return;
      running = true;
      const theta = parseFloat(document.getElementById('gw-theta').value) || 0.001;
      let delta = Infinity;
      while (delta > theta && running) {
        delta = sweep(); sweepCount++;
        document.getElementById('gw-stat-sweeps').textContent = sweepCount;
        document.getElementById('gw-stat-delta').textContent = delta.toFixed(6);
        document.getElementById('gw-sweep').textContent = sweepCount;
        draw();
        await new Promise(r=>setTimeout(r,60));
      }
      if (delta <= theta) { document.getElementById('gw-stat-conv').textContent = 'Yes ✓'; }
      running = false;
    }

    document.getElementById('gw-run').onclick = runVI;
    document.getElementById('gw-reset').onclick = () => { running=false; sweepCount=0; initGrid(); };
    document.getElementById('gw-size').onchange = () => { running=false; sweepCount=0; initGrid(); };
    window.addEventListener('resize', draw);
    initGrid();
  }
};

// ── CHAPTER 6: TD Learning — Cliff Walking ───────────────────────────────────
DEMOS[6] = {
  title: "Cliff Walking: SARSA vs Q-learning",
  description: "Classic example showing on-policy vs off-policy differences. SARSA learns a safer path; Q-learning optimizes for the greedy path.",
  render(container) {
    container.innerHTML = `
    <div class="demo-container">
      <div class="demo-header"><div class="demo-dot"></div>Cliff Walking — SARSA vs Q-learning</div>
      <div class="demo-controls">
        <div class="ctrl-group">
          <div class="ctrl-label">Algorithm</div>
          <select class="ctrl-select" id="cw-algo">
            <option value="sarsa">SARSA (on-policy)</option>
            <option value="qlearn">Q-learning (off-policy)</option>
            <option value="both">Both (compare)</option>
          </select>
        </div>
        <div class="ctrl-group">
          <div class="ctrl-label">ε (explore)</div>
          <input class="ctrl-input" id="cw-eps" type="number" value="0.1" step="0.05" min="0.01" max="1">
        </div>
        <div class="ctrl-group">
          <div class="ctrl-label">α (step size)</div>
          <input class="ctrl-input" id="cw-alpha" type="number" value="0.5" step="0.1" min="0.01" max="1">
        </div>
        <div class="ctrl-group">
          <div class="ctrl-label">Episodes</div>
          <input class="ctrl-input" id="cw-eps-n" type="number" value="500" step="100" min="50">
        </div>
        <button class="btn btn-primary" id="cw-run">▶ Run</button>
        <button class="btn btn-secondary" id="cw-reset">Reset</button>
      </div>
      <div class="demo-canvas-wrap" style="flex-direction:column;">
        <canvas id="cw-grid" width="600" height="160" style="background:#0a0a0f;border-radius:4px;width:100%;"></canvas>
        <canvas id="cw-chart" width="600" height="200" style="background:#0a0a0f;border-radius:4px;width:100%;margin-top:12px;"></canvas>
      </div>
      <div style="padding:12px 20px;border-top:1px solid var(--border);font-family:var(--font-mono);font-size:10px;color:var(--text2);display:flex;gap:24px;">
        <span>🟧 Cliff (-100, restart)</span>
        <span style="color:var(--green)">■ SARSA path (safer)</span>
        <span style="color:var(--amber)">■ Q-learning path (shorter, riskier)</span>
      </div>
    </div>`;

    const ROWS=4, COLS=12;
    const CLIFF_ROW=3, CLIFF_START=1, CLIFF_END=10;
    const START={r:3,c:0}, GOAL={r:3,c:11};
    const ACTIONS=[{r:-1,c:0},{r:1,c:0},{r:0,c:-1},{r:0,c:1}];

    function isCliff(r,c){return r===CLIFF_ROW&&c>=CLIFF_START&&c<=CLIFF_END;}
    function isGoal(r,c){return r===GOAL.r&&c===GOAL.c;}
    function isStart(r,c){return r===START.r&&c===START.c;}

    function step(r,c,a){
      let nr=Math.max(0,Math.min(ROWS-1,r+ACTIONS[a].r));
      let nc=Math.max(0,Math.min(COLS-1,c+ACTIONS[a].c));
      if(isCliff(nr,nc)){return{r:START.r,c:START.c,reward:-100,done:false};}
      if(isGoal(nr,nc)){return{r:nr,c:nc,reward:-1,done:true};}
      return{r:nr,c:nc,reward:-1,done:false};
    }

    function eGreedy(Q,r,c,eps){
      if(Math.random()<eps){return Math.floor(Math.random()*4);}
      let best=0,bv=-Infinity;
      for(let a=0;a<4;a++){if(Q[r][c][a]>bv){bv=Q[r][c][a];best=a;}}
      return best;
    }

    function initQ(){return Array.from({length:ROWS},()=>Array.from({length:COLS},()=>Array(4).fill(0)));}

    function getPath(Q){
      const path=[{...START}];
      let r=START.r,c=START.c;
      for(let i=0;i<200;i++){
        let best=0,bv=-Infinity;
        for(let a=0;a<4;a++){if(Q[r][c][a]>bv){bv=Q[r][c][a];best=a;}}
        const {r:nr,c:nc,done}=step(r,c,best);
        path.push({r:nr,c:nc});
        if(done||path.length>100)break;
        r=nr;c=nc;
      }
      return path;
    }

    function drawGrid(sarsaQ, qlQ, algo){
      const canvas=document.getElementById('cw-grid');
      canvas.width=canvas.offsetWidth||600;
      const ctx=canvas.getContext('2d');
      const cw=canvas.width/COLS, ch=canvas.height/ROWS;
      ctx.clearRect(0,0,canvas.width,canvas.height);

      for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
        const x=c*cw,y=r*ch;
        if(isCliff(r,c)){ctx.fillStyle='#3a0a0a';}
        else if(isGoal(r,c)){ctx.fillStyle='#0a2a1a';}
        else if(isStart(r,c)){ctx.fillStyle='#1a1a3a';}
        else{ctx.fillStyle='#0d0d18';}
        ctx.fillRect(x,y,cw,ch);
        ctx.strokeStyle='#1e1e32';ctx.lineWidth=1;ctx.strokeRect(x,y,cw,ch);

        ctx.font=`${Math.min(cw,ch)*0.35}px JetBrains Mono,monospace`;
        ctx.textAlign='center';ctx.textBaseline='middle';
        if(isCliff(r,c)){ctx.fillStyle='#ff6b6b';ctx.fillText('✕',x+cw/2,y+ch/2);}
        else if(isGoal(r,c)){ctx.fillStyle='#4af0a0';ctx.fillText('G',x+cw/2,y+ch/2);}
        else if(isStart(r,c)){ctx.fillStyle='#a78bfa';ctx.fillText('S',x+cw/2,y+ch/2);}
      }

      // Draw paths
      function drawPath(Q,color,offset){
        const path=getPath(Q);
        ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.globalAlpha=0.85;
        ctx.beginPath();
        path.forEach((p,i)=>{
          const x=p.c*cw+cw/2+offset,y=p.r*ch+ch/2+offset;
          i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        });
        ctx.stroke();ctx.globalAlpha=1;
      }

      if(algo==='sarsa'||algo==='both') drawPath(sarsaQ,'#4af0a0',-2);
      if(algo==='qlearn'||algo==='both') drawPath(qlQ,'#f5a623',2);
    }

    function drawChart(sarsaRewards, qlRewards, algo){
      const canvas=document.getElementById('cw-chart');
      canvas.width=canvas.offsetWidth||600;
      const ctx=canvas.getContext('2d');
      const pad={l:40,r:10,t:20,b:30};
      const cw=canvas.width-pad.l-pad.r, ch=canvas.height-pad.t-pad.b;
      ctx.fillStyle='#0d0d18';ctx.fillRect(0,0,canvas.width,canvas.height);

      function smooth(arr,w=20){
        return arr.map((v,i)=>{
          const s=Math.max(0,i-w);
          return arr.slice(s,i+1).reduce((a,b)=>a+b,0)/(i-s+1);
        });
      }

      const datasets=[];
      if((algo==='sarsa'||algo==='both')&&sarsaRewards.length>1)
        datasets.push({data:smooth(sarsaRewards),color:'#4af0a0',label:'SARSA'});
      if((algo==='qlearn'||algo==='both')&&qlRewards.length>1)
        datasets.push({data:smooth(qlRewards),color:'#f5a623',label:'Q-learning'});

      if(!datasets.length)return;

      const allVals=[].concat(...datasets.map(d=>d.data));
      const minV=Math.max(-300,Math.min(...allVals));
      const maxV=Math.min(0,Math.max(...allVals));
      const vrange=maxV-minV||1;
      const nSteps=Math.max(...datasets.map(d=>d.data.length));

      // Grid
      ctx.strokeStyle='#1e1e32';ctx.lineWidth=1;
      for(let i=0;i<=4;i++){
        const y=pad.t+(ch*i)/4;
        ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+cw,y);ctx.stroke();
      }
      // Axes labels
      ctx.fillStyle='#5555777';ctx.font='9px JetBrains Mono,monospace';
      ctx.textAlign='right';
      ctx.fillText(maxV.toFixed(0),pad.l-4,pad.t+4);
      ctx.fillText(minV.toFixed(0),pad.l-4,pad.t+ch);
      ctx.textAlign='center';
      ctx.fillText('Episodes',pad.l+cw/2,pad.t+ch+18);
      ctx.fillStyle='#8888aa';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='left';
      ctx.fillText('Sum of rewards per episode (smoothed)',pad.l+4,pad.t+14);

      datasets.forEach(({data,color,label})=>{
        ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=2;
        data.forEach((v,i)=>{
          const x=pad.l+(i/Math.max(1,nSteps-1))*cw;
          const y=pad.t+ch-((v-minV)/vrange)*ch;
          i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        });
        ctx.stroke();
        // Legend
        const li=datasets.indexOf(arguments[0]);
        ctx.fillStyle=color;ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='left';
        ctx.fillText('● '+label,pad.l+4+(datasets.indexOf({data,color,label}))*120,pad.t+ch-4);
      });
      datasets.forEach(({data,color,label},i)=>{
        ctx.fillStyle=color;ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='left';
        ctx.fillText('● '+label,pad.l+4+i*120,pad.t+ch-4);
      });
    }

    let running=false;
    async function run(){
      if(running)return; running=true;
      const eps=parseFloat(document.getElementById('cw-eps').value)||0.1;
      const alpha=parseFloat(document.getElementById('cw-alpha').value)||0.5;
      const nEp=parseInt(document.getElementById('cw-eps-n').value)||500;
      const algo=document.getElementById('cw-algo').value;
      const sarsaQ=initQ(), qlQ=initQ();
      const sarsaR=[], qlR=[];

      for(let ep=0;ep<nEp&&running;ep++){
        // SARSA
        if(algo==='sarsa'||algo==='both'){
          let r=START.r,c=START.c,a=eGreedy(sarsaQ,r,c,eps),total=0;
          for(let t=0;t<1000;t++){
            const {r:nr,c:nc,reward,done}=step(r,c,a);
            const na=eGreedy(sarsaQ,nr,nc,eps);
            sarsaQ[r][c][a]+=alpha*(reward+0.9*sarsaQ[nr][nc][na]-sarsaQ[r][c][a]);
            total+=reward;r=nr;c=nc;a=na;
            if(done)break;
          }
          sarsaR.push(total);
        }
        // Q-learning
        if(algo==='qlearn'||algo==='both'){
          let r=START.r,c=START.c,total=0;
          for(let t=0;t<1000;t++){
            const a=eGreedy(qlQ,r,c,eps);
            const {r:nr,c:nc,reward,done}=step(r,c,a);
            const maxQ=Math.max(...qlQ[nr][nc]);
            qlQ[r][c][a]+=alpha*(reward+0.9*maxQ-qlQ[r][c][a]);
            total+=reward;r=nr;c=nc;
            if(done)break;
          }
          qlR.push(total);
        }

        if(ep%20===0||ep===nEp-1){
          drawGrid(sarsaQ,qlQ,algo);
          drawChart(sarsaR,qlR,algo);
          await new Promise(r=>setTimeout(r,0));
        }
      }
      running=false;
    }

    document.getElementById('cw-run').onclick=run;
    document.getElementById('cw-reset').onclick=()=>{running=false;drawGrid(initQ(),initQ(),'both');};
    drawGrid(initQ(),initQ(),'both');
  }
};

// ── CHAPTER 13: Policy Gradient (REINFORCE on Bandit) ────────────────────────
DEMOS[13] = {
  title: "REINFORCE Policy Gradient",
  description: "Watch REINFORCE learn a softmax policy on a 5-armed bandit. Observe how the policy distribution shifts toward optimal actions.",
  render(container) {
    container.innerHTML = `
    <div class="demo-container">
      <div class="demo-header"><div class="demo-dot"></div>REINFORCE on 5-Armed Bandit</div>
      <div class="demo-controls">
        <div class="ctrl-group">
          <div class="ctrl-label">Learning Rate α</div>
          <input class="ctrl-input" id="pg-alpha" type="number" value="0.1" step="0.05" min="0.001" max="1">
        </div>
        <div class="ctrl-group">
          <div class="ctrl-label">Use Baseline?</div>
          <select class="ctrl-select" id="pg-baseline">
            <option value="no">No baseline</option>
            <option value="yes" selected>With baseline</option>
          </select>
        </div>
        <div class="ctrl-group">
          <div class="ctrl-label">Steps</div>
          <input class="ctrl-input" id="pg-steps" type="number" value="1000" step="200" min="100">
        </div>
        <button class="btn btn-primary" id="pg-run">▶ Run</button>
        <button class="btn btn-secondary" id="pg-reset">Reset</button>
      </div>
      <div class="demo-canvas-wrap" style="flex-direction:column;">
        <canvas id="pg-policy" width="600" height="160" style="background:#0a0a0f;border-radius:4px;width:100%;"></canvas>
        <canvas id="pg-reward" width="600" height="180" style="background:#0a0a0f;border-radius:4px;width:100%;margin-top:12px;"></canvas>
      </div>
    </div>`;

    const K=5;
    let H, baseline, trueVals, rewardHist, running;

    function gaussRand(mu,s){
      let u=0,v=0;while(u===0)u=Math.random();while(v===0)v=Math.random();
      return mu+s*Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
    }

    function softmax(h){
      const mx=Math.max(...h);
      const exps=h.map(x=>Math.exp(x-mx));
      const sum=exps.reduce((a,b)=>a+b,0);
      return exps.map(x=>x/sum);
    }

    function sampleAction(pi){
      const r=Math.random();let cum=0;
      for(let i=0;i<pi.length;i++){cum+=pi[i];if(r<cum)return i;}
      return pi.length-1;
    }

    function init(){
      H=Array(K).fill(0);
      baseline=0;
      trueVals=Array.from({length:K},()=>gaussRand(0,1));
      rewardHist=[];
      running=false;
      drawPolicy();
    }

    function drawPolicy(){
      const canvas=document.getElementById('pg-policy');
      canvas.width=canvas.offsetWidth||600;
      const ctx=canvas.getContext('2d');
      const pi=softmax(H);
      const W=canvas.width, H2=canvas.height;
      ctx.fillStyle='#0d0d18';ctx.fillRect(0,0,W,H2);

      const pad=30, barW=(W-pad*2)/K*0.7, gap=(W-pad*2)/K;
      const maxH=H2-60;

      // True values bar (normalized 0-1)
      const minTV=Math.min(...trueVals), maxTV=Math.max(...trueVals);
      const tvRange=maxTV-minTV||1;

      ctx.fillStyle='#8888aa';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText('Policy probability π(a) per action — gray=true value ranking', W/2, 16);

      for(let i=0;i<K;i++){
        const x=pad+i*gap, y=H2-30;
        const probH=pi[i]*(maxH);
        const tvH=((trueVals[i]-minTV)/tvRange)*maxH*0.6;

        // True value bar (ghost)
        ctx.fillStyle='rgba(100,100,150,0.2)';
        ctx.fillRect(x,y-tvH,barW,tvH);

        // Policy bar
        const hue=i===trueVals.indexOf(maxTV)?'#4af0a0':'#f5a623';
        ctx.fillStyle=hue;
        ctx.globalAlpha=0.85;
        ctx.fillRect(x,y-probH,barW,probH);
        ctx.globalAlpha=1;

        // Labels
        ctx.fillStyle='#c8c8e0';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
        ctx.fillText(`A${i}`,x+barW/2,y+12);
        ctx.fillStyle=hue;ctx.font='9px JetBrains Mono,monospace';
        ctx.fillText((pi[i]*100).toFixed(1)+'%',x+barW/2,y-probH-5);
        ctx.fillStyle='#5555777';ctx.font='9px JetBrains Mono,monospace';
        ctx.fillText('q*='+trueVals[i].toFixed(2),x+barW/2,y+22);
      }
    }

    function drawReward(){
      const canvas=document.getElementById('pg-reward');
      canvas.width=canvas.offsetWidth||600;
      const ctx=canvas.getContext('2d');
      if(rewardHist.length<2)return;
      const W=canvas.width,H2=canvas.height;
      ctx.fillStyle='#0d0d18';ctx.fillRect(0,0,W,H2);
      const pad={l:40,r:10,t:20,b:28};
      const cw=W-pad.l-pad.r, ch=H2-pad.t-pad.b;
      const wsize=30;
      const smoothed=rewardHist.map((v,i)=>{
        const s=Math.max(0,i-wsize);
        return rewardHist.slice(s,i+1).reduce((a,b)=>a+b,0)/(i-s+1);
      });
      const minR=Math.min(...smoothed), maxR=Math.max(...smoothed,minR+0.01);
      ctx.strokeStyle='#1e1e32';ctx.lineWidth=1;
      for(let i=0;i<=4;i++){const y=pad.t+ch*i/4;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+cw,y);ctx.stroke();}
      ctx.fillStyle='#5555777';ctx.font='9px JetBrains Mono,monospace';ctx.textAlign='right';
      ctx.fillText(maxR.toFixed(2),pad.l-4,pad.t+4);
      ctx.fillText(minR.toFixed(2),pad.l-4,pad.t+ch);
      ctx.fillStyle='#8888aa';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='left';
      ctx.fillText('Average reward over time (smoothed)',pad.l+4,pad.t+14);
      ctx.textAlign='center';ctx.fillStyle='#5555777';ctx.font='9px JetBrains Mono,monospace';
      ctx.fillText('Steps',pad.l+cw/2,pad.t+ch+18);

      ctx.beginPath();ctx.strokeStyle='#a78bfa';ctx.lineWidth=2;
      smoothed.forEach((v,i)=>{
        const x=pad.l+(i/(smoothed.length-1))*cw;
        const y=pad.t+ch-((v-minR)/(maxR-minR))*ch;
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      });
      ctx.stroke();
    }

    async function run(){
      if(running)return;running=true;
      init();
      const alpha=parseFloat(document.getElementById('pg-alpha').value)||0.1;
      const useBaseline=document.getElementById('pg-baseline').value==='yes';
      const steps=parseInt(document.getElementById('pg-steps').value)||1000;
      let avgR=0;

      for(let t=0;t<steps&&running;t++){
        const pi=softmax(H);
        const a=sampleAction(pi);
        const r=gaussRand(trueVals[a],1);
        avgR+=0.05*(r-avgR);
        rewardHist.push(r);
        const bval=useBaseline?avgR:0;
        // REINFORCE update
        for(let i=0;i<K;i++){
          H[i]+=alpha*(r-bval)*(( i===a?1:0)-pi[i]);
        }
        if(t%30===0||t===steps-1){
          drawPolicy();drawReward();
          await new Promise(r=>setTimeout(r,0));
        }
      }
      running=false;
    }

    document.getElementById('pg-run').onclick=run;
    document.getElementById('pg-reset').onclick=()=>{running=false;init();};
    init();
  }
};

// Default demo for chapters without a specific one
function defaultDemo(chapterId) {
  return {
    title: "Conceptual Illustration",
    description: "",
    render(container) {
      const chapter = CHAPTERS.find(c=>c.id===chapterId);
      container.innerHTML = `
      <div class="demo-container">
        <div class="demo-header"><div class="demo-dot"></div>Chapter ${chapterId} — Concept Visualizer</div>
        <div style="padding:40px;text-align:center;">
          <div style="font-size:48px;margin-bottom:16px">📊</div>
          <div style="font-family:var(--font-serif);font-size:20px;color:var(--white);margin-bottom:12px">${chapter?.title}</div>
          <div style="font-family:var(--font-sans);font-size:13px;color:var(--text2);max-width:500px;margin:0 auto;line-height:1.7">
            Interactive demo for this chapter focuses on the mathematical concepts. Review the key formulas and algorithm pseudocode in the <strong>Concepts</strong> tab, then test your understanding in the <strong>Quiz</strong> tab.
          </div>
          <div style="margin-top:32px;display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
            ${(chapter?.formulas||[]).map(f=>`
              <div style="background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:12px 16px;text-align:left;max-width:320px;">
                <div style="font-family:var(--font-mono);font-size:9px;color:var(--text2);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px">${f.label}</div>
                <div style="font-family:var(--font-mono);font-size:12px;color:var(--amber2)">${f.expr}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>`;
    }
  };
}
