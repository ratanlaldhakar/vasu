import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/dashboard/',
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
      ],
    },
    sitemap: 'https://vasuu.bond/sitemap.xml',
  };
}
