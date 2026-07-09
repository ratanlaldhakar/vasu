import { MetadataRoute } from 'next';
import { getProjects } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vasu.design';

  // Base routes configuration
  const routes = ['', '/about', '/contact', '/portfolio'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Fetch all dynamic portfolio projects and add to sitemap
  try {
    const projects = await getProjects();
    const projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/portfolio/${project.slug}`,
      lastModified: new Date(project.createdAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
    return [...routes, ...projectRoutes];
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error);
    return routes;
  }
}
