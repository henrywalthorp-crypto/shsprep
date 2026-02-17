import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/blog/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  const blogEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `https://shsprep.com/blog/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    { url: 'https://shsprep.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://shsprep.com/sign-in', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://shsprep.com/signup', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://shsprep.com/signup/student', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://shsprep.com/signup/parent', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://shsprep.com/resources', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://shsprep.com/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...blogEntries,
  ]
}
