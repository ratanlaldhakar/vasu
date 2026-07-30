import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vasudev Dhakar | Full Stack Web Developer & UI/UX Designer',
    short_name: 'Vasu Portfolio',
    description: 'Portfolio of Vasudev Dhakar (Vasu), Freelance Web Developer and UI/UX Designer in Bhilwara, Rajasthan, India.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#050505',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
