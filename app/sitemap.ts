import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://powerhousefitnessclub.vercel.app';
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
}
