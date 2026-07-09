import { SectionHeading } from "@/components/ui/SectionHeading";
import { PortfolioFilterList } from "@/components/portfolio/PortfolioFilterList";
import { getProjects } from "@/lib/db";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vasu's Work — Design & Web Development Portfolio",
  description: "Browse web design and development case studies by Vasu (Vasudev Dhakar). High-performance websites, React applications, and premium UI/UX designs built in Bhilwara, Rajasthan, India.",
  keywords: [
    "Vasudev Dhakar Projects",
    "Web Developer Portfolio Bhilwara",
    "Design Portfolio Vasu",
    "Next.js Project Case Studies",
    "UI UX Designer Projects Rajasthan"
  ],
  alternates: {
    canonical: "https://vasu.design/portfolio",
  },
  openGraph: {
    title: "Vasu's Work — Design & Web Development Portfolio",
    description: "Browse web design and development case studies by Vasu (Vasudev Dhakar).",
    url: "https://vasu.design/portfolio",
    siteName: "Vasu Portfolio",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vasu's Work — Design & Web Development Portfolio",
    description: "Browse web design and development case studies by Vasu.",
    creator: "@VASUGAMER09",
  },
};

export default async function PortfolioPage() {
  const projects = await getProjects();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://vasu.design'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Portfolio',
        'item': 'https://vasu.design/portfolio'
      }
    ]
  };

  return (
    <div className="py-16 md:py-24 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-6xl mx-auto">
        <SectionHeading subtitle="A collection of my recent design and development work">
          My Portfolio
        </SectionHeading>

        <PortfolioFilterList projects={projects} />
      </div>
    </div>
  );
}
