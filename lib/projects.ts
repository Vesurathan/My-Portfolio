export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  tags: string[];
  image: string;
  /** Full content for the project detail page */
  detail: {
    overview: string;
    /** Optional paragraphs for the detail page */
    sections?: Array<{ heading?: string; body: string }>;
    /** Gallery images shown on the detail page (paths under /projects/ or public) */
    images?: string[];
    /** Optional: link to live project or repo */
    link?: { label: string; href: string };
  };
};

export const projects: Project[] = [
  {
    slug: 'ml-pipeline',
    title: 'ML Pipeline & Model Serving',
    shortDescription:
      'End-to-end pipeline for training, evaluation, and deployment of ML models with experiment tracking.',
    tags: ['Python', 'PyTorch', 'MLflow', 'Docker'],
    image: '/projects/ml-pipeline.jpg',
    detail: {
      overview:
        'A production-ready ML pipeline that handles training, evaluation, versioning, and deployment. Built for reproducibility and scale with experiment tracking and model registry.',
      sections: [
        {
          heading: 'Problem',
          body: 'Training and deploying models across environments was manual and error-prone. We needed a single pipeline that could version data, track experiments, and serve models consistently.',
        },
        {
          heading: 'Solution',
          body: 'Designed an end-to-end flow using PyTorch for training, MLflow for experiment tracking and model registry, and containerized serving with Docker. The pipeline supports automated retraining and A/B deployment.',
        },
        {
          heading: 'Outcome',
          body: 'Reduced time from experiment to production and improved reproducibility. All runs are logged with metrics, artifacts, and parameters for easy comparison and rollback.',
        },
      ],
      images: ['/projects/ml-pipeline.jpg', '/projects/ml-pipeline-2.jpg', '/projects/ml-pipeline-3.jpg'],
      link: { label: 'View on GitHub', href: '#' },
    },
  },
  {
    slug: 'big-data-analytics',
    title: 'Big Data Analytics Pipeline',
    shortDescription:
      'Distributed ETL and analytics on large-scale datasets using Spark and cloud storage.',
    tags: ['Spark', 'PySpark', 'ETL', 'AWS'],
    image: '/projects/big-data.jpg',
    detail: {
      overview:
        'A distributed data pipeline that ingests, transforms, and serves analytics on large-scale datasets. Built with Apache Spark and deployed on cloud storage and compute.',
      sections: [
        {
          heading: 'Scope',
          body: 'The pipeline processes terabytes of event data daily. We use PySpark for transformations, partition data by date and key dimensions, and expose aggregated metrics for dashboards and APIs.',
        },
        {
          heading: 'Tech stack',
          body: 'Apache Spark for batch and micro-batch jobs, S3-compatible storage for raw and curated layers, and Airflow for orchestration. All jobs are idempotent and support incremental processing.',
        },
      ],
      images: ['/projects/big-data.jpg', '/projects/big-data-2.jpg'],
      link: { label: 'Case study', href: '#' },
    },
  },
  {
    slug: 'computer-vision-detection',
    title: 'Computer Vision — Object Detection',
    shortDescription:
      'Real-time object detection and classification using deep learning and OpenCV.',
    tags: ['PyTorch', 'YOLO', 'OpenCV', 'Computer Vision'],
    image: '/projects/computer-vision.jpg',
    detail: {
      overview:
        'A real-time object detection system for video streams and images. Uses a YOLO-based model trained on custom datasets, with OpenCV for preprocessing and inference optimization.',
      sections: [
        {
          heading: 'Model & training',
          body: 'Fine-tuned a YOLO architecture on domain-specific data. Training pipeline includes augmentation, anchor tuning, and validation on held-out video sequences for temporal consistency.',
        },
        {
          heading: 'Deployment',
          body: 'Model is exported to ONNX for fast inference and integrated with OpenCV for capture and display. Runs in real time on GPU with optional TensorRT optimization for edge devices.',
        },
      ],
      images: ['/projects/computer-vision.jpg', '/projects/computer-vision-2.jpg', '/projects/computer-vision-3.jpg'],
      link: { label: 'Demo', href: '#' },
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
