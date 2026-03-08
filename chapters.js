const CHAPTERS = [
  // ── PART I: TABULAR SOLUTION METHODS ──────────────────────────────────────
  {
    id: 1, part: "Part I: Tabular Solution Methods",
    title: "Introduction",
    subtitle: "What is Reinforcement Learning?",
    summary: "Reinforcement learning is learning what to do — how to map situations to actions — so as to maximize a numerical reward signal. Unlike supervised learning, the learner is not told which actions to take; it must discover which actions yield the most reward through trial and error.",
    keyPoints: [
      "RL is distinct from supervised and unsupervised learning: the learner interacts with an environment and receives reward signals.",
      "The agent-environment interface: at each time step, the agent observes state Sₜ, takes action Aₜ, and receives reward Rₜ₊₁ and next state Sₜ₊₁.",
      "The exploration-exploitation dilemma: should the agent exploit known good actions or explore new ones?",
      "Key elements: policy (π), reward signal (Rₜ), value function (v), and optionally a model of the environment.",
      "RL is characterized by trial-and-error search and delayed reward.",
      "Examples: game playing, robot locomotion, resource management, personalized recommendations.",
    ],
    concepts: [
      { name: "Policy (π)", desc: "A mapping from states to probabilities of selecting each possible action. π(a|s) = probability of taking action a in state s." },
      { name: "Reward Signal (Rₜ)", desc: "A number received each time step indicating how well the agent is doing immediately. The goal is to maximize total cumulative reward." },
      { name: "Value Function v(s)", desc: "The expected cumulative reward starting from state s. Unlike reward, value predicts long-term desirability." },
      { name: "Model", desc: "Something that mimics the environment's behavior. Allows planning: reasoning about future states before actually experiencing them. Model-based vs model-free." },
      { name: "Exploration vs Exploitation", desc: "Exploitation uses known information to maximize reward. Exploration gathers more information. You cannot do both at the same time — the fundamental tension in RL." },
    ],
    formulas: [
      { label: "Return (Discounted)", expr: "$$G_t = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\cdots = \\sum_{k=0}^{\\infty} \\gamma^k R_{t+k+1}$$", name: "Discounted return, $\\gamma \\in [0,1]$" },
      { label: "State-Value Function", expr: "$$v_{\\pi}(s) = \\mathbb{E}_{\\pi}\\bigl[G_t \\mid S_t = s\\bigr]$$", name: "Expected return under policy $\\pi$ from state $s$" },
    ],
    quiz: [
      {
        q: "What fundamentally distinguishes reinforcement learning from supervised learning?",
        options: ["RL uses neural networks", "RL learns from labeled input-output pairs", "RL learns from interaction with an environment via reward signals, without labeled examples", "RL requires a model of the environment"],
        correct: 2,
        explanation: "In supervised learning, a teacher provides correct labels. In RL, the agent must discover good actions through trial and error — it only receives a reward signal, not explicit instructions on what the correct action was."
      },
      {
        q: "The exploration-exploitation dilemma refers to:",
        options: ["Whether to use deep or shallow networks", "The tradeoff between using known good actions vs. trying new ones to gather information", "Whether to use model-based or model-free methods", "The choice between on-policy and off-policy learning"],
        correct: 1,
        explanation: "The agent must balance exploiting its current best estimate of which actions are good, and exploring actions that might turn out to be even better (but might also be worse)."
      },
      {
        q: "Which of the following is NOT one of the four main elements of an RL system described by Sutton & Barto?",
        options: ["Policy", "Reward signal", "Neural network", "Value function"],
        correct: 2,
        explanation: "The four key elements are: policy, reward signal, value function, and (optionally) a model of the environment. Neural networks are one possible implementation tool, not a defining element."
      },
      {
        q: "The discount factor γ = 0 makes the agent:",
        options: ["Care equally about all future rewards", "Myopic — care only about immediate reward", "Maximize average reward", "Explore more aggressively"],
        correct: 1,
        explanation: "With γ = 0, Gₜ = Rₜ₊₁. The agent only considers the immediate next reward, ignoring all future rewards. Higher γ (closer to 1) makes the agent more 'far-sighted'."
      },
    ]
  },

  {
    id: 2, part: "Part I: Tabular Solution Methods",
    title: "Multi-armed Bandits",
    subtitle: "The k-armed bandit problem",
    summary: "The k-armed bandit problem is the simplest setting for studying the exploration-exploitation tradeoff. An agent repeatedly chooses from k actions (arms), each yielding a reward from an unknown distribution. The goal is to maximize total reward over time.",
    keyPoints: [
      "The k-armed bandit: choose one of k actions repeatedly; each action has a true value q*(a) = 𝔼[R | A=a].",
      "Greedy action selection: always select the action with highest estimated value. Pure exploitation.",
      "ε-greedy: with probability ε explore (random action), otherwise exploit. Simple and effective.",
      "Optimistic initial values: initialize Q(a) high to encourage early exploration; only works for stationary problems.",
      "Upper Confidence Bound (UCB): select action with highest upper confidence bound — principled exploration.",
      "Gradient bandit algorithms: learn a preference H(a) and use softmax. No explicit value estimates.",
      "Nonstationary problems: true values drift over time; use constant step-size α to weight recent rewards more.",
    ],
    concepts: [
      { name: "Action-Value Estimate Q(a)", desc: "Our running estimate of the true value q*(a). Updated as: Q(a) ← Q(a) + α[R - Q(a)]. Sample-average when α = 1/n." },
      { name: "ε-greedy Policy", desc: "With prob 1-ε: Aₜ = argmax_a Q(a). With prob ε: pick a random action. ε controls exploration rate." },
      { name: "UCB Action Selection", desc: "Aₜ = argmax_a [Q(a) + c√(ln t / Nₜ(a))]. The square root term acts as an uncertainty bonus — actions tried less often get a higher bonus." },
      { name: "Incremental Update Rule", desc: "NewEstimate ← OldEstimate + StepSize × [Target - OldEstimate]. This 'error reduction' form appears throughout RL." },
      { name: "Regret", desc: "The total reward lost relative to always picking the optimal action: Lₜ = t·q*(a*) - Σᵢ Rᵢ. Sublinear regret means we asymptotically approach optimal." },
    ],
    formulas: [
      { label: "Sample-Average Update", expr: "$$Q_{n+1} = Q_n + \\frac{1}{n}\\bigl[R_n - Q_n\\bigr]$$", name: "Incremental sample mean; equivalent to averaging all rewards" },
      { label: "Exponential Recency-Weighted Average", expr: "$$Q_{n+1} = Q_n + \\alpha\\bigl[R_n - Q_n\\bigr] \\;\\Longrightarrow\\; Q_{n+1} = (1-\\alpha)^n Q_1 + \\sum_{i=1}^{n} \\alpha(1-\\alpha)^{n-i} R_i$$", name: "Constant step-size $\\alpha$ for nonstationary problems" },
      { label: "UCB Selection", expr: "$$A_t = \\arg\\max_{a} \\left[ Q(a) + c\\sqrt{\\frac{\\ln t}{N_t(a)}} \\right]$$", name: "$c$ controls exploration width; $N_t(a)$ = # times $a$ was chosen" },
      { label: "Softmax (Gradient Bandit)", expr: "$$\\pi(a) = \\frac{e^{H(a)}}{\\displaystyle\\sum_{b} e^{H(b)}}$$", name: "Action preference $H(a)$ updated via stochastic gradient ascent" },
    ],
    quiz: [
      {
        q: "In a 10-armed bandit, the greedy algorithm always selects the arm with the highest Q estimate. What is its main weakness?",
        options: ["It is computationally too expensive", "It may converge to a suboptimal arm if initial estimates are inaccurate", "It ignores the reward signal", "It explores too aggressively"],
        correct: 1,
        explanation: "Pure greedy gets 'stuck' — if by chance a suboptimal arm is tried first and gets a high reward, the agent keeps exploiting it and never discovers better arms."
      },
      {
        q: "What does the UCB formula's uncertainty term √(ln t / Nₜ(a)) represent?",
        options: ["The variance of the reward distribution", "An upper bound on how much the true value could differ from the estimate — actions tried rarely have higher uncertainty", "The probability of the action being optimal", "The discount factor applied to past rewards"],
        correct: 1,
        explanation: "The term inflates the estimate for rarely-tried actions, naturally driving exploration. As an action is tried more (Nₜ(a) grows), the bonus shrinks — exploration becomes less needed."
      },
      {
        q: "Why do constant step-size updates (α = 0.1) outperform sample averages on nonstationary problems?",
        options: ["Constant step-size uses less memory", "Constant step-size gives more weight to recent rewards, tracking a drifting true value", "Sample averages overfit to recent rewards", "There is no difference between the two"],
        correct: 1,
        explanation: "Sample averages weight all observations equally. When true values change over time, recent rewards are more relevant. Constant α makes the estimate an exponentially weighted average favoring recent samples."
      },
      {
        q: "Optimistic initial values (e.g., Q(a) = +5 for all a) encourage exploration because:",
        options: ["Higher initial values reduce the learning rate", "The agent is disappointed after any action (reward < 5), so it keeps trying others", "It is equivalent to UCB", "It applies to nonstationary problems best"],
        correct: 1,
        explanation: "When all Q values start high, even after taking the best action (say reward ≈ 1), the estimate drops below the other optimistic values, causing the agent to try those too. This enforces early-phase exploration."
      },
    ]
  },

  {
    id: 3, part: "Part I: Tabular Solution Methods",
    title: "Finite Markov Decision Processes",
    subtitle: "The formal framework of RL",
    summary: "Markov Decision Processes (MDPs) provide the mathematical framework for sequential decision making. They formalize the interaction between an agent and environment through states, actions, transition probabilities, and rewards. The Markov property makes the future conditionally independent of the past given the present state.",
    keyPoints: [
      "An MDP is defined by (S, A, P, R, γ): states, actions, transition function, reward function, discount factor.",
      "Markov Property: P(Sₜ₊₁, Rₜ₊₁ | Sₜ, Aₜ) — the future depends only on current state and action, not history.",
      "The Bellman equations are the central recursive relationships for value functions.",
      "State-value vπ(s): expected return from s following π. Action-value qπ(s,a): expected return taking a from s then following π.",
      "Optimal value functions v*(s) and q*(s,a) give the best achievable performance from any state.",
      "The Bellman optimality equations are nonlinear but can be solved for finite MDPs.",
    ],
    concepts: [
      { name: "Markov Property", desc: "p(s',r|s,a) = P(Sₜ₊₁=s', Rₜ₊₁=r | Sₜ=s, Aₜ=a). The state captures all relevant past information — knowing the current state is sufficient for predicting the future." },
      { name: "Bellman Equation for vπ", desc: "vπ(s) = Σₐ π(a|s) Σₛ',ᵣ p(s',r|s,a)[r + γvπ(s')]. Value of s = expected immediate reward + discounted value of next state." },
      { name: "Optimal Policy π*", desc: "A policy better than or equal to all other policies. π* achieves v*(s) = max_π vπ(s) for all s simultaneously." },
      { name: "Bellman Optimality Equation", desc: "v*(s) = max_a Σₛ',ᵣ p(s',r|s,a)[r + γv*(s')]. Take the action that maximizes expected discounted return." },
      { name: "Episode vs Continuing Tasks", desc: "Episodic: clear termination (e.g., chess). Continuing: no end (e.g., process control). Discounting handles continuing tasks; episodes use T instead of ∞ in the return sum." },
    ],
    formulas: [
      { label: "Bellman Equation for $v_\\pi$", expr: "$$v_{\\pi}(s) = \\sum_{a} \\pi(a|s) \\sum_{s',r} p(s',r|s,a)\\bigl[r + \\gamma\\, v_{\\pi}(s')\\bigr]$$", name: "Consistency condition: value of $s$ = weighted avg of (reward + discounted next value)" },
      { label: "Bellman Optimality for $v^*$", expr: "$$v^*(s) = \\max_{a} \\sum_{s',r} p(s',r|s,a)\\bigl[r + \\gamma\\, v^*(s')\\bigr]$$", name: "Optimal Bellman: take the best action at each state" },
      { label: "Action-Value Function", expr: "$$q_{\\pi}(s,a) = \\sum_{s',r} p(s',r|s,a)\\left[r + \\gamma \\sum_{a'} \\pi(a'|s')\\, q_{\\pi}(s',a')\\right]$$", name: "$q(s,a)$: expected return taking $a$ from $s$, then following $\\pi$" },
      { label: "Greedy Policy from $v^*$", expr: "$$\\pi^*(s) = \\arg\\max_{a} \\sum_{s',r} p(s',r|s,a)\\bigl[r + \\gamma\\, v^*(s')\\bigr]$$", name: "Once we have $v^*$, the optimal policy is greedy w.r.t. $v^*$" },
    ],
    quiz: [
      {
        q: "What does the Markov property state?",
        options: [
          "The reward only depends on the current action",
          "The future state and reward depend only on the current state and action, not on the history",
          "The policy must be deterministic",
          "The transition probabilities are constant over time"
        ],
        correct: 1,
        explanation: "The Markov property says p(Sₜ₊₁, Rₜ₊₁ | Sₜ, Aₜ, Sₜ₋₁, ...) = p(Sₜ₊₁, Rₜ₊₁ | Sₜ, Aₜ). The current state is a sufficient statistic for the future — all relevant history is encoded in Sₜ."
      },
      {
        q: "The Bellman equation for vπ(s) expresses:",
        options: [
          "The maximum possible value from state s",
          "The value of s as: average over actions of (immediate reward + discounted value of next state)",
          "The difference between optimal and current policy values",
          "The gradient of the value function"
        ],
        correct: 1,
        explanation: "The Bellman equation is a self-consistency condition: vπ(s) = Σₐ π(a|s) Σₛ',r p(s',r|s,a)[r + γvπ(s')]. It expresses the current state's value in terms of immediate rewards and successor state values."
      },
      {
        q: "If v*(s) is known for all states, how do we obtain the optimal policy?",
        options: [
          "We need to run policy gradient on v*",
          "Set π*(s) = argmax_a Σₛ',r p(s',r|s,a)[r + γv*(s')] — greedy w.r.t. v*",
          "Run value iteration until convergence again",
          "Use the policy that minimizes vπ(s)"
        ],
        correct: 1,
        explanation: "Knowing v* makes policy extraction one-step greedy: at each state, pick the action that maximizes expected reward plus discounted value of next state. This works because v* already encodes globally optimal values."
      },
      {
        q: "The discount factor γ = 1 is generally problematic for continuing (non-episodic) tasks because:",
        options: [
          "It makes exploration impossible",
          "The sum Gₜ = Σₖ₌₀^∞ Rₜ₊ₖ₊₁ may not converge (infinite reward)",
          "It is computationally expensive",
          "It makes all policies equivalent"
        ],
        correct: 1,
        explanation: "For continuing tasks without γ < 1, the infinite sum of rewards may diverge if rewards are nonzero. Discounting ensures convergence of the return Gₜ = Σ γᵏ Rₜ₊ₖ₊₁ as long as rewards are bounded."
      },
    ]
  },

  {
    id: 4, part: "Part I: Tabular Solution Methods",
    title: "Dynamic Programming",
    subtitle: "Planning with a perfect model",
    summary: "Dynamic Programming (DP) methods use a complete model of the environment to compute optimal value functions. They are the foundation of most RL algorithms. Policy Evaluation computes vπ; Policy Improvement makes a policy greedy w.r.t. its value function; Policy Iteration alternates both to convergence.",
    keyPoints: [
      "DP requires a complete model p(s',r|s,a) — the transition and reward function for all states.",
      "Policy Evaluation: iterative Bellman updates compute vπ for a fixed policy π.",
      "Policy Improvement Theorem: if qπ(s, π'(s)) ≥ vπ(s) for all s, then π' ≥ π.",
      "Policy Iteration: alternate evaluation and improvement; converges to π* in a finite number of steps.",
      "Value Iteration: combine evaluation + improvement into a single Bellman optimality backup.",
      "Asynchronous DP: update states in any order, not necessarily all at once (more efficient in practice).",
      "DP is O(n²m) per sweep (n states, m actions) — exponential state spaces make it infeasible for large problems.",
    ],
    concepts: [
      { name: "Policy Evaluation (Prediction)", desc: "Given π, compute vπ. Iteratively apply Bellman update: V(s) ← Σₐ π(a|s) Σₛ',r p(s',r|s,a)[r + γV(s')] until convergence (Δ < θ)." },
      { name: "Policy Improvement", desc: "Make policy greedy w.r.t. current value function: π'(s) = argmax_a Σₛ',r p(s',r|s,a)[r + γV(s')]. If π' = π, then π is optimal." },
      { name: "Policy Iteration", desc: "E → I → E → I → ... alternating evaluation and improvement. Convergence guaranteed since the policy space is finite." },
      { name: "Value Iteration", desc: "Skip full evaluation; apply one Bellman optimality update per sweep: V(s) ← max_a Σₛ',r p(s',r|s,a)[r + γV(s')]. Faster per iteration than policy iteration." },
      { name: "Bootstrap", desc: "DP methods update estimates of value using other estimates (not actual returns). This 'bootstrapping' is what distinguishes DP/TD from Monte Carlo." },
    ],
    formulas: [
      { label: "Policy Evaluation Update", expr: "$$V(s) \\leftarrow \\sum_{a} \\pi(a|s) \\sum_{s',r} p(s',r|s,a)\\bigl[r + \\gamma V(s')\\bigr]$$", name: "Iterative Bellman backup for fixed policy $\\pi$" },
      { label: "Policy Improvement", expr: "$$\\pi'(s) = \\arg\\max_{a} \\sum_{s',r} p(s',r|s,a)\\bigl[r + \\gamma V(s')\\bigr]$$", name: "Greedy policy w.r.t. current value function $V$" },
      { label: "Value Iteration Update", expr: "$$V(s) \\leftarrow \\max_{a} \\sum_{s',r} p(s',r|s,a)\\bigl[r + \\gamma V(s')\\bigr]$$", name: "One-step Bellman optimality update — combines eval + improvement" },
    ],
    quiz: [
      {
        q: "What is the main limitation of Dynamic Programming methods?",
        options: [
          "They cannot find the optimal policy",
          "They require a complete and accurate model of the environment",
          "They only work for episodic tasks",
          "They cannot handle discounted rewards"
        ],
        correct: 1,
        explanation: "DP methods require complete knowledge of p(s',r|s,a) for all states, actions, and transitions. In most real RL problems, this model is unavailable — which is why model-free methods (MC, TD) are needed."
      },
      {
        q: "Policy Improvement Theorem states that if qπ(s, π'(s)) ≥ vπ(s) for all s, then:",
        options: [
          "π' is worse than π",
          "π' is at least as good as π (vπ'(s) ≥ vπ(s) for all s)",
          "π' and π have equal value",
          "π is the optimal policy"
        ],
        correct: 1,
        explanation: "If we can find any policy π' such that following it from any state is at least as good as following π (measured by qπ), then π' achieves at least as high a value function as π everywhere."
      },
      {
        q: "How does Value Iteration differ from Policy Iteration?",
        options: [
          "Value Iteration uses sampling; Policy Iteration uses full sweeps",
          "Value Iteration applies Bellman optimality updates directly without waiting for full policy evaluation to converge",
          "Value Iteration is for continuous state spaces",
          "They are equivalent — just different names"
        ],
        correct: 1,
        explanation: "Policy Iteration runs full policy evaluation (many Bellman sweeps) before each improvement step. Value Iteration applies max_a over the Bellman update directly each sweep, combining evaluation and improvement."
      },
      {
        q: "In iterative policy evaluation, convergence is detected by:",
        options: [
          "The policy stops changing",
          "The maximum change in value across all states (Δ) falling below a threshold θ",
          "The number of iterations exceeding a fixed limit",
          "The bellman residual exceeding 1"
        ],
        correct: 1,
        explanation: "We track Δ = max_s |V(s) - v_old(s)| across all states each sweep. When Δ < θ (a small threshold), we consider V to have converged to vπ sufficiently well."
      },
    ]
  },

  {
    id: 5, part: "Part I: Tabular Solution Methods",
    title: "Monte Carlo Methods",
    subtitle: "Learning from complete episodes",
    summary: "Monte Carlo methods learn directly from complete episodes of experience, without a model of the environment. They estimate value functions by averaging actual returns. Unlike DP, MC doesn't bootstrap — it uses full sample returns from actual interaction.",
    keyPoints: [
      "Monte Carlo: learn value functions from complete episodes of actual experience (no model needed).",
      "First-visit MC: average returns only on the first visit to each state in an episode.",
      "Every-visit MC: average returns on every visit (can lead to correlations but often works well).",
      "MC Prediction: estimate vπ(s) as average of observed returns following s.",
      "MC Control: GPI with MC evaluation. Exploring starts or ε-soft policies ensure exploration.",
      "Off-policy MC: use importance sampling to learn target policy from behavior policy data.",
      "Importance Sampling Ratio: ρ = ∏ π(Aₜ|Sₜ)/b(Aₜ|Sₜ) — can have high variance.",
    ],
    concepts: [
      { name: "Monte Carlo Prediction", desc: "For each episode: compute return Gₜ from each visited state. Average those returns: V(s) = mean of all G observed after visiting s." },
      { name: "Exploring Starts", desc: "Every (s,a) pair has nonzero probability of being the starting state. Guarantees all pairs are visited. Works in simulation but hard in practice." },
      { name: "ε-soft Policy", desc: "π(a|s) ≥ ε/|A(s)| for all a. A blend of greedy and random. Used in on-policy MC control to ensure continued exploration." },
      { name: "Off-Policy Learning", desc: "Behavior policy b generates data; target policy π is being evaluated/improved. Allows learning from data generated by a different policy (human demos, old policies)." },
      { name: "Importance Sampling", desc: "Corrects for the distribution mismatch between b and π. Ordinary IS: weighted mean of returns. Weighted IS: weighted sum / sum of weights (lower variance, biased)." },
    ],
    formulas: [
      { label: "MC Value Update", expr: "$$V(S) \\leftarrow V(S) + \\alpha\\bigl[G - V(S)\\bigr], \\quad G = \\sum_{k=0}^{T-t-1} \\gamma^k R_{t+k+1}$$", name: "Update toward actual observed return $G$ (no bootstrap)" },
      { label: "Importance Sampling Ratio", expr: "$$\\rho_{t:T-1} = \\prod_{k=t}^{T-1} \\frac{\\pi(A_k|S_k)}{b(A_k|S_k)}$$", name: "Product of probability ratios along the episode" },
    ],
    quiz: [
      {
        q: "What is the key advantage of Monte Carlo methods over Dynamic Programming?",
        options: [
          "MC methods are faster per episode",
          "MC methods do not require a model of the environment",
          "MC methods bootstrap from estimates",
          "MC methods can learn from partial episodes"
        ],
        correct: 1,
        explanation: "MC methods learn from actual experience — they only need sample episodes (sequences of states, actions, rewards). DP needs the full transition model p(s',r|s,a)."
      },
      {
        q: "Monte Carlo methods do NOT bootstrap. This means:",
        options: [
          "They don't use the Bellman equation",
          "They update value estimates using other value estimates",
          "They use actual observed returns (full episode), not estimated future values",
          "They cannot be used with discounting"
        ],
        correct: 2,
        explanation: "Bootstrapping = using value estimates of successor states to update the current estimate. MC uses the actual return G (computed from the full episode), not estimates. DP and TD bootstrap; MC does not."
      },
      {
        q: "Why can ordinary importance sampling have high variance?",
        options: [
          "Because it uses too many episodes",
          "Because the product of probability ratios ρ = ∏π/b can become very large or very small",
          "Because it only uses first-visit returns",
          "Because it requires an ε-greedy behavior policy"
        ],
        correct: 1,
        explanation: "ρ = ∏ₖ π(Aₖ|Sₖ)/b(Aₖ|Sₖ) is a product over many steps. If the policies differ significantly, individual ratios can be far from 1, and their product over long episodes can explode or vanish, causing high variance estimates."
      },
      {
        q: "Exploring starts is used to:",
        options: [
          "Reduce computation time",
          "Ensure every state-action pair is visited with nonzero probability, enabling off-policy learning",
          "Guarantee all state-action pairs are eventually tried in on-policy MC control",
          "Initialize value functions optimistically"
        ],
        correct: 2,
        explanation: "In MC control, we need to ensure we visit all (s,a) pairs to improve the policy everywhere. Exploring starts guarantees this by requiring every pair to be a possible starting point of episodes."
      },
    ]
  },

  {
    id: 6, part: "Part I: Tabular Solution Methods",
    title: "Temporal-Difference Learning",
    subtitle: "Combining DP ideas with MC experience",
    summary: "TD learning combines the ability to learn from raw experience (like MC) with bootstrapping from current estimates (like DP). TD(0) is the simplest TD method, updating after every step using a one-step return. SARSA and Q-learning are the fundamental on-policy and off-policy TD control algorithms.",
    keyPoints: [
      "TD(0): update V(Sₜ) using the one-step TD target: Rₜ₊₁ + γV(Sₜ₊₁). No need to wait for episode end.",
      "TD error: δₜ = Rₜ₊₁ + γV(Sₜ₊₁) - V(Sₜ). The 'surprise' signal driving learning.",
      "SARSA (on-policy TD control): update Q(S,A) using next state and action chosen by policy.",
      "Q-learning (off-policy TD control): update Q(S,A) using max over next actions. Directly learns Q*.",
      "Expected SARSA: use expected value over next actions instead of a sampled action. Lower variance.",
      "TD converges faster than MC in practice (lower variance), though slightly biased.",
    ],
    concepts: [
      { name: "TD(0) Update", desc: "V(Sₜ) ← V(Sₜ) + α[Rₜ₊₁ + γV(Sₜ₊₁) - V(Sₜ)]. Target = Rₜ₊₁ + γV(Sₜ₊₁). Bootstraps: uses V(Sₜ₊₁) — an estimate of future value." },
      { name: "SARSA", desc: "On-policy. Uses (Sₜ, Aₜ, Rₜ₊₁, Sₜ₊₁, Aₜ₊₁) — the action Aₜ₊₁ is chosen by the current policy. Update: Q(S,A) ← Q(S,A) + α[R + γQ(S',A') - Q(S,A)]." },
      { name: "Q-learning", desc: "Off-policy. Target uses max_a Q(S',a) — the best next action regardless of what the policy would choose. Directly estimates Q*(s,a)." },
      { name: "TD Error (δₜ)", desc: "δₜ = Rₜ₊₁ + γV(Sₜ₊₁) - V(Sₜ). The difference between the TD target and current estimate. Biologically: analogous to dopamine prediction error." },
      { name: "Deadly Triad", desc: "Combining function approximation + bootstrapping + off-policy training can lead to divergence. Q-learning with linear function approximation and off-policy data can diverge." },
    ],
    formulas: [
      { label: "TD(0) Update Rule", expr: "$$V(S_t) \\leftarrow V(S_t) + \\alpha\\bigl[\\underbrace{R_{t+1} + \\gamma V(S_{t+1})}_{\\text{TD target}} - V(S_t)\\bigr]$$", name: "$\\alpha$ = step size; TD error $\\delta_t = R_{t+1} + \\gamma V(S_{t+1}) - V(S_t)$" },
      { label: "SARSA Update", expr: "$$Q(S_t,A_t) \\leftarrow Q(S_t,A_t) + \\alpha\\bigl[R_{t+1} + \\gamma Q(S_{t+1},A_{t+1}) - Q(S_t,A_t)\\bigr]$$", name: "On-policy: $A_{t+1}$ selected by current $\\varepsilon$-greedy policy" },
      { label: "Q-learning Update", expr: "$$Q(S_t,A_t) \\leftarrow Q(S_t,A_t) + \\alpha\\bigl[R_{t+1} + \\gamma \\max_{a} Q(S_{t+1},a) - Q(S_t,A_t)\\bigr]$$", name: "Off-policy: target uses $\\max$ over next-state actions" },
    ],
    quiz: [
      {
        q: "How does TD learning differ from Monte Carlo in terms of updates?",
        options: [
          "TD updates only at the end of an episode",
          "TD updates after every step using a bootstrapped estimate; MC waits for the full return",
          "TD requires a model; MC does not",
          "There is no fundamental difference"
        ],
        correct: 1,
        explanation: "TD updates V(Sₜ) immediately after each step using R_{t+1} + γV(S_{t+1}) as the target. MC must wait until the episode ends to compute the actual return G. This makes TD applicable to continuing tasks."
      },
      {
        q: "Q-learning is called an off-policy method because:",
        options: [
          "It uses a separate target network",
          "The target max_a Q(S',a) is computed for the greedy policy, regardless of the behavior policy used to collect data",
          "It learns a Q function instead of a value function",
          "It uses importance sampling"
        ],
        correct: 1,
        explanation: "The Q-learning target r + γ max_a Q(s',a) reflects the optimal greedy policy, even if the agent is following an ε-greedy behavior policy. So we're learning about one policy while following another — that's off-policy."
      },
      {
        q: "In the Cliff Walking example, SARSA learns a safer path than Q-learning. Why?",
        options: [
          "SARSA has a lower learning rate",
          "SARSA's on-policy updates account for ε-greedy exploration, so it avoids the cliff edge where ε-random steps could fall in",
          "Q-learning cannot solve cliff walking",
          "SARSA uses double Q-values"
        ],
        correct: 1,
        explanation: "SARSA learns the value of what the policy actually does (including exploration steps). Near the cliff, ε-greedy sometimes takes random steps. SARSA accounts for this risk by learning a 'safe' path further from the cliff. Q-learning optimizes for the deterministic greedy policy and takes the shorter risky path."
      },
      {
        q: "What is the TD error δₜ?",
        options: [
          "The total error accumulated over an episode",
          "δₜ = Rₜ₊₁ + γV(Sₜ₊₁) - V(Sₜ): the difference between the TD target and the current value estimate",
          "The gradient of the value function loss",
          "The KL divergence between old and new policies"
        ],
        correct: 1,
        explanation: "The TD error δₜ = R_{t+1} + γV(S_{t+1}) - V(S_t) is the 'prediction error' — how much better or worse things turned out compared to our current estimate. Updates move V(Sₜ) in the direction of δₜ."
      },
    ]
  },

  {
    id: 7, part: "Part I: Tabular Solution Methods",
    title: "n-step Bootstrapping",
    subtitle: "Unifying MC and TD",
    summary: "n-step TD methods bridge the gap between TD(0) (1-step) and Monte Carlo (full return). The n-step return uses n actual rewards before bootstrapping from the value estimate. This allows a smooth tradeoff between bias (more bootstrap) and variance (more MC).",
    keyPoints: [
      "n-step return: Gₜ:ₜ₊ₙ = Rₜ₊₁ + γRₜ₊₂ + ... + γⁿ⁻¹Rₜ₊ₙ + γⁿV(Sₜ₊ₙ).",
      "n=1 gives TD(0); n=∞ gives MC. Best n is problem-dependent (often intermediate).",
      "n-step SARSA and n-step Q-sigma generalize TD control.",
      "n-step off-policy requires per-decision importance sampling.",
      "TD(λ): the λ-return elegantly combines all n-step returns, weighting by (1-λ)λⁿ⁻¹.",
    ],
    concepts: [
      { name: "n-step Return", desc: "Gₜ:ₜ₊ₙ = Σₖ₌₁ⁿ γᵏ⁻¹Rₜ₊ₖ + γⁿV(Sₜ₊ₙ). Uses n actual rewards then bootstraps from estimated value at time t+n." },
      { name: "Bias-Variance Tradeoff", desc: "1-step TD: high bias (relies on potentially inaccurate V), low variance. MC: unbiased (true return), high variance. n-step smoothly trades off: larger n → lower bias, higher variance." },
      { name: "λ-Return", desc: "Gₜ^λ = (1-λ)Σₙ₌₁^∞ λⁿ⁻¹ Gₜ:ₜ₊ₙ. A geometrically weighted average of all n-step returns. λ=0 → TD(0); λ=1 → MC." },
    ],
    formulas: [
      { label: "$n$-step Return", expr: "$$G_{t:t+n} = R_{t+1} + \\gamma R_{t+2} + \\cdots + \\gamma^{n-1}R_{t+n} + \\gamma^n V(S_{t+n})$$", name: "$n$ real rewards + bootstrapped tail at $S_{t+n}$" },
      { label: "$\\lambda$-Return", expr: "$$G_t^\\lambda = (1-\\lambda)\\sum_{n=1}^{\\infty} \\lambda^{n-1}\\, G_{t:t+n}$$", name: "$\\lambda\\in[0,1]$: geometric average of all $n$-step returns" },
      { label: "$n$-step Update", expr: "$$V(S_t) \\leftarrow V(S_t) + \\alpha\\bigl[G_{t:t+n} - V(S_t)\\bigr]$$", name: "Wait $n$ steps, then update with $n$-step return" },
    ],
    quiz: [
      {
        q: "What value of n in n-step TD corresponds to Monte Carlo?",
        options: ["n = 0", "n = 1", "n = episode length (T-t)", "n = ∞"],
        correct: 2,
        explanation: "When n extends to the end of the episode (n = T-t), the n-step return Gₜ:T = Rₜ₊₁ + γRₜ₊₂ + ... + γᵀ⁻ᵗ⁻¹Rₜ = the full undiscounted return Gₜ, which is exactly what Monte Carlo uses."
      },
      {
        q: "Why might an intermediate n (e.g., n=4) sometimes outperform both n=1 (TD) and n=∞ (MC)?",
        options: [
          "It uses less memory",
          "It balances bias from bootstrapping (reduced vs TD) and variance from sampling (reduced vs MC)",
          "It is faster to compute",
          "It avoids the need for a behavior policy"
        ],
        correct: 1,
        explanation: "TD has low variance but can have high bias (the value estimates are wrong early on). MC has zero bias but high variance. n-step methods find a sweet spot: using enough real rewards to reduce bias while not using so many that variance explodes."
      },
    ]
  },

  {
    id: 8, part: "Part I: Tabular Solution Methods",
    title: "Planning and Learning with Tabular Methods",
    subtitle: "Integrating model-based and model-free",
    summary: "This chapter unifies model-based (Dyna) and model-free RL. Dyna-Q integrates real experience for both learning and model updates, and simulated experience (planning) for additional Q-learning updates. This dramatically improves sample efficiency.",
    keyPoints: [
      "Planning: use a learned model to generate simulated experience for additional updates.",
      "Dyna-Q: interleaves real interaction, model learning, and planning (simulated RL updates).",
      "Model learning: build a model from real transitions (s,a) → (r,s'). Use it to simulate transitions.",
      "Prioritized sweeping: focus planning on state-action pairs with large expected updates (Bellman error).",
      "When models are wrong, learning can diverge — need to balance model use and model error.",
      "Trajectory sampling vs. exhaustive sweeps: focus on states relevant to the current policy.",
    ],
    concepts: [
      { name: "Dyna-Q Architecture", desc: "Direct RL: real experience updates Q via Q-learning. Model learning: real experience updates the model. Planning: n simulated experiences from model update Q further. More planning steps → faster learning per real interaction." },
      { name: "Background Planning", desc: "Using a model to do additional RL updates 'in the background' between real-world steps. n planning steps per real step is the key hyperparameter in Dyna-Q." },
      { name: "Prioritized Sweeping", desc: "Update state-action pairs ordered by the magnitude of their expected Bellman error. Pairs with large errors propagate information further and faster." },
      { name: "Heuristic Search", desc: "Planning at decision time: for each real decision, run many simulated rollouts forward to depth d and back them up. Computationally intensive but highly focused." },
    ],
    formulas: [
      { label: "Dyna-Q Planning Update", expr: "$$Q(S,A) \\leftarrow Q(S,A) + \\alpha\\bigl[R + \\gamma\\max_a Q(S',a) - Q(S,A)\\bigr] \\quad (S,A,R,S'\\text{ from model})$$", name: "Same Q-learning update but using simulated (model) transitions" },
    ],
    quiz: [
      {
        q: "What is the key benefit of planning in Dyna-Q?",
        options: [
          "It eliminates the need for real interaction",
          "Each real experience is used multiple times via model simulation, dramatically improving sample efficiency",
          "It removes the exploration problem",
          "Planning eliminates function approximation errors"
        ],
        correct: 1,
        explanation: "In Dyna-Q, every real transition (s,a,r,s') updates both Q and the model. Then n additional planning steps generate simulated transitions from the model — amplifying the value of each real experience without requiring more environment interaction."
      },
      {
        q: "Prioritized sweeping focuses planning on:",
        options: [
          "Randomly selected state-action pairs",
          "The most recently visited states",
          "State-action pairs with the largest predicted Bellman error (largest |expected update|)",
          "Terminal states only"
        ],
        correct: 2,
        explanation: "If the Bellman error at (s,a) is large, updating Q(s,a) will change it significantly. Prioritizing large-error pairs propagates information more efficiently through the value function."
      },
    ]
  },

  // ── PART II: APPROXIMATE SOLUTION METHODS ─────────────────────────────────
  {
    id: 9, part: "Part II: Approximate Solution Methods",
    title: "On-policy Prediction with Approximation",
    subtitle: "Scaling to large state spaces",
    summary: "In large or continuous state spaces, tabular methods are infeasible. Function approximation represents value functions with parameterized forms (linear, neural networks). This chapter covers on-policy prediction: estimating vπ using stochastic gradient descent on a mean-squared value error objective.",
    keyPoints: [
      "State aggregation and tile coding: simple forms of function approximation for large discrete or continuous spaces.",
      "VE(w) = Σₛ μ(s) [vπ(s) - v̂(s,w)]². The objective: minimize weighted value error.",
      "Semi-gradient TD: update w in the direction of the TD error times the gradient of v̂. Ignores second-order effect.",
      "Linear function approximation: v̂(s,w) = wᵀx(s). The feature vector x(s) determines what can be represented.",
      "Tile coding: overlapping tilings partition the space — effective for continuous state spaces.",
      "Convergence: semi-gradient TD with linear approximation converges to the 'TD fixed point', not the true minimum of VE.",
    ],
    concepts: [
      { name: "Value Function Approximation", desc: "Represent v̂(s,w) with parameters w ∈ ℝⁿ. Gradient descent: w ← w + α[vπ(s) - v̂(s,w)]∇v̂(s,w). Must generalize from seen to unseen states." },
      { name: "Semi-gradient TD(0)", desc: "w ← w + α δₜ ∇v̂(Sₜ,w), where δₜ = Rₜ₊₁ + γv̂(Sₜ₊₁,w) - v̂(Sₜ,w). 'Semi-gradient' because the bootstrap target also depends on w." },
      { name: "Feature Vectors", desc: "x(s) ∈ ℝⁿ encodes state s. Linear FA: v̂(s,w) = wᵀx(s). The feature design is critical: polynomial, Fourier, radial basis, tile coding, etc." },
      { name: "Tile Coding", desc: "Multiple overlapping tilings (grids) of the state space. Each tile is a binary feature. Very effective for continuous spaces, computationally efficient." },
      { name: "On-policy Distribution μ(s)", desc: "The weighting in VE reflects how often states are visited under policy π. We care more about accurate values for frequently visited states." },
    ],
    formulas: [
      { label: "Mean-Squared Value Error", expr: "$$\\overline{VE}(\\mathbf{w}) = \\sum_{s\\in\\mathcal{S}} \\mu(s)\\bigl[v_\\pi(s) - \\hat{v}(s,\\mathbf{w})\\bigr]^2$$", name: "Objective: weighted squared error between true and approximate value" },
      { label: "Gradient MC Update", expr: "$$\\mathbf{w} \\leftarrow \\mathbf{w} + \\alpha\\bigl[G_t - \\hat{v}(S_t,\\mathbf{w})\\bigr]\\nabla\\hat{v}(S_t,\\mathbf{w})$$", name: "True gradient descent; $G_t$ is actual return (unbiased)" },
      { label: "Semi-gradient TD(0) Update", expr: "$$\\mathbf{w} \\leftarrow \\mathbf{w} + \\alpha\\bigl[R_{t+1} + \\gamma\\hat{v}(S_{t+1},\\mathbf{w}) - \\hat{v}(S_t,\\mathbf{w})\\bigr]\\nabla\\hat{v}(S_t,\\mathbf{w})$$", name: "Semi-gradient: bootstrap target also depends on $\\mathbf{w}$" },
    ],
    quiz: [
      {
        q: "Why is function approximation necessary for large state spaces?",
        options: [
          "Tabular methods require knowing the full model",
          "Tabular methods require one value per state — infeasible when states number in millions or are continuous",
          "Function approximation is always more accurate",
          "Tabular methods cannot handle discounting"
        ],
        correct: 1,
        explanation: "A tabular method stores and updates one value per state. For continuous state spaces or large discrete ones (e.g., board game positions), this is impossible. Function approximation generalizes: parameters w encode a compact representation that interpolates between seen states."
      },
      {
        q: "Semi-gradient TD(0) is called 'semi-gradient' because:",
        options: [
          "It uses a partial step-size",
          "The gradient is only taken w.r.t. the estimated value v̂(Sₜ,w), ignoring that the TD target also depends on w",
          "It combines gradient MC and TD updates",
          "It uses a second-order gradient"
        ],
        correct: 1,
        explanation: "A true gradient of the TD error w.r.t. w would include the gradient through the target Rₜ₊₁ + γv̂(Sₜ₊₁,w). Semi-gradient treats the target as fixed, differentiating only through the prediction v̂(Sₜ,w)."
      },
      {
        q: "The TD fixed point (w_TD) is:",
        options: [
          "The point where VE is minimized",
          "The weight vector where semi-gradient TD(0) converges — not the VE minimum, but is within a bounded factor",
          "The optimal value function parameters",
          "The point where the Bellman error is zero"
        ],
        correct: 1,
        explanation: "Semi-gradient TD converges to w_TD where the expected TD update is zero. This minimizes a different objective than VE, but for linear FA the error at w_TD is bounded: VE(w_TD) ≤ (1/(1-γ)) min_w VE(w)."
      },
    ]
  },

  {
    id: 10, part: "Part II: Approximate Solution Methods",
    title: "On-policy Control with Approximation",
    subtitle: "Action-value approximation and semi-gradient SARSA",
    summary: "Extending function approximation to control: approximate the action-value function q̂(s,a,w) and apply semi-gradient SARSA or other TD control methods. The challenge is ensuring continued exploration while approximating with generalization.",
    keyPoints: [
      "Approximate Q: q̂(s,a,w) with parameters w. Either one output per action (discrete) or input (s,a) → Q.",
      "Semi-gradient SARSA: w ← w + α[R + γq̂(S',A',w) - q̂(S,A,w)]∇q̂(S,A,w).",
      "Episodic semi-gradient n-step SARSA extends to n-step returns.",
      "Average reward formulation for continuing tasks: replace discounting with steady-state average reward r̄.",
      "Mountain Car example: continuous state space, sparse reward. Tile coding makes it tractable.",
      "Control with approximation can diverge — the deadly triad applies here.",
    ],
    concepts: [
      { name: "Semi-gradient SARSA", desc: "Like tabular SARSA but uses function approximation. Update: w ← w + α δ ∇q̂(Sₜ,Aₜ,w), where δ = Rₜ₊₁ + γq̂(Sₜ₊₁,Aₜ₊₁,w) - q̂(Sₜ,Aₜ,w)." },
      { name: "Average Reward", desc: "For continuing tasks: maximize long-run average reward r̄ = lim Σ E[Rₜ]/t. Differential return: Gₜ = Σ(Rₜ₊ₖ - r̄). Useful when γ=1 is desired." },
      { name: "Access Control Queuing", desc: "Classic continuing control example: server allocates resources to arriving customers with different priorities. Solved with differential semi-gradient SARSA." },
    ],
    formulas: [
      { label: "Semi-gradient SARSA", expr: "$$\\mathbf{w} \\leftarrow \\mathbf{w} + \\alpha\\bigl[R_{t+1} + \\gamma\\hat{q}(S_{t+1},A_{t+1},\\mathbf{w}) - \\hat{q}(S_t,A_t,\\mathbf{w})\\bigr]\\nabla\\hat{q}(S_t,A_t,\\mathbf{w})$$", name: "On-policy approximation control" },
      { label: "Average Reward Update", expr: "$$\\mathbf{w} \\leftarrow \\mathbf{w} + \\alpha\\bigl[R_{t+1} - \\bar{r} + \\hat{q}(S_{t+1},A_{t+1},\\mathbf{w}) - \\hat{q}(S_t,A_t,\\mathbf{w})\\bigr]\\nabla\\hat{q}(S_t,A_t,\\mathbf{w})$$", name: "No discounting; $\\bar{r}$ is running estimate of average reward" },
    ],
    quiz: [
      {
        q: "In the Mountain Car problem, why is tile coding more effective than a single tiling?",
        options: [
          "Multiple tilings provide multiple overlapping encodings, enabling smoother generalization across the continuous state space",
          "Single tiling causes divergence",
          "Tile coding reduces the number of parameters",
          "Multiple tilings allow off-policy learning"
        ],
        correct: 0,
        explanation: "With multiple tilings, each state activates one tile per tiling. The combination of active tiles provides a rich, position-sensitive feature vector. Generalization is controlled: nearby states share some but not all active tiles."
      },
    ]
  },

  {
    id: 11, part: "Part II: Approximate Solution Methods",
    title: "Off-policy Methods with Approximation",
    subtitle: "The deadly triad and its solutions",
    summary: "Off-policy learning with function approximation is notoriously difficult. The combination of bootstrapping, function approximation, and off-policy data (the 'deadly triad') can cause divergence. This chapter examines why and explores solutions including gradient TD methods.",
    keyPoints: [
      "The Deadly Triad: function approximation + bootstrapping + off-policy training → potential divergence.",
      "Baird's counterexample shows Q-learning with linear FA and off-policy data can diverge.",
      "Importance sampling extends to function approximation but still has high variance.",
      "Gradient TD methods (GTD2, TDC): true gradient methods that converge off-policy.",
      "Emphatic TD: down-weight off-policy updates by followness — provably convergent.",
      "Semi-gradient methods are stable on-policy but can diverge off-policy.",
    ],
    concepts: [
      { name: "Deadly Triad", desc: "Any two of the three can work together: (1) FA without bootstrapping (MC with FA) — fine. (2) Bootstrapping without off-policy (on-policy TD with FA) — fine. (3) Off-policy without FA (tabular Q-learning) — fine. But all three together: instability." },
      { name: "Gradient TD (TDC)", desc: "True stochastic gradient descent on the mean-squared projected Bellman error (MSPBE). Two sets of weights: one for the value function, one for correcting the off-policy distribution. Convergent." },
      { name: "Importance Sampling in FA", desc: "Weight each update by ρₜ = π(Aₜ|Sₜ)/b(Aₜ|Sₜ). Still high variance but maintains convergence guarantees." },
    ],
    formulas: [
      { label: "MSPBE (objective for gradient TD)", expr: "$$\\overline{\\text{MSPBE}}(\\mathbf{w}) = \\left\\|\\hat{v}_\\mathbf{w} - \\Pi B\\hat{v}_\\mathbf{w}\\right\\|_\\mu^2$$", name: "Projected Bellman error: minimize distance from projected Bellman target" },
    ],
    quiz: [
      {
        q: "What makes the deadly triad dangerous?",
        options: [
          "It makes learning too slow",
          "Combining bootstrapping + function approximation + off-policy training can cause the value function to diverge to infinity",
          "It requires too much memory",
          "It prevents exploration"
        ],
        correct: 1,
        explanation: "In Baird's counterexample, a simple linear function approximator with semi-gradient Q-learning on off-policy data has all value estimates diverge to infinity — despite simple, well-behaved environments. This shows the instability is fundamental, not incidental."
      },
    ]
  },

  {
    id: 12, part: "Part II: Approximate Solution Methods",
    title: "Eligibility Traces",
    subtitle: "TD(λ) and the unification of TD and MC",
    summary: "Eligibility traces are a powerful mechanism for bridging n-step TD methods and MC. The trace vector e ∈ ℝⁿ tracks how recently and frequently features were active, allowing credit to be assigned efficiently backward through time.",
    keyPoints: [
      "Eligibility trace e_t tracks recent feature activations: eₜ = γλeₜ₋₁ + ∇v̂(Sₜ,w).",
      "TD(λ): uses eligibility trace to assign TD errors backward through time.",
      "λ=0: TD(0). λ=1 (offline): equivalent to MC. λ in between interpolates.",
      "Forward view (λ-return) and backward view (eligibility traces) are equivalent offline.",
      "True online TD(λ): online forward-view equivalent with eligibility traces.",
      "Accumulating vs replacing traces: different behaviors when feature is active twice.",
    ],
    concepts: [
      { name: "Eligibility Trace Vector", desc: "eₜ = γλeₜ₋₁ + ∇v̂(Sₜ,w). Features that were active recently (and often) get credit. Acts as a 'memory' for credit assignment." },
      { name: "TD(λ) Update", desc: "w ← w + α δₜ eₜ, where δₜ is TD error and eₜ is trace. Updates all recently active features, not just the current one." },
      { name: "Forward vs Backward View", desc: "Forward view: define target as λ-return Gₜ^λ. Backward view: use eligibility traces. Both are equivalent for offline updates, but traces are online and computationally efficient." },
    ],
    formulas: [
      { label: "Eligibility Trace Update", expr: "$$\\mathbf{e}_t = \\gamma\\lambda\\,\\mathbf{e}_{t-1} + \\nabla\\hat{v}(S_t,\\mathbf{w}) \\quad\\text{(accumulating traces)}$$", name: "Traces decay by $\\gamma\\lambda$ each step, spiking at active features" },
      { label: "TD($\\lambda$) Weight Update", expr: "$$\\mathbf{w} \\leftarrow \\mathbf{w} + \\alpha\\,\\delta_t\\,\\mathbf{e}_t$$", name: "Multiply TD error by trace — credit assignment over time" },
    ],
    quiz: [
      {
        q: "What does λ=0 correspond to in TD(λ)?",
        options: ["Monte Carlo", "TD(0) — one-step bootstrapped update only", "Full-return update", "No learning"],
        correct: 1,
        explanation: "With λ=0, the eligibility trace eₜ = ∇v̂(Sₜ,w) with no memory of previous states. The update w ← w + α δₜ eₜ is exactly the semi-gradient TD(0) update."
      },
      {
        q: "Why are eligibility traces more computationally efficient than computing the λ-return directly?",
        options: [
          "They require less memory",
          "They update online in O(n) per step (n=features), without needing to store entire episode trajectories",
          "They use lower precision arithmetic",
          "They avoid the need for bootstrapping"
        ],
        correct: 1,
        explanation: "The λ-return requires the full episode to be available (offline). Eligibility traces implement the same update online: each step is O(n) in the number of parameters, and no trajectory storage is needed beyond the current trace vector."
      },
    ]
  },

  {
    id: 13, part: "Part II: Approximate Solution Methods",
    title: "Policy Gradient Methods",
    subtitle: "Directly parameterizing and optimizing the policy",
    summary: "Policy gradient methods directly parameterize the policy π(a|s,θ) and optimize parameters θ by gradient ascent on expected return J(θ). Unlike value-based methods, they can naturally handle continuous action spaces and learn stochastic policies.",
    keyPoints: [
      "Parameterize policy π(a|s,θ) directly. Optimize J(θ) = vπ(s₀) via gradient ascent.",
      "Policy Gradient Theorem: ∇J(θ) = Σₛ d(s) Σₐ q(s,a) ∇π(a|s,θ). Actionable gradient formula.",
      "REINFORCE: Monte Carlo policy gradient. High variance but unbiased.",
      "Baseline: subtract a state-dependent baseline b(s) from returns to reduce variance without bias.",
      "Actor-Critic: use a parameterized value function (critic) as baseline. More stable than REINFORCE.",
      "Advantage: Aπ(s,a) = qπ(s,a) - vπ(s). Actor-Critic updates use advantage estimate δ.",
    ],
    concepts: [
      { name: "Policy Parameterization", desc: "Softmax: π(a|s,θ) = e^h(s,a,θ) / Σᵦ e^h(s,b,θ). For continuous: Gaussian π(a|s,θ) = N(μ(s,θ), σ²). Can represent any stochastic policy." },
      { name: "REINFORCE", desc: "θ ← θ + α Gₜ ∇ln π(Aₜ|Sₜ,θ). Uses full episode return Gₜ. Unbiased but high variance. The log probability gradient (score function) is key." },
      { name: "Policy Gradient Theorem", desc: "∇J(θ) ∝ Σₛ μ(s) Σₐ qπ(s,a) ∇π(a|s,θ). Eliminates the need to differentiate the state distribution — a crucial insight making policy gradient practical." },
      { name: "Actor-Critic", desc: "Two networks: Actor (policy π(a|s,θ)) and Critic (value v̂(s,w)). Actor updates via policy gradient using critic's TD error as advantage estimate. Online, step-by-step updates." },
      { name: "Advantage Function", desc: "Aπ(s,a) = qπ(s,a) - vπ(s). Using advantages instead of Q values reduces variance: we care about how much better a is than average, not its absolute value." },
    ],
    formulas: [
      { label: "REINFORCE Update", expr: "$$\\boldsymbol{\\theta} \\leftarrow \\boldsymbol{\\theta} + \\alpha G_t\\,\\nabla\\ln\\pi(A_t|S_t,\\boldsymbol{\\theta})$$", name: "MC policy gradient; $G_t$ = full episode return from step $t$" },
      { label: "REINFORCE with Baseline", expr: "$$\\boldsymbol{\\theta} \\leftarrow \\boldsymbol{\\theta} + \\alpha\\bigl(G_t - b(S_t)\\bigr)\\nabla\\ln\\pi(A_t|S_t,\\boldsymbol{\\theta})$$", name: "Baseline $b(s)$ reduces variance; any function of $s$ is valid (zero expected gradient)" },
      { label: "Actor-Critic (One-step)", expr: "$$\\boldsymbol{\\theta} \\leftarrow \\boldsymbol{\\theta} + \\alpha\\,\\delta_t\\,\\nabla\\ln\\pi(A_t|S_t,\\boldsymbol{\\theta}), \\quad \\delta_t = R_{t+1} + \\gamma\\hat{v}(S_{t+1},\\mathbf{w}) - \\hat{v}(S_t,\\mathbf{w})$$", name: "TD error $\\delta_t$ used as advantage estimate for the actor" },
      { label: "Policy Gradient Theorem", expr: "$$\\nabla J(\\boldsymbol{\\theta}) \\propto \\sum_s \\mu(s)\\sum_a q_\\pi(s,a)\\,\\nabla\\pi(a|s,\\boldsymbol{\\theta}) = \\mathbb{E}_\\pi\\!\\left[q_\\pi(S_t,A_t)\\,\\nabla\\ln\\pi(A_t|S_t,\\boldsymbol{\\theta})\\right]$$", name: "Avoids differentiating the state distribution $d(s)$ w.r.t. $\\boldsymbol{\\theta}$" },
    ],
    quiz: [
      {
        q: "What is the key advantage of policy gradient methods over value-based methods?",
        options: [
          "They converge faster in all cases",
          "They can represent any stochastic policy and handle continuous action spaces naturally",
          "They don't require a reward signal",
          "They avoid function approximation"
        ],
        correct: 1,
        explanation: "Value-based methods (DQN etc.) require argmax over actions — infeasible for continuous actions. Policy gradient directly represents the action distribution π(a|s,θ) and can output continuous actions via e.g. Gaussian policies."
      },
      {
        q: "Why does subtracting a baseline b(Sₜ) from the return reduce variance without introducing bias?",
        options: [
          "The baseline adjusts the learning rate",
          "Because 𝔼π[b(Sₜ)∇ln π(Aₜ|Sₜ,θ)] = 0 for any b(s) — the baseline doesn't change the expected gradient",
          "The baseline reduces the magnitude of updates",
          "Baselines introduce a regularization term"
        ],
        correct: 1,
        explanation: "𝔼π[b(Sₜ)∇ln π(Aₜ|Sₜ,θ)] = b(Sₜ)·Σₐ ∇π(a|Sₜ,θ) = b(Sₜ)·∇(1) = 0. Any state-dependent baseline has zero expected gradient — so it doesn't change the true gradient estimate but can dramatically reduce its variance."
      },
      {
        q: "In Actor-Critic methods, what role does the Critic play?",
        options: [
          "The Critic selects actions",
          "The Critic estimates the value function, providing a bootstrap target (TD error) as advantage estimate for actor updates",
          "The Critic computes the policy gradient directly",
          "The Critic manages the replay buffer"
        ],
        correct: 1,
        explanation: "The Critic learns v̂(s,w) and provides δₜ = Rₜ₊₁ + γv̂(Sₜ₊₁,w) - v̂(Sₜ,w) as an advantage estimate. This allows online (step-by-step) actor updates rather than waiting for the full episode return."
      },
      {
        q: "The Policy Gradient Theorem is important because:",
        options: [
          "It shows policy gradients always converge",
          "It provides a formula for ∇J(θ) that doesn't require differentiating through the state distribution d(s)",
          "It proves that Actor-Critic is better than REINFORCE",
          "It shows discounting is unnecessary"
        ],
        correct: 1,
        explanation: "∇J(θ) depends on both π and d(s) (state distribution under π). Differentiating d(s) w.r.t. θ seems intractable. The PG theorem shows ∇J(θ) ∝ Σₛ d(s) Σₐ qπ(s,a)∇π(a|s,θ) — the gradient of d(s) term vanishes!"
      },
    ]
  },

  // ── PART III: LOOKING DEEPER ──────────────────────────────────────────────
  {
    id: 14, part: "Part III: Looking Deeper",
    title: "Psychology",
    subtitle: "Animal learning and RL connections",
    summary: "Reinforcement learning has deep connections to animal learning theory developed over a century of psychology research. Classical and instrumental conditioning share formal structure with RL. This chapter examines these parallels and what each field can learn from the other.",
    keyPoints: [
      "Classical (Pavlovian) conditioning: CS-US pairing. TD learning models this with surprising accuracy.",
      "Temporal difference model of Pavlovian conditioning explains second-order conditioning and blocking.",
      "Instrumental conditioning: behavior shaped by consequences (rewards/punishments). Maps to RL control.",
      "Blocking (Kamin effect): CS-B doesn't get conditioned if CS-A already predicts the US. TD predicts this.",
      "Dopamine neurons fire in proportion to TD prediction errors — a remarkable biological match.",
      "Habitual vs. goal-directed behavior: model-free (habits) vs. model-based (goal-directed) distinction.",
    ],
    concepts: [
      { name: "Classical Conditioning", desc: "Pavlov: ring bell (CS) before food (US) → dog salivates to bell alone. TD model: V(CS) updated when US is encountered, just like Bellman updates." },
      { name: "Blocking", desc: "Pre-train A→US. Then train AB→US. B doesn't get conditioned. TD explanation: A already predicts US, so no prediction error when B is added. δ ≈ 0, so B gets no credit." },
      { name: "Dopamine & TD Error", desc: "Schultz et al. (1997): dopamine neurons fire like δₜ. Before conditioning: fire at reward. After conditioning: fire at CS (reward predictor). If reward omitted: dip below baseline at expected time." },
    ],
    quiz: [
      {
        q: "The Blocking effect in classical conditioning is explained by TD models because:",
        options: [
          "Blocking involves continuous actions",
          "When stimulus A already predicts the reward, the TD prediction error δ ≈ 0 when B is present — so B receives no credit",
          "Blocking requires multiple reward signals",
          "TD models cannot explain blocking"
        ],
        correct: 1,
        explanation: "After A is trained to predict US, V(A) ≈ R. When AB is presented together, the prediction is already correct due to A, so δₜ ≈ 0 at the time of US. No prediction error means no learning about B — matching the biological blocking effect."
      },
    ]
  },

  {
    id: 15, part: "Part III: Looking Deeper",
    title: "Neuroscience",
    subtitle: "RL in the brain",
    summary: "RL algorithms have striking parallels with neural circuits in the brain, particularly in the basal ganglia and dopaminergic system. This chapter examines how RL theory illuminates neural mechanisms of reward-based learning, decision-making, and addiction.",
    keyPoints: [
      "Dopamine neurons in the VTA/SNc signal reward prediction errors — matching TD error δₜ.",
      "Basal ganglia: actor-critic architecture. Striatum = actor (policy). Substantia nigra feedback = critic signal.",
      "Prefrontal cortex maintains state representations and enables model-based (goal-directed) planning.",
      "Addiction: hijacking of the reward prediction error signal; overestimation of drug-related reward.",
      "Hedonics vs. wanting: dopamine signals 'wanting' (incentive salience), not 'liking' (subjective pleasure).",
      "Neural correlates of model-based vs model-free: distinct systems with competitive interaction.",
    ],
    concepts: [
      { name: "Dopamine as TD Error", desc: "Dopamine neurons respond to unpredicted rewards (δ > 0), suppress activity for omitted predicted rewards (δ < 0), and shift firing to reward-predicting stimuli after conditioning — exactly matching TD error dynamics." },
      { name: "Basal Ganglia Actor-Critic", desc: "Dorsal striatum (caudate/putamen): actor. Ventral striatum (nucleus accumbens): critic value. Dopamine from SNc/VTA: critic signal to actor. Prefrontal: state representation." },
      { name: "Model-free vs Model-based", desc: "Habitual (model-free, S→A associations) and goal-directed (model-based, explicit world model) systems compete. Lesion studies and fMRI support this distinction in humans." },
    ],
    quiz: [
      {
        q: "Why do dopamine neurons stop firing at reward after conditioning and start firing at the CS?",
        options: [
          "Dopamine neurons move closer to sensory cortex",
          "After learning, the reward is predicted by the CS, so TD error δ transfers to the CS onset; no error at actual reward time",
          "Dopamine neurons habituate to repeated rewards",
          "The US becomes a CS for later stimuli"
        ],
        correct: 1,
        explanation: "In TD learning, once V(CS) correctly predicts the reward, the prediction error at reward time is δ ≈ 0 (no surprise). The error shifts earlier — to the CS onset where prediction first changes. Dopamine neurons mirror this shift exactly."
      },
    ]
  },

  {
    id: 16, part: "Part III: Looking Deeper",
    title: "Applications and Case Studies",
    subtitle: "RL solving real-world problems",
    summary: "This chapter surveys landmark RL applications: TD-Gammon (backgammon), Samuel's checker player, Watson's Jeopardy approach, AlphaGo, and industrial control applications. Each case study highlights key design decisions.",
    keyPoints: [
      "TD-Gammon (Tesauro, 1995): neural network + TD learning → world-class backgammon. Early deep RL success.",
      "Samuel's Checker Player (1959): one of the earliest RL systems, featuring temporal difference learning before the term existed.",
      "AlphaGo: Monte Carlo Tree Search + deep neural networks + self-play. Beat the world champion.",
      "Watson/Jeopardy: natural language + information retrieval + RL for answer confidence.",
      "Elevator dispatching, chemical process control, helicopter acrobatics: industrial RL success stories.",
      "Key design decisions: state representation, reward shaping, exploration strategy, sample efficiency.",
    ],
    concepts: [
      { name: "TD-Gammon", desc: "Tesauro trained a multi-layer NN with TD(λ) and self-play on backgammon. No prior knowledge except rules. Reached top human-level play. Demonstrated neural net + TD can work at scale." },
      { name: "AlphaGo / AlphaZero", desc: "Policy network + value network trained via supervised learning (AlphaGo) or pure self-play (AlphaZero). MCTS guided by neural network. AlphaZero generalized to chess and shogi." },
      { name: "Reward Shaping", desc: "Adding auxiliary rewards to guide learning (e.g., intermediate game rewards). Must be done carefully to avoid introducing incorrect optima." },
    ],
    quiz: [
      {
        q: "What made TD-Gammon historically significant?",
        options: [
          "It was the first computer program to play a board game",
          "It demonstrated that TD learning with a neural network and self-play could reach expert-level performance in a complex game without human knowledge",
          "It used deep convolutional networks",
          "It solved the credit assignment problem completely"
        ],
        correct: 1,
        explanation: "TD-Gammon (1992-1995) trained purely from self-play using TD(λ) with a feedforward neural network. It reached near-expert human performance in backgammon — demonstrating TD + neural networks could work on complex tasks before the 'deep RL' era."
      },
    ]
  },

  {
    id: 17, part: "Part III: Looking Deeper",
    title: "Frontiers",
    subtitle: "Open problems and future directions",
    summary: "The final chapter surveys the frontier of reinforcement learning research: general value functions (GVFs), options framework for temporal abstraction, intrinsic motivation, multi-agent RL, and the grand challenge of general AI through RL.",
    keyPoints: [
      "General Value Functions (GVFs): cumulant signals and discount functions for any prediction target. World models.",
      "Options and temporal abstraction: macro-actions (options) allow planning at multiple timescales.",
      "Hierarchy: HRL decomposes complex tasks into subgoals and subtask policies.",
      "Intrinsic motivation: curiosity, count-based exploration, empowerment as internal reward signals.",
      "Multi-agent RL: non-stationarity, cooperation vs competition, equilibrium concepts.",
      "Model-based RL at scale: learning world models (Dreamer, MuZero) for sample efficiency.",
      "The central goal: artificial general intelligence via RL with rich sensory input.",
    ],
    concepts: [
      { name: "Options Framework", desc: "An option o = (Iₒ, π_o, β_o): initiation set, option policy, termination condition. Semi-Markov decision process. Enables hierarchical RL and reusable subtask skills." },
      { name: "GVFs (General Value Functions)", desc: "vπ(s) with arbitrary pseudo-reward cumulant c(s,a,s') and discount γ(s,a,s'). Any prediction expressible as an expected discounted sum. Foundation for predictive world models." },
      { name: "Intrinsic Motivation", desc: "Internal reward for exploration: curiosity (prediction error of world model), novelty (visit counts), empowerment (mutual info between actions and states). Enables exploration without external reward." },
    ],
    quiz: [
      {
        q: "In the Options framework, what is a termination condition β_o(s)?",
        options: [
          "The maximum number of steps an option can run",
          "The probability of terminating the option in state s, allowing flexible-length sub-tasks",
          "The state where the option begins",
          "The discount factor for the option's policy"
        ],
        correct: 1,
        explanation: "β_o(s) ∈ [0,1] is the probability that option o terminates when the agent reaches state s. This stochastic termination allows options of variable length — a key feature of the Options framework that enables temporal abstraction."
      },
      {
        q: "Why is intrinsic motivation important for RL agents in sparse-reward environments?",
        options: [
          "It replaces the need for extrinsic reward entirely",
          "It provides a dense internal reward signal that drives exploration when external rewards are rare or absent",
          "It ensures the agent learns the optimal policy faster",
          "It makes the reward function convex"
        ],
        correct: 1,
        explanation: "In sparse-reward environments, the agent may go thousands of steps without any external reward signal, leaving no gradient to follow. Intrinsic rewards (curiosity, novelty bonuses) provide internal signals that encourage systematic exploration of the state space."
      },
    ]
  },
];
