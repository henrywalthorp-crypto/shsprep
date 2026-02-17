"use client";

import React, { useState, useMemo } from "react";
import { Search, BookOpen } from "lucide-react";
import Navbar from "@/components/sections/navbar";
import Footer from "@/components/sections/footer";
import ArticleCard from "@/components/blog/ArticleCard";
import CategoryFilter from "@/components/blog/CategoryFilter";
import type { BlogArticle } from "@/lib/blog/articles";

// Static import of article data at build time won't work in "use client",
// so we inline the data. We use a server component wrapper instead.
// Actually, let's make this a hybrid: server component for data, client for interactivity.

export default function BlogPage() {
  return <BlogIndex />;
}

function BlogIndex() {
  // We'll fetch articles via a separate mechanism. For client component,
  // we embed them. But since we need fs access, let's restructure.
  // Actually the simplest approach: make a BlogPageClient that receives articles as props.
  // But this file is already the page. Let's use a different approach.
  // We'll create a static JSON at build time. For now, hardcode from the markdown frontmatter.
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <BlogContent />
      </main>
      <Footer />
    </div>
  );
}

function BlogContent() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Hardcoded articles matching our markdown files
  const articles: BlogArticle[] = [
    {
      slug: "parent-guide-shsat-registration-2026",
      title: "Parent's Guide to SHSAT Registration & Preparation (2026)",
      description: "Everything parents need to know about registering for the 2026 SHSAT, supporting your child's preparation, and navigating the specialized high school admissions process.",
      keywords: ["SHSAT registration", "parent guide", "specialized high schools NYC"],
      category: "parent-resources",
      author: "Dr. Lisa Wong",
      publishedAt: "2026-02-05",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&q=80&w=800",
      content: "",
    },
    {
      slug: "shsat-math-2026-study-guide",
      title: "SHSAT Math 2026: The Complete Study Guide",
      description: "Master every math topic on the 2026 SHSAT with our comprehensive study guide. Covers algebra, geometry, statistics, and proven problem-solving strategies.",
      keywords: ["SHSAT math", "math study guide", "SHSAT 2026"],
      category: "math",
      author: "Michael Rodriguez",
      publishedAt: "2026-01-22",
      readTime: "15 min read",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
      content: "",
    },
    {
      slug: "2026-shsat-adaptive-changes",
      title: "2026 SHSAT Changes: What's New and How to Prepare",
      description: "The 2026 SHSAT introduces several key changes. Learn what's different, how it affects your preparation strategy, and what top-scoring students are doing to adapt.",
      keywords: ["SHSAT 2026", "SHSAT changes", "test prep"],
      category: "test-prep",
      author: "Dr. Sarah Chen",
      publishedAt: "2026-01-15",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1434031211128-a39118a7ae3f?auto=format&fit=crop&q=80&w=800",
      content: "",
    },
  ];

  const categories = [...new Set(articles.map((a) => a.category))];

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesCat = activeCategory === "all" || a.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <>
      {/* Hero */}
      <section className="px-5 md:px-10 lg:px-20 mb-16">
        <div className="max-w-[1280px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-mint/30 text-deep-forest px-4 py-2 rounded-full text-sm font-bold mb-6">
            <BookOpen className="w-4 h-4" />
            Blog
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-deep-forest mb-6 font-display">
            SHSAT Prep Blog
          </h1>
          <p className="text-lg text-text-gray max-w-2xl mx-auto mb-10">
            Expert guides, tips, and strategies for the 2026 SHSAT
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-off-white rounded-2xl border border-black/5 focus:ring-2 focus:ring-deep-forest/20 focus:border-transparent text-deep-forest font-medium"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-5 md:px-10 lg:px-20 mb-12">
        <div className="max-w-[1280px] mx-auto">
          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Grid */}
      <section className="px-5 md:px-10 lg:px-20">
        <div className="max-w-[1280px] mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-off-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-text-gray" />
              </div>
              <h3 className="text-xl font-bold text-deep-forest mb-2">No articles found</h3>
              <p className="text-text-gray">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
