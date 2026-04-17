import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://omegasir.com'; // Replace with your actual domain later

  // A core list of your public pages
  const routes = [
    '',
    '/about',
    '/services',
    '/projects',
    '/blog',
    '/careers',
    '/contact',
    '/faqs'
  ];

  const mapRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return mapRoutes;
}