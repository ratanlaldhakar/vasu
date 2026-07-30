import React from 'react';
import HomeClient from '@/components/home/HomeClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vasudev Dhakar | Full Stack Web Developer & UI/UX Designer in Bhilwara',
  description: 'Looking for a top Web Developer in Bhilwara? Vasudev Dhakar (Vasu) crafts Next.js web applications, custom responsive websites, and premium UI/UX design in Rajasthan, India.',
  keywords: [
    'Vasudev Dhakar',
    'Vasu dev dhakar',
    'Vasu Developer',
    'Vasu Web Developer',
    'Vasu UI Designer',
    'Vasu Portfolio',
    'Website Developer Bhilwara',
    'Web Developer Bhilwara',
    'UI UX Designer Bhilwara',
    'Freelance Web Developer Rajasthan',
    'Portfolio Developer India',
    'React Developer Bhilwara',
    'Next.js Developer Rajasthan',
    'Frontend Developer Bhilwara',
    'Website Designer Bhilwara',
    'Web Designer Bhilwara',
    'Tailwind CSS Developer',
    'TypeScript Developer Bhilwara',
    'Responsive Website Development'
  ],
  alternates: {
    canonical: 'https://vasuu.bond',
  },
  openGraph: {
    title: 'Vasudev Dhakar | Full Stack Web Developer & UI/UX Designer in Bhilwara',
    description: 'Looking for a top Web Developer in Bhilwara? Vasudev Dhakar (Vasu) specializes in Next.js, React, and premium UI/UX design in Rajasthan, India.',
    url: 'https://vasuu.bond',
    siteName: 'Vasudev Dhakar Portfolio',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://vasuu.bond/icon.png',
        width: 512,
        height: 512,
        alt: 'Vasudev Dhakar - Full Stack Web Developer & UI/UX Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vasudev Dhakar | Full Stack Web Developer & UI/UX Designer in Bhilwara',
    description: 'Looking for a top Web Developer in Bhilwara? Vasudev Dhakar (Vasu) specializes in Next.js, React, and premium UI/UX design.',
    creator: '@VASUGAMER09',
    images: ['https://vasuu.bond/icon.png'],
  },
};

export default function HomePage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'Vasudev Dhakar',
      'alternateName': ['Vasu', 'Vasu Developer', 'Vasu Web Developer', 'Vasu UI Designer'],
      'jobTitle': 'Full Stack Web Developer & UI/UX Designer',
      'url': 'https://vasuu.bond',
      'image': 'https://vasuu.bond/icon.png',
      'email': 'vasu@amrityogacenter.in',
      'telephone': '+917742658593',
      'description': 'Full Stack Web Developer and UI/UX Designer specializing in modern high-performance Next.js websites, React applications, and responsive digital experiences in Bhilwara, Rajasthan, India.',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Bhilwara',
        'addressRegion': 'Rajasthan',
        'postalCode': '311001',
        'addressCountry': 'India'
      },
      'knowsAbout': [
        'Web Development',
        'UI/UX Design',
        'Next.js',
        'React',
        'Frontend Development',
        'Tailwind CSS',
        'TypeScript',
        'SEO Optimization',
        'Responsive Design'
      ],
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
      'name': 'Vasudev Dhakar Portfolio',
      'alternateName': 'Vasu Web Developer Portfolio',
      'url': 'https://vasuu.bond',
      'inLanguage': 'en-IN',
      'publisher': {
        '@type': 'Person',
        'name': 'Vasudev Dhakar'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Vasudev Dhakar Web Development',
      'url': 'https://vasuu.bond',
      'logo': 'https://vasuu.bond/icon.png',
      'founder': {
        '@type': 'Person',
        'name': 'Vasudev Dhakar'
      },
      'sameAs': [
        'https://github.com/ratanlaldhakar',
        'https://x.com/VASUGAMER09',
        'https://instagram.com/riskyvasu'
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      'name': 'Vasudev Dhakar Web Development & UI/UX Design',
      'image': 'https://vasuu.bond/icon.png',
      'url': 'https://vasuu.bond',
      'telephone': '+917742658593',
      'email': 'vasu@amrityogacenter.in',
      'priceRange': '$$',
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
      'areaServed': ['Bhilwara', 'Rajasthan', 'India', 'Worldwide'],
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
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'How much does a custom website cost in Bhilwara?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Website development costs depend on project complexity, design requirements, and features. Basic business landing pages start at $299 (₹15,000), while full-featured custom Next.js web applications range between $599 and $1,499.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How long does website development take?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Standard landing pages and portfolio websites are completed within 1 to 2 weeks. Comprehensive custom web applications usually take 2 to 4 weeks from initial concept to launch.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Why choose Vasudev Dhakar for web development?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Vasudev Dhakar (Vasu) combines pixel-perfect UI/UX design with high-performance Next.js and React frontend engineering, mobile responsiveness, fast loading speeds, and enterprise-grade SEO optimization.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Do you work remotely with clients outside Rajasthan or India?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes! Vasu works with clients locally in Bhilwara, across Rajasthan and India, as well as international clients worldwide via seamless remote communication and project management.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Can you redesign existing websites for better speed and SEO?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Absolutely. Existing websites can be upgraded to modern Next.js architectures with improved speed scores, responsive UI/UX, and technical SEO structure to boost Google Search rankings.'
          }
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Vasudev Dhakar | Full Stack Web Developer & UI/UX Designer in Bhilwara',
      'description': 'Official portfolio and services website of Vasudev Dhakar (Vasu), full stack web developer in Bhilwara, Rajasthan.',
      'url': 'https://vasuu.bond'
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
