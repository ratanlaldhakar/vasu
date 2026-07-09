import React from 'react';
import HomeClient from '@/components/home/HomeClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vasu — Web Developer & UI/UX Designer in Bhilwara, Rajasthan',
  description: 'Looking for a professional Web Developer in Bhilwara? Vasudev Dhakar (Vasu) specializes in Next.js, React, custom portfolio designs, and high-performance business websites in Rajasthan, India.',
  keywords: [
    'Website Developer in Bhilwara',
    'Web Developer Bhilwara',
    'Portfolio Website Developer Bhilwara',
    'Freelance Web Developer Bhilwara',
    'Next.js Developer Bhilwara',
    'Frontend Developer Bhilwara',
    'UI UX Designer Bhilwara',
    'Web Designer Bhilwara',
    'Website Designer Bhilwara',
    'React Developer Bhilwara',
    'TypeScript Developer Bhilwara',
    'Tailwind CSS Developer',
    'Freelance Developer Rajasthan',
    'Personal Portfolio Developer',
    'Vasudev Dhakar',
    'Vasu',
    'Designer Vasu',
    'Vasu Developer',
    'Vasudev Dhakar Web Developer',
    'Vasudev Dhakar Portfolio'
  ],
  alternates: {
    canonical: 'https://vasu.design',
  },
  openGraph: {
    title: 'Vasu — Web Developer & UI/UX Designer in Bhilwara, Rajasthan',
    description: 'Looking for a professional Web Developer in Bhilwara? Vasudev Dhakar (Vasu) specializes in Next.js, React, and premium UI/UX design.',
    url: 'https://vasu.design',
    siteName: 'Vasu Portfolio',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vasu — Web Developer & UI/UX Designer in Bhilwara',
    description: 'Looking for a professional Web Developer in Bhilwara? Vasudev Dhakar (Vasu) specializes in Next.js, React, and premium UI/UX design.',
    creator: '@VASUGAMER09',
  },
};

export default function HomePage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'Vasudev Dhakar',
      'alternateName': 'Vasu',
      'jobTitle': 'Freelance Web Developer & UI/UX Designer',
      'url': 'https://vasu.design',
      'image': 'https://vasu.design/icon.png',
      'description': 'Freelance web developer specializing in modern websites, premium UI/UX design, responsive development, and high-performance Next.js/React web applications in Bhilwara, Rajasthan, India.',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Bhilwara',
        'addressRegion': 'Rajasthan',
        'addressCountry': 'India'
      },
      'sameAs': [
        'https://github.com/ratanlaldhakar',
        'https://x.com/VASUGAMER09',
        'https://instagram.com/riskyvasu',
        'https://linkedin.com',
        'https://youtube.com'
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Vasu Portfolio',
      'url': 'https://vasu.design',
      'publisher': {
        '@type': 'Person',
        'name': 'Vasudev Dhakar'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      'name': 'Vasudev Dhakar Freelance Web Developer',
      'image': 'https://vasu.design/icon.png',
      'url': 'https://vasu.design',
      'telephone': '+918888888888',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Bhilwara',
        'addressLocality': 'Bhilwara',
        'addressRegion': 'Rajasthan',
        'postalCode': '311001',
        'addressCountry': 'India'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '25.3407',
        'longitude': '74.6367'
      },
      'openingHoursSpecification': {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ],
        'opens': '09:00',
        'closes': '19:00'
      },
      'priceRange': '$$'
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
