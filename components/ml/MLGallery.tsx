'use client';

import { motion, useReducedMotion } from 'framer-motion';
import GlassFrame from '@/components/ml/GlassFrame';
import ModelScene, { type ModelId } from '@/components/ml/ModelScene';

type Model = {
  kind: 'S' | 'U' | 'R';
  subgroup: string;
  id: ModelId;
  name: string;
  belongsTo: string;
  description: string;
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
  },
  {
    kind: 'S',
    subgroup: 'Classification',
    id: 'logistic_regression',
    name: 'Logistic Regression',
    belongsTo: 'Supervised · Classification',
    description: 'Models class probability using a sigmoid/softmax decision boundary.',
  },
  {
    kind: 'S',
    subgroup: 'Classification',
    id: 'svm',
    name: 'Support Vector Machine (SVM)',
    belongsTo: 'Supervised · Classification',
    description: 'Finds a maximum‑margin separating hyperplane (kernelizable).',
  },
  {
    kind: 'S',
    subgroup: 'Classification/Regression',
    id: 'knn',
    name: 'K‑Nearest Neighbors (KNN)',
    belongsTo: 'Supervised · Classification/Regression',
    description: 'Predicts from the labels/values of the nearest points in feature space.',
  },
  {
    kind: 'S',
    subgroup: 'Tree‑based',
    id: 'decision_tree',
    name: 'Decision Tree',
    belongsTo: 'Supervised · Tree‑based',
    description: 'Learns hierarchical if‑then splits to predict class or value.',
  },
  {
    kind: 'S',
    subgroup: 'Ensembles',
    id: 'random_forest',
    name: 'Random Forest',
    belongsTo: 'Supervised · Ensemble',
    description: 'Bagging ensemble of trees; reduces variance and improves robustness.',
  },
  {
    kind: 'S',
    subgroup: 'Ensembles',
    id: 'gradient_boosting',
    name: 'Gradient Boosting',
    belongsTo: 'Supervised · Ensemble',
    description: 'Builds learners sequentially to correct errors (e.g. XGBoost/LightGBM style).',
  },
  {
    kind: 'S',
    subgroup: 'Neural Networks',
    id: 'mlp',
    name: 'MLP (Neural Network)',
    belongsTo: 'Supervised · Neural Network',
    description: 'Learns non‑linear mappings using layered neurons and backpropagation.',
  },
  {
    kind: 'U',
    subgroup: 'Clustering',
    id: 'kmeans',
    name: 'K‑Means',
    belongsTo: 'Unsupervised · Clustering',
    description: 'Partitions data into k clusters by iteratively updating centroids.',
  },
  {
    kind: 'U',
    subgroup: 'Clustering',
    id: 'dbscan',
    name: 'DBSCAN',
    belongsTo: 'Unsupervised · Density‑based Clustering',
    description: 'Finds dense regions and marks sparse points as noise/outliers.',
  },
  {
    kind: 'U',
    subgroup: 'Dimensionality Reduction',
    id: 'pca',
    name: 'PCA',
    belongsTo: 'Unsupervised · Dimensionality Reduction',
    description: 'Projects data onto principal components maximizing variance.',
  },
  {
    kind: 'U',
    subgroup: 'Dimensionality Reduction',
    id: 'tsne',
    name: 't‑SNE',
    belongsTo: 'Unsupervised · Dimensionality Reduction',
    description: 'Visualizes high‑dimensional data by preserving local neighborhoods.',
  },
  {
    kind: 'R',
    subgroup: 'Value‑Based',
    id: 'q_learning',
    name: 'Q‑Learning',
    belongsTo: 'Reinforcement · Value‑Based',
    description: 'Learns state‑action values to choose actions that maximize reward.',
  },
  {
    kind: 'R',
    subgroup: 'Deep RL',
    id: 'dqn',
    name: 'DQN',
    belongsTo: 'Reinforcement · Deep RL',
    description: 'Approximates Q‑values with a neural network for high‑dim inputs.',
  },
  {
    kind: 'R',
    subgroup: 'Actor‑Critic',
    id: 'ppo',
    name: 'PPO',
    belongsTo: 'Reinforcement · Actor‑Critic',
    description: 'Stabilizes policy updates using a clipped objective (widely used in practice).',
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

function ModelTile({
  kind,
  subgroup,
  id,
  name,
  belongsTo,
  description,
  ariaLabel,
  index,
  reduceMotion,
}: {
  kind: 'S' | 'U' | 'R';
  subgroup: string;
  id: ModelId;
  name: string;
  belongsTo: string;
  description: string;
  ariaLabel: string;
  index: number;
  reduceMotion: boolean | null;
}) {
  const tileTransition = reduceMotion
    ? { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }
    : { type: 'spring' as const, stiffness: 420, damping: 30, mass: 0.85 };

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
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -5,
              transition: { type: 'spring', stiffness: 520, damping: 28 },
            }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.992 }}
      className="ml-no-text"
    >
      <GlassFrame ariaLabel={ariaLabel}>
        <div className="flex items-center justify-between mb-3">
          <CategoryPill kind={kind} />
          <motion.div
            className="h-1.5 w-16 rounded-full bg-fg/[0.06] overflow-hidden border border-fg/10"
            initial={false}
          >
            <motion.div
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-blood to-transparent"
              animate={{ x: ['-50%', '120%'] }}
              transition={{ duration: 2.2 + index * 0.04, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>
        <div className="mb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-base md:text-lg font-bold text-fg leading-tight">{name}</h3>
              <p className="text-xs text-fg/50 tracking-wide">{belongsTo}</p>
            </div>
            <motion.div
              className="shrink-0 w-2.5 h-2.5 rounded-full bg-blood/70 shadow-blood-glow-sm"
              animate={
                reduceMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: [0.35, 1, 0.35], scale: [1, 1.08, 1] }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 1.8 + (index % 3) * 0.12, repeat: Infinity, ease: 'easeInOut' }
              }
              aria-hidden
            />
          </div>
          <p className="text-[11px] text-fg/45 tracking-wide mt-1">{subgroup}</p>
          <p className="text-sm text-fg/65 leading-relaxed mt-2">{description}</p>
        </div>
        <ModelScene id={id} />
      </GlassFrame>
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
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <motion.div
            className="flex items-center gap-4"
            animate={
              rm
                ? undefined
                : {
                    opacity: [0.85, 1, 0.85],
                  }
            }
            transition={rm ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="w-8 h-px bg-gradient-to-r from-blood/70 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left center' }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-blood/80"
              animate={rm ? undefined : { scale: [1, 1.2, 1] }}
              transition={rm ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="w-8 h-px bg-gradient-to-l from-blood-glow/70 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{ transformOrigin: 'right center' }}
            />
          </motion.div>
        </motion.div>

        <div className="space-y-14 md:space-y-16">
          <div>
            <GroupHeader title="Supervised" accent="blood" />
            <ModelGrid>
              {supervised.map((m, i) => (
                <ModelTile
                  key={`${m.kind}-${m.id}`}
                  index={i}
                  reduceMotion={rm}
                  kind={m.kind}
                  subgroup={m.subgroup}
                  id={m.id}
                  name={m.name}
                  belongsTo={m.belongsTo}
                  description={m.description}
                  ariaLabel={`${m.belongsTo}: ${m.name}`}
                />
              ))}
            </ModelGrid>
          </div>

          <div>
            <GroupHeader title="Unsupervised" accent="neutral" />
            <ModelGrid>
              {unsupervised.map((m, i) => (
                <ModelTile
                  key={`${m.kind}-${m.id}`}
                  index={i}
                  reduceMotion={rm}
                  kind={m.kind}
                  subgroup={m.subgroup}
                  id={m.id}
                  name={m.name}
                  belongsTo={m.belongsTo}
                  description={m.description}
                  ariaLabel={`${m.belongsTo}: ${m.name}`}
                />
              ))}
            </ModelGrid>
          </div>

          <div>
            <GroupHeader title="Reinforcement" accent="glow" />
            <ModelGrid>
              {reinforcement.map((m, i) => (
                <ModelTile
                  key={`${m.kind}-${m.id}`}
                  index={i}
                  reduceMotion={rm}
                  kind={m.kind}
                  subgroup={m.subgroup}
                  id={m.id}
                  name={m.name}
                  belongsTo={m.belongsTo}
                  description={m.description}
                  ariaLabel={`${m.belongsTo}: ${m.name}`}
                />
              ))}
            </ModelGrid>
          </div>
        </div>
      </div>
    </section>
  );
}
