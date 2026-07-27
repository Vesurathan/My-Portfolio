'use client';

import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ModelScene, { type ModelId } from '@/components/ml/ModelScene';

type Model = {
  kind: 'S' | 'U' | 'R';
  subgroup: string;
  id: ModelId;
  name: string;
  belongsTo: string;
  description: string;
  equation: string;
  tags: string[];
};

/** Curated “important” models only — still grouped by Supervised / Unsupervised / RL */
const MODELS: Model[] = [
  {
    kind: 'S',
    subgroup: 'Regression',
    id: 'linear_regression',
    name: 'Linear Regression',
    belongsTo: 'Supervised · Regression',
    description: 'Learns a best‑fit line to predict continuous values.',
    equation: 'ŷ = w · x + b',
    tags: ['MSE loss', 'closed-form', 'interpretable'],
  },
  {
    kind: 'S',
    subgroup: 'Classification',
    id: 'logistic_regression',
    name: 'Logistic Regression',
    belongsTo: 'Supervised · Classification',
    description: 'Models class probability using a sigmoid/softmax decision boundary.',
    equation: 'p = σ(w · x + b)',
    tags: ['log-loss', 'sigmoid', 'probabilistic'],
  },
  {
    kind: 'S',
    subgroup: 'Classification',
    id: 'svm',
    name: 'Support Vector Machine (SVM)',
    belongsTo: 'Supervised · Classification',
    description: 'Finds a maximum‑margin separating hyperplane (kernelizable).',
    equation: 'min ½‖w‖²  s.t. yᵢ(w·xᵢ+b) ≥ 1',
    tags: ['max-margin', 'kernels', 'support vectors'],
  },
  {
    kind: 'S',
    subgroup: 'Classification/Regression',
    id: 'knn',
    name: 'K‑Nearest Neighbors (KNN)',
    belongsTo: 'Supervised · Classification/Regression',
    description: 'Predicts from the labels/values of the nearest points in feature space.',
    equation: 'ŷ = vote{ y : x ∈ Nₖ(x) }',
    tags: ['lazy', 'distance', 'non-parametric'],
  },
  {
    kind: 'S',
    subgroup: 'Tree‑based',
    id: 'decision_tree',
    name: 'Decision Tree',
    belongsTo: 'Supervised · Tree‑based',
    description: 'Learns hierarchical if‑then splits to predict class or value.',
    equation: 'split → max information gain',
    tags: ['Gini / entropy', 'if-then', 'interpretable'],
  },
  {
    kind: 'S',
    subgroup: 'Ensembles',
    id: 'random_forest',
    name: 'Random Forest',
    belongsTo: 'Supervised · Ensemble',
    description: 'Bagging ensemble of trees; reduces variance and improves robustness.',
    equation: 'ŷ = mode(T₁ … T_B)',
    tags: ['bagging', 'low variance', 'robust'],
  },
  {
    kind: 'S',
    subgroup: 'Ensembles',
    id: 'gradient_boosting',
    name: 'Gradient Boosting',
    belongsTo: 'Supervised · Ensemble',
    description: 'Builds learners sequentially to correct errors (e.g. XGBoost/LightGBM style).',
    equation: 'Fₘ = Fₘ₋₁ + ν · hₘ',
    tags: ['sequential', 'residual fit', 'XGBoost'],
  },
  {
    kind: 'S',
    subgroup: 'Neural Networks',
    id: 'mlp',
    name: 'MLP (Neural Network)',
    belongsTo: 'Supervised · Neural Network',
    description: 'Learns non‑linear mappings using layered neurons and backpropagation.',
    equation: 'a⁽ˡ⁾ = σ(W a⁽ˡ⁻¹⁾ + b)',
    tags: ['backprop', 'ReLU', 'universal'],
  },
  {
    kind: 'U',
    subgroup: 'Clustering',
    id: 'kmeans',
    name: 'K‑Means',
    belongsTo: 'Unsupervised · Clustering',
    description: 'Partitions data into k clusters by iteratively updating centroids.',
    equation: 'argmin Σ ‖x − μₖ‖²',
    tags: ["Lloyd's algo", 'k chosen', 'fast'],
  },
  {
    kind: 'U',
    subgroup: 'Clustering',
    id: 'dbscan',
    name: 'DBSCAN',
    belongsTo: 'Unsupervised · Density‑based Clustering',
    description: 'Finds dense regions and marks sparse points as noise/outliers.',
    equation: 'core: |Nε(p)| ≥ minPts',
    tags: ['density', 'finds noise', 'no k'],
  },
  {
    kind: 'U',
    subgroup: 'Dimensionality Reduction',
    id: 'pca',
    name: 'PCA',
    belongsTo: 'Unsupervised · Dimensionality Reduction',
    description: 'Projects data onto principal components maximizing variance.',
    equation: 'max Var(Xw),  ‖w‖ = 1',
    tags: ['eigenvectors', 'variance', 'linear'],
  },
  {
    kind: 'U',
    subgroup: 'Dimensionality Reduction',
    id: 'tsne',
    name: 't‑SNE',
    belongsTo: 'Unsupervised · Dimensionality Reduction',
    description: 'Visualizes high‑dimensional data by preserving local neighborhoods.',
    equation: 'min KL(P ‖ Q)',
    tags: ['local structure', 'non-linear', 'viz'],
  },
  {
    kind: 'R',
    subgroup: 'Value‑Based',
    id: 'q_learning',
    name: 'Q‑Learning',
    belongsTo: 'Reinforcement · Value‑Based',
    description: 'Learns state‑action values to choose actions that maximize reward.',
    equation: 'Q ← Q + α[ r + γ·maxQ′ − Q ]',
    tags: ['off-policy', 'value-based', 'tabular'],
  },
  {
    kind: 'R',
    subgroup: 'Deep RL',
    id: 'dqn',
    name: 'DQN',
    belongsTo: 'Reinforcement · Deep RL',
    description: 'Approximates Q‑values with a neural network for high‑dim inputs.',
    equation: 'L = ( r + γ·maxQ(s′;θ⁻) − Q(s,a;θ) )²',
    tags: ['deep RL', 'replay', 'target net'],
  },
  {
    kind: 'R',
    subgroup: 'Actor‑Critic',
    id: 'ppo',
    name: 'PPO',
    belongsTo: 'Reinforcement · Actor‑Critic',
    description: 'Stabilizes policy updates using a clipped objective (widely used in practice).',
    equation: 'max E[ min(rₜAₜ, clip(rₜ)·Aₜ) ]',
    tags: ['on-policy', 'clipped', 'stable'],
  },
];

function CategoryPill({ kind }: { kind: 'S' | 'U' | 'R' }) {
  const label =
    kind === 'S'
      ? 'Supervised learning'
      : kind === 'U'
        ? 'Unsupervised learning'
        : 'Reinforcement learning';

  const color =
    kind === 'S'
      ? 'bg-blood/15 border-blood/30 text-blood'
      : kind === 'U'
        ? 'bg-fg/[0.06] border-fg/10 text-fg/75'
        : 'bg-blood-glow/15 border-blood-glow/30 text-blood-glow';

  return (
    <div
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-[0.25em] uppercase ${color}`}
    >
      <span aria-hidden>{kind}</span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

const gridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
} as const;

const faceBase =
  'absolute inset-0 rounded-2xl border border-void-600/80 overflow-hidden [backface-visibility:hidden] [-webkit-backface-visibility:hidden]';

function ModelTile({
  model,
  ariaLabel,
  index,
  reduceMotion,
}: {
  model: Model;
  ariaLabel: string;
  index: number;
  reduceMotion: boolean;
}) {
  const tiltRef = useRef<HTMLDivElement | null>(null);

  const tileTransition = reduceMotion
    ? { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }
    : { type: 'spring' as const, stiffness: 420, damping: 30, mass: 0.85 };

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
    if (!reduceMotion) {
      const rx = (py - 0.5) * -7;
      const ry = (px - 0.5) * 9;
      el.style.setProperty('--rx', `${rx}deg`);
      el.style.setProperty('--ry', `${ry}deg`);
    }
  }
  function reset() {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: reduceMotion ? 12 : 22, scale: reduceMotion ? 1 : 0.97 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { ...tileTransition, delay: index * 0.02 },
        },
      }}
      className="ml-no-text group [perspective:1200px]"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      aria-label={ariaLabel}
    >
      {/* tilt layer */}
      <div
        ref={tiltRef}
        className="relative [transform-style:preserve-3d] transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: 'rotateX(var(--rx,0)) rotateY(var(--ry,0))' }}
      >
        {/* flip layer */}
        <div className="relative min-h-[368px] [transform-style:preserve-3d] transition-transform duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:[transform:rotateY(180deg)]">
          {/* FRONT */}
          <div className={`${faceBase} relative bg-void-950/45 backdrop-blur-md`}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blood/10 blur-[60px]" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-blood-glow/10 blur-[60px]" />
              <div className="absolute inset-0 bg-gradient-to-b from-fg/[0.05] via-transparent to-transparent" />
            </div>
            {/* cursor spotlight */}
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  'radial-gradient(260px circle at var(--mx,50%) var(--my,50%), rgba(255,23,68,0.16), transparent 60%)',
              }}
            />
            <div className="relative p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <CategoryPill kind={model.kind} />
                <div className="h-1.5 w-16 rounded-full bg-fg/[0.06] overflow-hidden border border-fg/10">
                  <motion.div
                    className="h-full w-1/2 bg-gradient-to-r from-transparent via-blood to-transparent"
                    animate={reduceMotion ? undefined : { x: ['-50%', '120%'] }}
                    transition={
                      reduceMotion
                        ? undefined
                        : { duration: 2.2 + index * 0.04, repeat: Infinity, ease: 'linear' }
                    }
                  />
                </div>
              </div>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-base md:text-lg font-bold text-fg leading-tight">
                    {model.name}
                  </h3>
                  <p className="text-xs text-fg/50 tracking-wide">{model.belongsTo}</p>
                </div>
                <motion.div
                  className="shrink-0 w-2.5 h-2.5 rounded-full bg-blood/70 shadow-blood-glow-sm"
                  animate={reduceMotion ? { opacity: 1 } : { opacity: [0.35, 1, 0.35], scale: [1, 1.08, 1] }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 1.8 + (index % 3) * 0.12, repeat: Infinity, ease: 'easeInOut' }
                  }
                  aria-hidden
                />
              </div>
              <p className="text-[11px] text-fg/45 tracking-wide mt-1">{model.subgroup}</p>
              <div className="mt-3">
                <ModelScene id={model.id} />
              </div>
              <span className="absolute bottom-3 right-4 text-[9px] font-mono uppercase tracking-[0.16em] text-fg/30">
                hover ⤿ math
              </span>
            </div>
          </div>

          {/* BACK */}
          <div
            className={`${faceBase} [transform:rotateY(180deg)] p-5 md:p-6 flex flex-col justify-center gap-4`}
            style={{ background: 'linear-gradient(160deg, rgba(26,8,16,0.95), rgba(12,12,12,0.95))' }}
          >
            <CategoryPill kind={model.kind} />
            <div className="border-l-2 border-blood pl-3">
              <p className="font-mono text-sm md:text-[15px] leading-relaxed text-white break-words">
                {model.equation}
              </p>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{model.description}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {model.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono text-white/55 border border-white/15 rounded px-2 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-1 font-display text-sm font-bold text-white/90">{model.name}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GroupHeader({
  title,
  accent,
}: {
  title: string;
  accent: 'blood' | 'neutral' | 'glow';
}) {
  const line =
    accent === 'blood' ? 'from-blood/70' : accent === 'glow' ? 'from-blood-glow/70' : 'from-fg/25';
  const dot =
    accent === 'blood' ? 'bg-blood/80' : accent === 'glow' ? 'bg-blood-glow/80' : 'bg-fg/35';

  return (
    <motion.div
      className="flex items-center gap-4 mb-6"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className={`h-px w-10 bg-gradient-to-r ${line} to-transparent`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left center' }}
      />
      <motion.div
        className={`w-2 h-2 rounded-full ${dot}`}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.12, type: 'spring', stiffness: 400, damping: 22 }}
      />
      <h2 className="font-display text-xl md:text-2xl font-bold text-fg tracking-tight">{title}</h2>
      <motion.div
        className="flex-1 h-px bg-gradient-to-r from-fg/10 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        style={{ transformOrigin: 'left center' }}
      />
    </motion.div>
  );
}

function ModelGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
      variants={gridContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-32px' }}
    >
      {children}
    </motion.div>
  );
}

export default function MLGallery() {
  const supervised = MODELS.filter((m) => m.kind === 'S');
  const unsupervised = MODELS.filter((m) => m.kind === 'U');
  const reinforcement = MODELS.filter((m) => m.kind === 'R');
  const reduceMotion = useReducedMotion();
  const rm = Boolean(reduceMotion);

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        <div className="flex items-baseline gap-3 mb-8">
          <span className="font-display text-xl font-bold text-blood tabular-nums">03</span>
          <h2 className="font-display text-xl md:text-2xl font-bold text-fg tracking-tight">
            The catalogue
          </h2>
          <span className="hidden sm:inline text-[11px] font-medium text-fg/40 tracking-wide">
            — tilt · spotlight · flip for the math
          </span>
        </div>

        <div className="space-y-14 md:space-y-16">
          <div>
            <GroupHeader title="Supervised" accent="blood" />
            <ModelGrid>
              {supervised.map((m, i) => (
                <ModelTile key={`${m.kind}-${m.id}`} index={i} reduceMotion={rm} model={m} ariaLabel={`${m.belongsTo}: ${m.name}`} />
              ))}
            </ModelGrid>
          </div>

          <div>
            <GroupHeader title="Unsupervised" accent="neutral" />
            <ModelGrid>
              {unsupervised.map((m, i) => (
                <ModelTile key={`${m.kind}-${m.id}`} index={i} reduceMotion={rm} model={m} ariaLabel={`${m.belongsTo}: ${m.name}`} />
              ))}
            </ModelGrid>
          </div>

          <div>
            <GroupHeader title="Reinforcement" accent="glow" />
            <ModelGrid>
              {reinforcement.map((m, i) => (
                <ModelTile key={`${m.kind}-${m.id}`} index={i} reduceMotion={rm} model={m} ariaLabel={`${m.belongsTo}: ${m.name}`} />
              ))}
            </ModelGrid>
          </div>
        </div>
      </div>
    </section>
  );
}
