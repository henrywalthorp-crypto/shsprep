import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://shsprep.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://shsprep.com/sign-in', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://shsprep.com/signup', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://shsprep.com/signup/student', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://shsprep.com/signup/parent', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://shsprep.com/resources', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]
}
