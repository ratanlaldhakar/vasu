import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github, Wrench } from 'lucide-react';
import { WobblyCard } from '@/components/ui/WobblyCard';
import { WobblyButton } from '@/components/ui/WobblyButton';
import { getProjectBySlug, getProjects } from '@/lib/db';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} | Website Portfolio by Vasudev Dhakar`,
    description: project.description,
    keywords: [...(project.tags || []), "Vasudev Dhakar Portfolio", "Vasu projects", "Web design Bhilwara", "Website Developer Rajasthan"],
    alternates: {
      canonical: `https://vasuu.bond/portfolio/${slug}`,
    },
    openGraph: {
      title: `${project.title} | Website Portfolio by Vasudev Dhakar`,
      description: project.description,
      url: `https://vasuu.bond/portfolio/${slug}`,
      siteName: 'Vasudev Dhakar Portfolio',
      locale: 'en_IN',
      type: 'article',
      images: [
        {
          url: project.coverImageUrl,
          width: 1200,
          height: 800,
          alt: `${project.title} - Designed by Vasudev Dhakar`,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Website Portfolio by Vasudev Dhakar`,
      description: project.description,
      creator: '@VASUGAMER09',
      images: [project.coverImageUrl],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://vasuu.bond'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Portfolio',
        'item': 'https://vasuu.bond/portfolio'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': project.title,
        'item': `https://vasuu.bond/portfolio/${slug}`
      }
    ]
  };

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    'name': project.title,
    'description': project.description,
    'image': project.coverImageUrl,
    'author': {
      '@type': 'Person',
      'name': 'Vasudev Dhakar'
    },
    'publisher': {
      '@type': 'Person',
      'name': 'Vasudev Dhakar'
    },
    'url': `https://vasuu.bond/portfolio/${slug}`
  };

  return (
    <div className="py-12 md:py-20 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-ballpoint hover:text-marker transition-colors duration-100 mb-8 font-[family-name:var(--font-patrick-var)] text-lg"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={3} />
          Back to Portfolio
        </Link>

        {/* Hero Image */}
        <WobblyCard decoration="tape" hover={false} tilt={false} className="mb-10 !p-0 overflow-hidden">
          <Image
            src={project.coverImageUrl}
            alt={project.title}
            width={900}
            height={500}
            className="w-full h-64 md:h-96 object-cover"
            priority
          />
        </WobblyCard>

        {/* Title & Tags */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm font-[family-name:var(--font-patrick-var)] bg-postit border-2 border-pencil wobbly-sm text-pencil shadow-hard-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-pencil mb-4">{project.title}</h1>
          <p className="text-xl text-pencil-muted leading-relaxed">{project.description}</p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3 mb-12">
          {project.liveUrl && (
            <WobblyButton href={project.liveUrl} size="sm">
              <ExternalLink className="w-4 h-4 mr-2" strokeWidth={3} />
              Live Site
            </WobblyButton>
          )}
          {project.githubUrl && (
            <WobblyButton href={project.githubUrl} variant="secondary" size="sm">
              <Github className="w-4 h-4 mr-2" strokeWidth={3} />
              Source Code
            </WobblyButton>
          )}
        </div>

        {/* Problem / Solution */}
        {(project.problem || project.solution) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {project.problem && (
              <WobblyCard variant="paper" className="!bg-marker/5" rotation={-1} hover={false}>
                <h2 className="text-2xl font-bold text-pencil mb-3">The Problem</h2>
                <p className="text-pencil-muted leading-relaxed">{project.problem}</p>
              </WobblyCard>
            )}
            {project.solution && (
              <WobblyCard variant="paper" className="!bg-ballpoint/5" rotation={1} hover={false}>
                <h2 className="text-2xl font-bold text-pencil mb-3">The Solution</h2>
                <p className="text-pencil-muted leading-relaxed">{project.solution}</p>
              </WobblyCard>
            )}
          </div>
        )}

        {/* Gallery */}
        {project.gallery.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-pencil mb-6">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery.map((img, i) => (
                <WobblyCard
                  key={i}
                  decoration={i === 0 ? 'tape' : 'none'}
                  rotation={i % 2 === 0 ? -1 : 1}
                  hover={false}
                  tilt={false}
                  className="!p-0 overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`${project.title} gallery image ${i + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-56 md:h-64 object-cover"
                  />
                </WobblyCard>
              ))}
            </div>
          </div>
        )}

        {/* Tools */}
        {project.tools && project.tools.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-pencil mb-4 flex items-center gap-2">
              <Wrench className="w-6 h-6" strokeWidth={2.5} />
              Tools Used
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-4 py-2 wobbly border-3 border-pencil bg-white shadow-hard-sm font-[family-name:var(--font-patrick-var)] text-pencil text-lg"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back CTA */}
        <div className="text-center pt-8 border-t-2 border-dashed border-pencil/20">
          <WobblyButton href="/portfolio" variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={3} />
            Back to All Projects
          </WobblyButton>
        </div>
      </div>
    </div>
  );
}
