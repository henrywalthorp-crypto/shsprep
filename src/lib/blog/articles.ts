import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  image: string;
  content: string;
}

function loadArticles(): BlogArticle[] {
  const contentDir = path.join(process.cwd(), "content/blog");
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title || "",
        description: data.description || "",
        keywords: data.keywords || [],
        category: data.category || "",
        author: data.author || "",
        publishedAt: data.publishedAt || "",
        readTime: data.readTime || "",
        image: data.image || "",
        content,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

let _cache: BlogArticle[] | null = null;

function getArticles(): BlogArticle[] {
  if (!_cache) _cache = loadArticles();
  return _cache;
}

export function getAllArticles(): BlogArticle[] {
  return getArticles();
}

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return getArticles().find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): BlogArticle[] {
  return getArticles().filter((a) => a.category === category);
}

export function getAllCategories(): string[] {
  const cats = new Set(getArticles().map((a) => a.category));
  return Array.from(cats);
}
