export type ProjectCategory = 'research' | 'web' | 'app' | 'company';

export type ProjectLink = {
  label: string;
  href: string;
  /** 'live' | 'code' | 'demo' | 'paper' — used to pick an icon on the card */
  type: 'live' | 'code' | 'demo' | 'paper';
};

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  shortDescription: string;
  tags: string[];
  image: string;
  /** Quick links shown on the card (external) */
  links?: ProjectLink[];
  /** Full content for the project detail page */
  detail: {
    overview: string;
    sections?: Array<{ heading?: string; body: string }>;
    images?: string[];
    link?: { label: string; href: string };
  };
};

export const CATEGORY_META: Record<ProjectCategory, { label: string; badge: string }> = {
  research: { label: 'Research', badge: 'bg-blood/15 border-blood/40 text-blood' },
  app: { label: 'Application', badge: 'bg-blood-glow/15 border-blood-glow/40 text-blood-glow' },
  web: { label: 'Website', badge: 'bg-fg/[0.06] border-fg/20 text-fg/80' },
  company: { label: 'Company', badge: 'bg-blood/10 border-blood/30 text-blood/90' },
};

export const projects: Project[] = [
  {
    slug: 'plant-disease-advisor',
    title: 'Agentic Plant-Disease Advisor',
    category: 'research',
    shortDescription:
      'Deep-learning leaf-disease detection paired with a retrieval-grounded, confidence-gated treatment advisor. (MSc dissertation.)',
    tags: ['PyTorch', 'Computer Vision', 'RAG', 'LLM Agents'],
    image: '/projects/plant-disease.jpg',
    links: [{ label: 'Read', href: '#', type: 'paper' }],
    detail: {
      overview:
        'A research project that goes beyond classification: it detects plant diseases from leaf images, then reasons about what to do next — recommending confidence-gated treatments grounded in retrieved evidence.',
      sections: [
        { heading: 'Problem', body: 'A prediction alone is not actionable. Growers need to know what a diagnosis means and what to do — safely, and only when the model is confident.' },
        { heading: 'Approach', body: 'A CNN/ViT classifier feeds an agent that retrieves treatment guidance and gates its advice on prediction confidence, refusing to over-commit on uncertain cases.' },
      ],
      images: ['/projects/plant-disease.jpg'],
      link: { label: 'Read the write-up', href: '#' },
    },
  },
  {
    slug: 'computer-vision-detection',
    title: 'Real-Time Object Detection',
    category: 'app',
    shortDescription: 'Real-time object detection and classification for video streams using a YOLO model, OpenCV, and ONNX.',
    tags: ['PyTorch', 'YOLO', 'OpenCV', 'ONNX'],
    image: '/projects/computer-vision.jpg',
    links: [
      { label: 'Demo', href: '#', type: 'demo' },
      { label: 'Code', href: '#', type: 'code' },
    ],
    detail: {
      overview:
        'A real-time object detection system for video streams and images. Uses a YOLO-based model trained on custom datasets, with OpenCV for preprocessing and inference optimization.',
      sections: [
        { heading: 'Model & training', body: 'Fine-tuned a YOLO architecture on domain-specific data with augmentation, anchor tuning, and validation on held-out video sequences.' },
        { heading: 'Deployment', body: 'Exported to ONNX for fast inference and integrated with OpenCV; runs in real time on GPU with optional TensorRT optimization for edge devices.' },
      ],
      images: ['/projects/computer-vision.jpg', '/projects/computer-vision-2.jpg'],
      link: { label: 'Demo', href: '#' },
    },
  },
  {
    slug: 'ml-pipeline',
    title: 'ML Pipeline & Model Serving',
    category: 'app',
    shortDescription: 'End-to-end pipeline for training, evaluation, and deployment of ML models with experiment tracking.',
    tags: ['Python', 'PyTorch', 'MLflow', 'Docker'],
    image: '/projects/ml-pipeline.jpg',
    links: [{ label: 'Code', href: '#', type: 'code' }],
    detail: {
      overview:
        'A production-ready ML pipeline that handles training, evaluation, versioning, and deployment — built for reproducibility and scale with experiment tracking and a model registry.',
      sections: [
        { heading: 'Solution', body: 'PyTorch for training, MLflow for tracking and registry, and containerized serving with Docker. Supports automated retraining and A/B deployment.' },
        { heading: 'Outcome', body: 'Reduced time from experiment to production and improved reproducibility, with every run logged for comparison and rollback.' },
      ],
      images: ['/projects/ml-pipeline.jpg'],
      link: { label: 'View on GitHub', href: '#' },
    },
  },
  {
    slug: 'big-data-analytics',
    title: 'Big Data Analytics Pipeline',
    category: 'app',
    shortDescription: 'Distributed ETL and analytics on large-scale datasets using Spark and cloud storage.',
    tags: ['Spark', 'PySpark', 'ETL', 'Airflow'],
    image: '/projects/big-data.jpg',
    links: [{ label: 'Case study', href: '#', type: 'paper' }],
    detail: {
      overview:
        'A distributed data pipeline that ingests, transforms, and serves analytics on large-scale datasets, built with Apache Spark and deployed on cloud storage and compute.',
      sections: [
        { heading: 'Scope', body: 'Processes large volumes of event data. PySpark transformations, partitioned storage layers, and aggregated metrics exposed for dashboards and APIs.' },
        { heading: 'Tech stack', body: 'Spark for batch and micro-batch jobs, S3-compatible storage for raw and curated layers, and Airflow for orchestration; all jobs idempotent and incremental.' },
      ],
      images: ['/projects/big-data.jpg'],
      link: { label: 'Case study', href: '#' },
    },
  },
  {
    slug: 'ashura-portfolio',
    title: 'ASHURA — Portfolio',
    category: 'web',
    shortDescription: 'This site. A dark, motion-rich portfolio built with Next.js, framer-motion, and WebGL shaders.',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'WebGL'],
    image: '/projects/portfolio.jpg',
    links: [
      { label: 'Live', href: '/', type: 'live' },
      { label: 'Code', href: 'https://github.com/vesurathan', type: 'code' },
    ],
    detail: {
      overview:
        'A personal portfolio with a bold blood/void identity — a WebGL plasma hero, per-section signature animations, a custom cursor, and interactive mini-games.',
      sections: [
        { heading: 'Build', body: 'Next.js App Router with a static export, framer-motion for orchestration, canvas/WebGL for the generative backgrounds, and a fully theme-aware light/dark system.' },
      ],
      images: ['/projects/portfolio.jpg'],
      link: { label: 'Visit site', href: '/' },
    },
  },
  {
    slug: 'apptimus-systems',
    title: 'Apptimus Tech — Production Systems',
    category: 'company',
    shortDescription: 'Full-stack features and services shipped as a Software Engineer for company products (2022–2025).',
    tags: ['Full-stack', 'APIs', 'Databases', 'Delivery'],
    image: '/projects/apptimus.jpg',
    detail: {
      overview:
        'Work delivered as a Software Engineer at Apptimus Tech — designing, building, and shipping production software end to end across the stack.',
      sections: [
        { heading: 'Scope', body: 'Feature development, API and database work, and delivery of production systems for company products and clients.' },
      ],
      images: [],
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
