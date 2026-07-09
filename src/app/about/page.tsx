import React from 'react';
import AboutClient from '@/components/about/AboutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Vasu — Designer & Web Developer in Bhilwara',
  description: 'Learn about Vasudev Dhakar (Vasu), a freelance designer and full-stack web developer crafting beautiful, high-performance, and responsive websites in Bhilwara, Rajasthan, India.',
  keywords: [
    'About Vasu',
    'Vasudev Dhakar Biography',
    'Web Developer in Bhilwara Rajasthan',
    'UI UX Designer Bhilwara',
    'Freelancer Bhilwara',
    'Vasudev Dhakar Freelancer',
    'Designer Vasu'
  ],
  alternates: {
    canonical: 'https://vasu.design/about',
  },
  openGraph: {
    title: 'About Vasu — Designer & Web Developer in Bhilwara',
    description: 'Learn about Vasudev Dhakar (Vasu), a freelance designer and full-stack web developer in Rajasthan.',
    url: 'https://vasu.design/about',
    siteName: 'Vasu Portfolio',
    locale: 'en_IN',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Vasu — Designer & Web Developer in Bhilwara',
    description: 'Learn about Vasudev Dhakar (Vasu), a freelance designer and full-stack web developer in Rajasthan.',
    creator: '@VASUGAMER09',
  },
};

export default function AboutPage() {
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
        'name': 'About',
        'item': 'https://vasu.design/about'
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AboutClient />
    </>
  );
}
