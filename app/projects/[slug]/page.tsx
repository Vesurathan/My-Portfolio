import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/projects';
import GalleryImage from '@/components/GalleryImage';
import HeroProjectImage from '@/components/HeroProjectImage';

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

type Props = { params: { slug: string } };

export default function ProjectPage({ params }: Props) {
  // Avoid treating static file requests (e.g. .jpg) as project slugs
  if (params.slug.includes('.')) notFound();
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const { detail } = project;

  return (
    <div className="min-h-screen bg-void text-fg">
      <div className="pt-[4.5rem]">
        {/* Back link — below fixed navbar */}
        <div className="border-b border-void-600 bg-void-900/50 sticky top-[4.5rem] z-[90] backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-fg/70 hover:text-blood transition-colors"
            >
              <span aria-hidden>←</span>
              Back to projects
            </Link>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        {/* Header */}
        <header className="mb-10 md:mb-14">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium bg-void-600 text-fg/80 rounded border border-void-500"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-fg tracking-tight mb-4">
            {project.title}
          </h1>
          <p className="text-lg text-fg/70 max-w-2xl">
            {project.shortDescription}
          </p>
        </header>

        {/* Hero image */}
        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-void-600 mb-12 md:mb-16">
          <HeroProjectImage
            src={project.image}
            alt={project.title}
            title={project.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Overview */}
        <div className="prose prose-invert max-w-none mb-12">
          <p className="text-fg/85 text-lg leading-relaxed">
            {detail.overview}
          </p>
        </div>

        {/* Sections */}
        {detail.sections && detail.sections.length > 0 && (
          <div className="space-y-10 md:space-y-14 mb-12 md:mb-16">
            {detail.sections.map((section, i) => (
              <section key={i}>
                {section.heading && (
                  <h2 className="font-display text-xl md:text-2xl font-bold text-fg mb-3 text-blood">
                    {section.heading}
                  </h2>
                )}
                <p className="text-fg/75 leading-relaxed">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        )}

        {/* Image gallery */}
        {detail.images && detail.images.length > 0 && (
          <div className="mb-12 md:mb-16">
            <h2 className="font-display text-xl md:text-2xl font-bold text-fg mb-6">
              Gallery
            </h2>
            <div className="grid gap-6 md:gap-8">
              {detail.images.map((src, i) => (
                <div
                  key={i}
                  className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-void-600"
                >
                  <GalleryImage
                    src={src}
                    alt={`${project.title} — image ${i + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* External link */}
        {detail.link && (
          <div className="pt-6 border-t border-void-600">
            <a
              href={detail.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blood text-white font-semibold rounded-lg hover:bg-blood-600 transition-colors"
            >
              {detail.link.label}
              <span aria-hidden>→</span>
            </a>
          </div>
        )}
        </article>
      </div>
    </div>
  );
}
