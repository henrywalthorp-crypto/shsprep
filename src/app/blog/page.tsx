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
      slug: "shsat-score-calculator",
      title: "SHSAT Score Calculator 2026: Estimate Your Score & See Which Schools You'd Get Into",
      description: "Free SHSAT score calculator — enter your raw scores to estimate your scaled score and see which specialized high schools you'd qualify for.",
      keywords: ["SHSAT score calculator", "SHSAT scoring", "SHSAT cutoff scores"],
      category: "tools",
      author: "SHS Prep Team",
      publishedAt: "2026-02-18",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
      content: "",
    },
    {
      slug: "shsat-cutoff-scores-2026",
      title: "What Score Do You Need on the SHSAT? 2026 Cutoff Scores for Every School",
      description: "Complete guide to SHSAT cutoff scores for all 8 specialized high schools. Includes 2025 cutoffs, historical trends, and what you need to score.",
      keywords: ["SHSAT cutoff scores", "what score for Stuyvesant", "SHSAT score needed"],
      category: "test-prep",
      author: "SHS Prep Team",
      publishedAt: "2026-02-18",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
      content: "",
    },
    {
      slug: "how-to-study-for-the-shsat",
      title: "How to Study for the SHSAT: 10 Proven Strategies That Actually Work",
      description: "Master the SHSAT with 10 proven study strategies from top scorers. Includes study timelines, common mistakes, and expert tips.",
      keywords: ["how to study for SHSAT", "SHSAT study tips", "SHSAT preparation"],
      category: "test-prep",
      author: "SHS Prep Team",
      publishedAt: "2026-02-18",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
      content: "",
    },
    {
      slug: "shsat-ela-reading-comprehension-guide",
      title: "SHSAT ELA Reading Comprehension: How to Master the Hardest Section",
      description: "Master SHSAT reading comprehension with proven strategies for every question type. Tips for fiction, nonfiction, and poetry passages.",
      keywords: ["SHSAT reading comprehension", "SHSAT ELA tips", "SHSAT reading strategies"],
      category: "ela",
      author: "SHS Prep Team",
      publishedAt: "2026-02-18",
      readTime: "11 min read",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800",
      content: "",
    },
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

      {/* Pinned Score Calculator Card */}
      <section className="px-5 md:px-10 lg:px-20 mb-12">
        <div className="max-w-[1280px] mx-auto">
          <a href="/blog/shsat-score-calculator" className="block group">
            <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-[28px] p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-[#4F46E5]/10 hover:shadow-2xl hover:shadow-[#4F46E5]/20 transition-all">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">📌 Popular Tool</div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-2">SHSAT Score Calculator</h3>
                <p className="text-white/70 text-sm font-medium">Enter your raw scores to estimate your scaled score and see which specialized high schools you&apos;d qualify for. Includes 2025 cutoff scores for all 8 schools.</p>
              </div>
              <div className="bg-white text-[#4F46E5] px-6 py-3 rounded-xl font-black text-sm group-hover:bg-slate-100 transition-colors shrink-0">
                Try Calculator →
              </div>
            </div>
          </a>
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
