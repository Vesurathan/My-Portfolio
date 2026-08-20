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

// NOTE: descriptions + tech tags below are drafts inferred from the titles —
// edit freely. Images live at /projects/<slug>.jpg (upload into public/projects/).
export const projects: Project[] = [
  // ── Research ─────────────────────────────────────────────
  {
    slug: 'agentic-breast-cancer',
    title: 'Agentic Breast Cancer Detection System',
    category: 'research',
    shortDescription:
      'An agentic system that detects breast cancer from medical imaging and reasons over its findings, pairing deep-learning classification with LLM-driven analysis.',
    tags: ['Deep Learning', 'Medical Imaging', 'LLM Agents'],
    image: '/projects/agentic-breast-cancer.jpg',
    detail: {
      overview:
        'A research project combining deep-learning classification of breast-cancer imaging with an agent that reasons over the findings and grounds its output in retrieved evidence.',
    },
  },
  {
    slug: 'agentic-plant-disease',
    title: 'Agentic Plant Disease Prediction System',
    category: 'research',
    shortDescription:
      'Deep-learning plant-disease prediction with an agentic, retrieval-grounded advisor that recommends confidence-gated treatments. (MSc dissertation.)',
    tags: ['PyTorch', 'Computer Vision', 'RAG', 'LLM Agents'],
    image: '/projects/agentic-plant-disease.jpg',
    detail: {
      overview:
        'Goes beyond classification: detects plant diseases from leaf images, then reasons about what to do next — recommending confidence-gated treatments grounded in retrieved evidence.',
    },
  },
  {
    slug: 'parcel-delivery-ml',
    title: 'Enhancing Parcel Delivery Reliability Using Machine Learning',
    category: 'research',
    shortDescription:
      'Machine-learning models that forecast delivery delays and improve the reliability of last-mile parcel logistics.',
    tags: ['Machine Learning', 'Prediction', 'Logistics'],
    image: '/projects/parcel-delivery-ml.jpg',
    detail: {
      overview:
        'A study applying machine learning to predict and reduce parcel-delivery failures — modelling the factors behind delays and optimising for reliability.',
    },
  },

  // ── Websites ─────────────────────────────────────────────
  {
    slug: 'morleys-website',
    title: 'Morleys — Public Website',
    category: 'web',
    shortDescription: 'Public-facing website for Morleys, delivering brand presence and customer information.',
    tags: ['Web', 'Frontend'],
    image: '/projects/morleys-website.jpg',
    detail: { overview: 'The public-facing website for Morleys — brand, information, and customer-facing pages.' },
  },
  {
    slug: 'techna-website',
    title: 'Techna — Public Website',
    category: 'web',
    shortDescription: 'Public website for Techna Technical Institute — programmes, information, and enrolment.',
    tags: ['Web', 'Frontend'],
    image: '/projects/techna-website.jpg',
    detail: { overview: 'The public website for Techna Technical Institute, presenting programmes and information.' },
  },
  {
    slug: 'ashura-portfolio',
    title: 'My Portfolio — ASHURA',
    category: 'web',
    shortDescription: 'This site — a dark, motion-rich portfolio built with Next.js, framer-motion, and WebGL shaders.',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'WebGL'],
    image: '/projects/ashura-portfolio.jpg',
    links: [
      { label: 'Live', href: '/', type: 'live' },
      { label: 'Code', href: 'https://github.com/vesurathan', type: 'code' },
    ],
    detail: {
      overview:
        'A personal portfolio with a bold blood/void identity — a WebGL plasma hero, per-section signature animations, a custom cursor, and interactive mini-games.',
    },
  },
  {
    slug: 'ashurahub-website',
    title: 'AshuraHub — Public Website',
    category: 'web',
    shortDescription: 'The public storefront and landing site for AshuraHub.',
    tags: ['Web', 'E-commerce'],
    image: '/projects/ashurahub-website.jpg',
    detail: { overview: 'The public-facing storefront and landing experience for AshuraHub.' },
  },
  {
    slug: 'doc2-api',
    title: 'Doc2 API',
    category: 'web',
    shortDescription: 'A document-processing API for converting and extracting structured data from documents.',
    tags: ['API', 'Backend', 'Documents'],
    image: '/projects/doc2-api.jpg',
    detail: { overview: 'An API service for processing documents — conversion and structured data extraction.' },
  },
  {
    slug: 'dbforger-website',
    title: 'DB Forger — Website',
    category: 'web',
    shortDescription: 'Landing site for DB Forger, the database tooling product.',
    tags: ['Web', 'Landing'],
    image: '/projects/dbforger-website.jpg',
    detail: { overview: 'The marketing and landing website for the DB Forger product.' },
  },
  {
    slug: 'dinoverse',
    title: 'Dinoverse',
    category: 'web',
    shortDescription: 'An interactive, themed web experience — Dinoverse.',
    tags: ['Web', 'Interactive'],
    image: '/projects/dinoverse.jpg',
    detail: { overview: 'A themed, interactive web experience.' },
  },

  // ── Applications ─────────────────────────────────────────
  {
    slug: 'eldercare',
    title: 'ElderCare',
    category: 'app',
    shortDescription: 'An application supporting elderly care — monitoring, assistance, and caregiver coordination.',
    tags: ['App', 'Healthcare'],
    image: '/projects/eldercare.jpg',
    detail: { overview: 'An application built to support elderly care — monitoring, assistance, and coordination for caregivers.' },
  },
  {
    slug: 'morleys-pos',
    title: 'Morleys POS',
    category: 'app',
    shortDescription: 'Point-of-sale application for Morleys — checkout, sales, and inventory.',
    tags: ['App', 'POS', 'Retail'],
    image: '/projects/morleys-pos.jpg',
    detail: { overview: 'A point-of-sale system for Morleys — handling checkout, sales, and inventory.' },
  },
  {
    slug: 'research-mentor',
    title: 'Research Mentor',
    category: 'app',
    shortDescription: 'An AI-assisted research mentoring app offering guidance, resources, and progress tracking.',
    tags: ['App', 'AI', 'Education'],
    image: '/projects/research-mentor.jpg',
    detail: { overview: 'An AI-assisted application that mentors researchers — guidance, resources, and progress tracking.' },
  },
  {
    slug: 'dbforger-app',
    title: 'DBForger',
    category: 'app',
    shortDescription: 'A database tooling application for schema and data generation and management.',
    tags: ['App', 'Database', 'Tooling'],
    image: '/projects/dbforger-app.jpg',
    detail: { overview: 'A developer tool for database work — schema and data generation and management.' },
  },
  {
    slug: 'ashurahub-seller',
    title: 'AshuraHub — Seller Platform',
    category: 'app',
    shortDescription: 'The seller-side platform for AshuraHub — listings, orders, and store management.',
    tags: ['App', 'E-commerce', 'Dashboard'],
    image: '/projects/ashurahub-seller.jpg',
    detail: { overview: 'The seller-facing side of AshuraHub — managing listings, orders, and stores.' },
  },
  {
    slug: 'techna-admin',
    title: 'Techna — Admin Portal',
    category: 'app',
    shortDescription: 'Administration portal for Techna — managing students, courses, and operations.',
    tags: ['App', 'Admin', 'Dashboard'],
    image: '/projects/techna-admin.jpg',
    detail: { overview: 'An administration portal for Techna Technical Institute — students, courses, and operations.' },
  },

  // ── Company ──────────────────────────────────────────────
  {
    slug: 'apptimus-erp',
    title: 'Apptimus ERP',
    category: 'company',
    shortDescription: 'An enterprise resource planning system built at Apptimus Tech, spanning core business operations.',
    tags: ['ERP', 'Full-stack', 'Enterprise'],
    image: '/projects/apptimus-erp.jpg',
    detail: { overview: 'An enterprise resource planning platform delivered at Apptimus Tech, covering core operations.' },
  },
  {
    slug: 'elderpa',
    title: 'Elderpa',
    category: 'company',
    shortDescription: 'A digital eldercare product supporting seniors and their caregivers.',
    tags: ['Product', 'Healthcare'],
    image: '/projects/elderpa.jpg',
    detail: { overview: 'A company product in the eldercare space, supporting seniors and caregivers.' },
  },
  {
    slug: 'empower-wheelchair',
    title: 'Empower — Airport Wheelchair Assistance',
    category: 'company',
    shortDescription: 'A system for managing and dispatching airport wheelchair-assistance requests.',
    tags: ['Product', 'Operations', 'Airport'],
    image: '/projects/empower-wheelchair.jpg',
    detail: { overview: 'A platform coordinating airport wheelchair-assistance — request intake, dispatch, and tracking.' },
  },
  {
    slug: 'placements-lk',
    title: 'placements.lk',
    category: 'company',
    shortDescription: 'A jobs platform connecting employers and job-seekers — placements and hiring.',
    tags: ['Platform', 'Jobs', 'Matching'],
    image: '/projects/placements-lk.jpg',
    detail: { overview: 'A job platform where work finds people and people find work — placements and hiring.' },
  },
  {
    slug: 'joboro',
    title: 'Joboro — AI Job ATS',
    category: 'company',
    shortDescription: 'An AI-powered applicant tracking system (ATS) for smarter job matching and recruitment.',
    tags: ['AI', 'ATS', 'Recruitment'],
    image: '/projects/joboro.jpg',
    detail: { overview: 'An AI-driven applicant tracking system that streamlines matching, screening, and hiring.' },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
