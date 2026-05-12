'use client';

import { motion } from 'framer-motion';
import { useId, useMemo } from 'react';

export type ModelId =
  | 'linear_regression'
  | 'polynomial_regression'
  | 'ridge'
  | 'lasso'
  | 'elasticnet'
  | 'logistic_regression'
  | 'svm'
  | 'svr'
  | 'decision_tree'
  | 'random_forest'
  | 'gradient_boosting'
  | 'naive_bayes'
  | 'knn'
  | 'mlp'
  | 'kmeans'
  | 'gmm'
  | 'dbscan'
  | 'hdbscan'
  | 'hierarchical'
  | 'pca'
  | 'tsne'
  | 'umap'
  | 'apriori'
  | 'fpgrowth'
  | 'isolation_forest'
  | 'one_class_svm'
  | 'q_learning'
  | 'sarsa'
  | 'dqn'
  | 'reinforce'
  | 'actor_critic'
  | 'ppo';

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 70" className="w-full h-full">
      <rect
        x="10"
        y="10"
        width="82"
        height="50"
        rx="6"
        fill="var(--ml-w-02)"
        stroke="var(--ml-w-08)"
      />
      {children}
    </svg>
  );
}

function GlowFilter({ id }: { id: string }) {
  return (
    <defs>
      <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.2" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

/** Linear regression: scatter + line “finds” fit; residuals shrink */
export function SceneLinearRegression() {
  const uid = useId().replace(/:/g, '');
  const fid = `g-lr-${uid}`;
  const pts = useMemo(
    () =>
      [
        [20, 58],
        [30, 52],
        [40, 48],
        [50, 42],
        [60, 36],
        [72, 30],
        [82, 26],
      ] as const,
    []
  );
  return (
    <Frame>
      <GlowFilter id={fid} />
      <path d="M12 10 V60 H92" fill="none" stroke="var(--ml-w-08)" strokeWidth="1" />
      {pts.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="2.4"
          fill="var(--ml-w-70)"
          stroke="rgba(255,23,68,0.45)"
          strokeWidth="0.7"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
      {/* Line animates from flat to fitted slope */}
      <motion.path
        d="M16 58 L88 28"
        fill="none"
        stroke="rgba(255,23,68,0.95)"
        strokeWidth="2.2"
        strokeLinecap="round"
        filter={`url(#${fid})`}
        initial={false}
        animate={{ d: ['M16 48 L88 48', 'M16 58 L88 28'] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Residual segments pulse shorter (loss going down) */}
      {pts.slice(0, 5).map(([x, y], i) => (
        <motion.line
          key={`r-${i}`}
          x1={x}
          y1={y}
          x2={x}
          stroke="rgba(255,23,68,0.35)"
          strokeWidth="0.9"
          strokeDasharray="2 2"
          initial={false}
          animate={{ y2: [y - 8, y - 2] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.8, delay: i * 0.05 }}
        />
      ))}
    </Frame>
  );
}

/** Logistic: class clouds + S-curve probability ribbon */
export function SceneLogisticRegression() {
  const uid = useId().replace(/:/g, '');
  const fid = `g-log-${uid}`;
  return (
    <Frame>
      <GlowFilter id={fid} />
      {/* y=0 / y=1 bands */}
      <rect x="14" y="44" width="72" height="12" fill="var(--ml-w-04)" rx="2" />
      <rect x="14" y="22" width="72" height="12" fill="rgba(255,23,68,0.06)" rx="2" />
      {Array.from({ length: 10 }).map((_, i) => (
        <circle
          key={`n-${i}`}
          cx={22 + (i % 5) * 8}
          cy={48 + (i % 2) * 3}
          r="1.6"
          fill="var(--ml-w-55)"
        />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <circle
          key={`p-${i}`}
          cx={58 + (i % 5) * 7}
          cy={26 + (i % 2) * 3}
          r="1.6"
          fill="rgba(255,23,68,0.55)"
        />
      ))}
      <motion.path
        d="M18 52 Q 50 52, 50 35 Q 50 22, 82 22"
        fill="none"
        stroke="rgba(255,23,68,0.9)"
        strokeWidth="2.4"
        filter={`url(#${fid})`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.35, 0.7, 1] }}
      />
      <motion.line
        x1="50"
        y1="18"
        x2="50"
        y2="58"
        stroke="var(--ml-w-20)"
        strokeWidth="1"
        strokeDasharray="3 3"
        animate={{ x1: [36, 64, 36], x2: [36, 64, 36] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </Frame>
  );
}

/** SVM: separating line + margin gutters + support vectors */
export function SceneSVM() {
  const uid = useId().replace(/:/g, '');
  const fid = `g-svm-${uid}`;
  return (
    <Frame>
      <GlowFilter id={fid} />
      {Array.from({ length: 14 }).map((_, i) => (
        <circle
          key={`a-${i}`}
          cx={20 + (i % 7) * 5}
          cy={20 + Math.floor(i / 7) * 6}
          r="1.8"
          fill="var(--ml-w-50)"
        />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <circle
          key={`b-${i}`}
          cx={58 + (i % 7) * 4.5}
          cy={38 + Math.floor(i / 7) * 5}
          r="1.8"
          fill="rgba(255,23,68,0.5)"
        />
      ))}
      {/* Margins */}
      <motion.path
        d="M22 54 L78 18"
        stroke="rgba(255,23,68,0.22)"
        strokeWidth="6"
        strokeLinecap="round"
        animate={{ opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 2.6, repeat: Infinity }}
      />
      <motion.path
        d="M24 52 L80 16"
        fill="none"
        stroke="rgba(255,23,68,0.95)"
        strokeWidth="2.2"
        filter={`url(#${fid})`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.8 }}
      />
      {/* Support vectors */}
      {[
        [34, 38],
        [48, 32],
        [56, 36],
      ].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="3.2"
          fill="none"
          stroke="rgba(255,23,68,0.85)"
          strokeWidth="1.2"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
        />
      ))}
    </Frame>
  );
}

/** KNN: query finds k nearest; lines + majority tint */
export function SceneKNN() {
  const uid = useId().replace(/:/g, '');
  const fid = `g-knn-${uid}`;
  const neighbors = [
    [32, 28],
    [38, 34],
    [28, 36],
  ] as const;
  return (
    <Frame>
      <GlowFilter id={fid} />
      {[
        [22, 22],
        [26, 30],
        [34, 24],
        [40, 32],
      ].map(([x, y], i) => (
        <circle key={`w-${i}`} cx={x} cy={y} r="2" fill="var(--ml-w-55)" />
      ))}
      {[
        [62, 44],
        [70, 40],
        [66, 52],
        [74, 48],
      ].map(([x, y], i) => (
        <circle key={`r-${i}`} cx={x} cy={y} r="2" fill="rgba(255,23,68,0.55)" />
      ))}
      <motion.circle
        cx={46}
        cy={38}
        r="3.2"
        fill="var(--ml-w-90)"
        stroke="rgba(255,23,68,0.8)"
        strokeWidth="1"
        filter={`url(#${fid})`}
        animate={{ cx: [46, 42, 48, 46], cy: [38, 40, 36, 38] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {neighbors.map(([x, y], i) => (
        <motion.path
          key={i}
          d={`M46 38 L${x} ${y}`}
          fill="none"
          stroke="rgba(255,23,68,0.5)"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.35,
            times: [0, 0.15, 0.55, 1],
          }}
        />
      ))}
      <motion.circle
        cx={46}
        cy={38}
        r="12"
        fill="none"
        stroke="rgba(255,23,68,0.2)"
        strokeWidth="1"
        animate={{ r: [10, 14, 10], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </Frame>
  );
}

/** Decision tree: recursive axis-aligned splits */
export function SceneDecisionTree() {
  const uid = useId().replace(/:/g, '');
  const fid = `g-dt-${uid}`;
  return (
    <Frame>
      <GlowFilter id={fid} />
      {Array.from({ length: 24 }).map((_, i) => (
        <circle
          key={i}
          cx={16 + (i % 8) * 8}
          cy={18 + Math.floor(i / 8) * 12}
          r="1.5"
          fill="var(--ml-w-45)"
        />
      ))}
      <motion.line
        x1="50"
        y1="14"
        x2="50"
        y2="56"
        stroke="rgba(255,23,68,0.7)"
        strokeWidth="1.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.25, 0.85, 1] }}
      />
      <motion.line
        x1="14"
        y1="36"
        x2="50"
        y2="36"
        stroke="var(--ml-w-25)"
        strokeWidth="1.2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, delay: 0.4, times: [0, 0.25, 0.85, 1] }}
      />
      <motion.line
        x1="50"
        y1="36"
        x2="86"
        y2="36"
        stroke="var(--ml-w-25)"
        strokeWidth="1.2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, delay: 0.8, times: [0, 0.25, 0.85, 1] }}
      />
      <motion.rect
        x="52"
        y="38"
        width="32"
        height="18"
        rx="3"
        fill="rgba(255,23,68,0.08)"
        stroke="rgba(255,23,68,0.35)"
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 3.2, repeat: Infinity, delay: 1.1 }}
      />
    </Frame>
  );
}

/** Random forest: multiple weak boundaries fade; stronger blend */
export function SceneRandomForest() {
  const uid = useId().replace(/:/g, '');
  const fid = `g-rf-${uid}`;
  const trees = [
    'M20 20 L80 50',
    'M30 55 L70 18',
    'M50 14 L50 56',
  ];
  return (
    <Frame>
      <GlowFilter id={fid} />
      {Array.from({ length: 20 }).map((_, i) => (
        <circle
          key={i}
          cx={20 + (i % 10) * 6}
          cy={22 + Math.floor(i / 10) * 16}
          r="1.5"
          fill="var(--ml-w-40)"
        />
      ))}
      {trees.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="rgba(255,23,68,0.2)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ opacity: [0.1, 0.45, 0.1] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.35 }}
        />
      ))}
      <motion.path
        d="M24 48 L76 26"
        fill="none"
        stroke="rgba(255,23,68,0.95)"
        strokeWidth="2.4"
        filter={`url(#${fid})`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
    </Frame>
  );
}

/** Gradient boosting: sequential stumps correcting residuals */
export function SceneGradientBoosting() {
  const uid = useId().replace(/:/g, '');
  const fid = `g-bst-${uid}`;
  return (
    <Frame>
      <GlowFilter id={fid} />
      <motion.path
        d="M18 40 Q 50 28, 82 34"
        fill="none"
        stroke="var(--ml-w-18)"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      {[0, 1, 2].map((i) => (
        <motion.line
          key={i}
          x1={28 + i * 22}
          y1="18"
          x2={28 + i * 22}
          y2="52"
          stroke="rgba(255,23,68,0.45)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, delay: i * 0.45, times: [0, 0.2, 0.7, 1] }}
        />
      ))}
      <motion.path
        d="M18 40 Q 50 22, 82 30"
        fill="none"
        stroke="rgba(255,23,68,0.95)"
        strokeWidth="2.4"
        filter={`url(#${fid})`}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3.6, repeat: Infinity }}
      />
      {[
        [24, 38],
        [50, 30],
        [76, 32],
      ].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="2.5"
          fill="rgba(255,23,68,0.85)"
          animate={{ y: [y, y - 4, y] }}
          transition={{ duration: 3.6, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </Frame>
  );
}

/** MLP: forward signal propagation + subtle backprop return */
export function SceneMLP() {
  const uid = useId().replace(/:/g, '');
  const fid = `g-mlp-${uid}`;
  const layers = [
    [
      [24, 20],
      [24, 35],
      [24, 50],
    ],
    [
      [50, 26],
      [50, 42],
    ],
    [[76, 34]],
  ] as const;
  return (
    <Frame>
      <GlowFilter id={fid} />
      {layers.flatMap((layer, li) =>
        layer.map(([x, y], ni) => (
          <motion.circle
            key={`${li}-${ni}`}
            cx={x}
            cy={y}
            r="3"
            fill={li === 2 ? 'rgba(255,23,68,0.9)' : 'var(--ml-w-55)'}
            stroke="rgba(255,23,68,0.35)"
            strokeWidth="0.6"
            animate={{
              opacity: [0.35, 1, 0.35],
              scale: [0.92, 1.06, 0.92],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              delay: li * 0.35 + ni * 0.1,
            }}
          />
        ))
      )}
      {/* forward edges pulse */}
      {layers[0].map(([x1, y1], i) =>
        layers[1].map(([x2, y2], j) => (
          <motion.line
            key={`f-${i}-${j}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(255,23,68,0.15)"
            strokeWidth="1"
            animate={{ opacity: [0.05, 0.45, 0.05] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.08 + j * 0.06 }}
          />
        ))
      )}
      {layers[1].map(([x1, y1], i) =>
        layers[2].map(([x2, y2], j) => (
          <motion.line
            key={`o-${i}-${j}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(255,23,68,0.35)"
            strokeWidth="1.4"
            animate={{ opacity: [0.1, 0.7, 0.1] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: 0.6 + i * 0.12 + j * 0.1 }}
          />
        ))
      )}
      <motion.circle
        cx="76"
        cy="34"
        r="10"
        fill="none"
        stroke="rgba(255,23,68,0.25)"
        animate={{ r: [8, 12, 8], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
    </Frame>
  );
}

/** K-means: centroids drift; points ease toward their cluster (keyframed, no motion-value coupling) */
function SceneKMeansAnim() {
  const uid = useId().replace(/:/g, '');
  const fid = `g-km-${uid}`;
  const dur = 4;
  const pts = useMemo(
    () =>
      [
        { fill: 'var(--ml-w-60)', cx: [22, 24.5, 22] as const, cy: [24, 25.8, 24] as const, delay: 0 },
        { fill: 'var(--ml-w-60)', cx: [30, 31.4, 30] as const, cy: [28, 29.2, 28] as const, delay: 0.06 },
        { fill: 'var(--ml-w-60)', cx: [26, 27.6, 26] as const, cy: [32, 30.6, 32] as const, delay: 0.12 },
        { fill: 'rgba(255,23,68,0.55)', cx: [68, 66.2, 68] as const, cy: [46, 44.8, 46] as const, delay: 0.04 },
        { fill: 'rgba(255,23,68,0.55)', cx: [74, 72.5, 74] as const, cy: [42, 41, 42] as const, delay: 0.1 },
        { fill: 'rgba(255,23,68,0.55)', cx: [70, 68.8, 70] as const, cy: [50, 48.6, 50] as const, delay: 0.16 },
      ] as const,
    []
  );

  return (
    <Frame>
      <GlowFilter id={fid} />
      {pts.map((p, i) => (
        <motion.circle
          key={i}
          r="2.2"
          fill={p.fill}
          filter={`url(#${fid})`}
          animate={{ cx: [...p.cx], cy: [...p.cy] }}
          transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}
      <motion.circle
        r="4"
        fill="var(--ml-w-90)"
        stroke="rgba(255,23,68,0.7)"
        strokeWidth="1"
        filter={`url(#${fid})`}
        animate={{ cx: [28, 32, 28], cy: [22, 26, 22] }}
        transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        r="4"
        fill="rgba(255,23,68,0.9)"
        stroke="var(--ml-w-50)"
        strokeWidth="1"
        filter={`url(#${fid})`}
        animate={{ cx: [72, 66, 72], cy: [48, 44, 48] }}
        transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut' }}
      />
    </Frame>
  );
}

/** DBSCAN: ε-neighborhood expands; core connects; noise flickers */
export function SceneDBSCAN() {
  const uid = useId().replace(/:/g, '');
  const fid = `g-db-${uid}`;
  return (
    <Frame>
      <GlowFilter id={fid} />
      {[
        [32, 32],
        [36, 30],
        [34, 36],
        [38, 34],
        [40, 30],
      ].map(([x, y], i) => (
        <circle key={`c-${i}`} cx={x} cy={y} r="2" fill="var(--ml-w-65)" />
      ))}
      <motion.circle
        cx="36"
        cy="32"
        r="2"
        fill="rgba(255,23,68,0.85)"
        filter={`url(#${fid})`}
        animate={{ r: [2, 2.6, 2] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle
        cx="36"
        cy="32"
        fill="none"
        stroke="rgba(255,23,68,0.35)"
        strokeWidth="1"
        initial={{ r: 4, opacity: 0.9 }}
        animate={{ r: [6, 14, 6], opacity: [0.5, 0.15, 0.5] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      />
      <motion.circle
        cx="72"
        cy="22"
        r="2.2"
        fill="var(--ml-w-35)"
        stroke="rgba(255,23,68,0.6)"
        strokeWidth="0.8"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      <text x="68" y="26" fill="rgba(255,23,68,0.5)" fontSize="6">
        ×
      </text>
    </Frame>
  );
}

/** PCA: cloud + dominant axis + projection ticks */
export function ScenePCA() {
  const uid = useId().replace(/:/g, '');
  const fid = `g-pca-${uid}`;
  return (
    <Frame>
      <GlowFilter id={fid} />
      {Array.from({ length: 22 }).map((_, i) => {
        const x = 30 + (i % 11) * 4;
        const y = 24 + Math.floor(i / 11) * 10 + (i % 3);
        return <circle key={i} cx={x} cy={y} r="1.5" fill="var(--ml-w-50)" />;
      })}
      <motion.g animate={{ rotate: [-8, 4, -8] }} style={{ originX: '50px', originY: '35px' }}>
        <line x1="18" y1="52" x2="82" y2="22" stroke="rgba(255,23,68,0.85)" strokeWidth="2.2" filter={`url(#${fid})`} />
      </motion.g>
      {[40, 48, 56, 64].map((x, i) => (
        <motion.line
          key={i}
          x1={x}
          y1={20 + i * 3}
          x2={x + 6}
          y2={32 + i * 2}
          stroke="rgba(255,23,68,0.25)"
          strokeWidth="0.8"
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </Frame>
  );
}

/** t-SNE: high-dim “mess” relaxes into separated manifolds */
export function SceneTSNE() {
  const uid = useId().replace(/:/g, '');
  const fid = `g-ts-${uid}`;
  const blobs = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        i,
        sx: 30 + (i % 8) * 5 + (i % 3),
        sy: 24 + Math.floor(i / 8) * 14 + (i % 2) * 4,
        tx: i < 8 ? 28 + (i % 4) * 5 : 58 + (i % 4) * 5,
        ty: i < 8 ? 26 + Math.floor(i / 4) * 5 : 38 + Math.floor(i / 4) * 5,
      })),
    []
  );
  return (
    <Frame>
      <GlowFilter id={fid} />
      {blobs.map((b) => (
        <motion.circle
          key={b.i}
          r="1.8"
          fill={b.i < 8 ? 'var(--ml-w-60)' : 'rgba(255,23,68,0.55)'}
          animate={{
            cx: [b.sx, b.tx, b.sx],
            cy: [b.sy, b.ty, b.sy],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </Frame>
  );
}

const Q_LEARNING_CELLS = [
  [0, 0],
  [1, 0],
  [2, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [0, 2],
  [1, 2],
  [2, 2],
] as const;

function QLearningGridInner({ fid }: { fid: string }) {
  const origin = { x: 18, y: 16 };
  const step = 20;
  return (
    <>
      {Q_LEARNING_CELLS.map(([cx, cy]) => (
        <rect
          key={`${cx}-${cy}`}
          x={origin.x + cx * step}
          y={origin.y + cy * step}
          width="18"
          height="18"
          rx="2"
          fill="var(--ml-w-03)"
          stroke="var(--ml-w-08)"
        />
      ))}
      <motion.circle
        cx={origin.x + 9 + 2 * step}
        cy={origin.y + 9 + 0 * step}
        r="4"
        fill="rgba(255,23,68,0.85)"
        filter={`url(#${fid})`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      <motion.rect
        width="7"
        height="7"
        rx="2"
        fill="var(--ml-w-90)"
        stroke="rgba(255,23,68,0.6)"
        strokeWidth="0.8"
        filter={`url(#${fid})`}
        animate={{
          x: [origin.x + 5, origin.x + 5 + step, origin.x + 5 + 2 * step, origin.x + 5 + 2 * step, origin.x + 5 + step, origin.x + 5],
          y: [origin.y + 5 + 2 * step, origin.y + 5 + 2 * step, origin.y + 5 + 2 * step, origin.y + 5 + step, origin.y + 5 + step, origin.y + 5 + 2 * step],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}

/** Q-learning: grid + moving agent + greedy glow */
export function SceneQLearning() {
  const uid = useId().replace(/:/g, '');
  const fid = `g-q-${uid}`;
  return (
    <Frame>
      <GlowFilter id={fid} />
      <QLearningGridInner fid={fid} />
    </Frame>
  );
}

/** DQN: grid world + “frame stack” flicker + target pulse */
export function SceneDQN() {
  const uid = useId().replace(/:/g, '');
  const fid = `g-dqn-${uid}`;
  return (
    <Frame>
      <GlowFilter id={fid} />
      <QLearningGridInner fid={fid} />
      <motion.rect
        x="14"
        y="12"
        width="20"
        height="14"
        rx="2"
        fill="rgba(255,23,68,0.06)"
        stroke="rgba(255,23,68,0.35)"
        animate={{ opacity: [0.2, 0.9, 0.2] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      <motion.rect
        x="36"
        y="12"
        width="20"
        height="14"
        rx="2"
        fill="var(--ml-w-04)"
        stroke="var(--ml-w-20)"
        animate={{ opacity: [0.1, 0.6, 0.1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
      />
      <motion.circle
        cx="78"
        cy="22"
        r="5"
        fill="none"
        stroke="rgba(255,23,68,0.45)"
        strokeWidth="1.2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
    </Frame>
  );
}

/** PPO: policy update clipped between two rails */
export function ScenePPO() {
  const uid = useId().replace(/:/g, '');
  const fid = `g-ppo-${uid}`;
  return (
    <Frame>
      <GlowFilter id={fid} />
      <line x1="18" y1="28" x2="82" y2="28" stroke="var(--ml-w-20)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="18" y1="42" x2="82" y2="42" stroke="var(--ml-w-20)" strokeWidth="1" strokeDasharray="3 3" />
      <motion.path
        d="M18 50 Q 50 22, 82 30"
        fill="none"
        stroke="rgba(255,23,68,0.35)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1 }}
      />
      <motion.rect
        x="18"
        y="26"
        width="64"
        height="16"
        rx="3"
        fill="rgba(255,23,68,0.06)"
        stroke="rgba(255,23,68,0.35)"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle
        cx="50"
        cy="35"
        r="3.5"
        fill="rgba(255,23,68,0.95)"
        filter={`url(#${fid})`}
        animate={{ cx: [38, 62, 44, 58, 50], cy: [34, 36, 33, 37, 35] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </Frame>
  );
}

export default function ModelScene({ id }: { id: ModelId }) {
  return (
    <div className="relative w-full aspect-[16/10]" aria-hidden>
      {id === 'linear_regression' && <SceneLinearRegression />}
      {id === 'polynomial_regression' && <SceneLinearRegression />}
      {(id === 'ridge' || id === 'lasso' || id === 'elasticnet') && <SceneLinearRegression />}
      {id === 'logistic_regression' && <SceneLogisticRegression />}
      {id === 'svm' && <SceneSVM />}
      {id === 'svr' && <SceneLinearRegression />}
      {id === 'decision_tree' && <SceneDecisionTree />}
      {id === 'random_forest' && <SceneRandomForest />}
      {id === 'gradient_boosting' && <SceneGradientBoosting />}
      {id === 'naive_bayes' && <SceneLogisticRegression />}
      {id === 'knn' && <SceneKNN />}
      {id === 'mlp' && <SceneMLP />}
      {id === 'kmeans' && <SceneKMeansAnim />}
      {id === 'gmm' && <SceneKMeansAnim />}
      {(id === 'dbscan' || id === 'hdbscan') && <SceneDBSCAN />}
      {id === 'hierarchical' && <SceneDecisionTree />}
      {id === 'pca' && <ScenePCA />}
      {(id === 'tsne' || id === 'umap') && <SceneTSNE />}
      {(id === 'apriori' || id === 'fpgrowth') && <SceneRandomForest />}
      {id === 'isolation_forest' && <SceneDBSCAN />}
      {id === 'one_class_svm' && <SceneSVM />}
      {id === 'q_learning' && <SceneQLearning />}
      {id === 'sarsa' && <SceneQLearning />}
      {id === 'dqn' && <SceneDQN />}
      {id === 'reinforce' && <ScenePPO />}
      {id === 'actor_critic' && <SceneDQN />}
      {id === 'ppo' && <ScenePPO />}
    </div>
  );
}
