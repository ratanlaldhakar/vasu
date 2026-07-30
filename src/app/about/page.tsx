import React from 'react';
import AboutClient from '@/components/about/AboutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Vasudev Dhakar | Web Developer & UI Designer',
  description: 'Learn about Vasudev Dhakar (Vasu), freelance full stack web developer and UI/UX designer crafting high-performance Next.js websites in Bhilwara, Rajasthan, India.',
  keywords: [
    'About Vasudev Dhakar',
    'Vasudev Dhakar Biography',
    'Web Developer in Bhilwara Rajasthan',
    'UI UX Designer Bhilwara',
    'Freelancer Bhilwara',
    'Vasudev Dhakar Freelancer',
    'Designer Vasu',
    'Vasu Web Developer',
    'Full Stack Developer Rajasthan'
  ],
  alternates: {
    canonical: 'https://vasuu.bond/about',
  },
  openGraph: {
    title: 'About Vasudev Dhakar | Web Developer & UI Designer',
    description: 'Learn about Vasudev Dhakar (Vasu), freelance full stack web developer and UI/UX designer in Bhilwara, Rajasthan, India.',
    url: 'https://vasuu.bond/about',
    siteName: 'Vasudev Dhakar Portfolio',
    locale: 'en_IN',
    type: 'profile',
    images: [
      {
        url: 'https://vasuu.bond/icon.png',
        width: 512,
        height: 512,
        alt: 'About Vasudev Dhakar - Web Developer & UI Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Vasudev Dhakar | Web Developer & UI Designer',
    description: 'Learn about Vasudev Dhakar (Vasu), freelance full stack web developer and UI/UX designer in Rajasthan, India.',
    creator: '@VASUGAMER09',
    images: ['https://vasuu.bond/icon.png'],
  },
};

export default function AboutPage() {
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
          'name': 'About',
          'item': 'https://vasuu.bond/about'
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'About Vasudev Dhakar',
      'description': 'Learn about Vasudev Dhakar (Vasu), a freelance designer and full-stack web developer in Bhilwara, Rajasthan.',
      'url': 'https://vasuu.bond/about',
      'mainEntity': {
        '@type': 'Person',
        'name': 'Vasudev Dhakar',
        'alternateName': 'Vasu',
        'jobTitle': 'Full Stack Web Developer & UI/UX Designer',
        'url': 'https://vasuu.bond',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Bhilwara',
          'addressRegion': 'Rajasthan',
          'addressCountry': 'India'
        }
      }
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClient />
    </>
  );
}
