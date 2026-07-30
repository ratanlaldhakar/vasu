import { SectionHeading } from "@/components/ui/SectionHeading";
import { PortfolioFilterList } from "@/components/portfolio/PortfolioFilterList";
import { getProjects } from "@/lib/db";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Websites Designed by Vasudev Dhakar",
  description: "Browse web design and Next.js development case studies by Vasudev Dhakar (Vasu). High-performance websites & UI/UX designs built in Bhilwara, Rajasthan, India.",
  keywords: [
    "Vasudev Dhakar Projects",
    "Web Developer Portfolio Bhilwara",
    "Design Portfolio Vasu",
    "Next.js Project Case Studies",
    "UI UX Designer Projects Rajasthan",
    "Vasudev Dhakar Portfolio",
    "Website Developer Portfolio India"
  ],
  alternates: {
    canonical: "https://vasuu.bond/portfolio",
  },
  openGraph: {
    title: "Portfolio | Websites Designed by Vasudev Dhakar",
    description: "Browse web design and Next.js development case studies by Vasudev Dhakar (Vasu). High-performance websites built in Bhilwara, Rajasthan.",
    url: "https://vasuu.bond/portfolio",
    siteName: "Vasudev Dhakar Portfolio",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://vasuu.bond/icon.png",
        width: 512,
        height: 512,
        alt: "Vasudev Dhakar Web Development & Design Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Websites Designed by Vasudev Dhakar",
    description: "Browse web design and Next.js development case studies by Vasudev Dhakar (Vasu).",
    creator: "@VASUGAMER09",
    images: ["https://vasuu.bond/icon.png"],
  },
};

export default async function PortfolioPage() {
  const projects = await getProjects();

  const jsonLd = [
    {
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
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Vasudev Dhakar Design & Web Development Portfolio',
      'description': 'A collection of web development projects, Next.js web applications, and UI/UX case studies designed by Vasudev Dhakar in Bhilwara, Rajasthan.',
      'url': 'https://vasuu.bond/portfolio',
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': projects.map((p, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': p.title,
          'url': `https://vasuu.bond/portfolio/${p.slug}`
        }))
      }
    }
  ];

  return (
    <div className="py-16 md:py-24 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-6xl mx-auto">
        <SectionHeading subtitle="A collection of my recent design and development work" as="h1">
          My Portfolio
          <span className="sr-only"> — Web Development &amp; UI/UX Design Projects by Vasudev Dhakar</span>
        </SectionHeading>

        <PortfolioFilterList projects={projects} />
      </div>
    </div>
  );
}
