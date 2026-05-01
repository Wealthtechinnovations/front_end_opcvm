import { MetadataRoute } from 'next';
import { urlsite } from './constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/panel/', '/api/'],
      },
    ],
    sitemap: `${urlsite}/sitemap.xml`,
  };
}
