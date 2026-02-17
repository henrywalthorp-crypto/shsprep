"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/sections/navbar";
import Footer from "@/components/sections/footer";
import ArticleContent from "@/components/blog/ArticleContent";
import TableOfContents from "@/components/blog/TableOfContents";
import ArticleCTA from "@/components/blog/ArticleCTA";
import ShareButtons from "@/components/blog/ShareButtons";
import ArticleCard from "@/components/blog/ArticleCard";
import type { BlogArticle } from "@/lib/blog/articles";

const categoryLabels: Record<string, string> = {
  "test-prep": "Test Prep",
  math: "Math Strategies",
  ela: "ELA & Reading",
  "study-tips": "Study Tips",
  "school-guides": "School Guides",
  "parent-resources": "For Parents",
  "success-stories": "Success Stories",
};

export default function BlogArticlePage({
  article,
  relatedArticles,
}: {
  article: BlogArticle;
  relatedArticles: BlogArticle[];
}) {
  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const initials = article.author
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        {/* Back Link */}
        <section className="px-5 md:px-10 lg:px-20 mb-8">
          <div className="max-w-[1100px] mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-text-gray hover:text-deep-forest transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </section>

        {/* Header */}
        <section className="px-5 md:px-10 lg:px-20 mb-10">
          <div className="max-w-[900px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block bg-mint text-deep-forest px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                {categoryLabels[article.category] || article.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-deep-forest mb-6 font-display leading-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-deep-forest rounded-full flex items-center justify-center text-mint font-bold">
                    {initials}
                  </div>
                  <div>
                    <div className="font-bold text-deep-forest">
                      {article.author}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-gray">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {article.readTime}
                  </div>
                </div>
              </div>
              <ShareButtons title={article.title} slug={article.slug} />
            </motion.div>
          </div>
        </section>

        {/* Hero Image */}
        <section className="px-5 md:px-10 lg:px-20 mb-12">
          <div className="max-w-[1100px] mx-auto">
            <div className="rounded-[32px] overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-[300px] md:h-[450px] object-cover"
              />
            </div>
          </div>
        </section>

        {/* Content + TOC */}
        <section className="px-5 md:px-10 lg:px-20 mb-16">
          <div className="max-w-[1100px] mx-auto flex gap-12">
            <div className="flex-1 max-w-[750px]">
              <ArticleContent content={article.content} />
            </div>
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <TableOfContents content={article.content} />
            </aside>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 md:px-10 lg:px-20 mb-16">
          <div className="max-w-[900px] mx-auto">
            <ArticleCTA />
          </div>
        </section>

        {/* Related */}
        {relatedArticles.length > 0 && (
          <section className="px-5 md:px-10 lg:px-20">
            <div className="max-w-[1100px] mx-auto">
              <h2 className="text-2xl font-black text-deep-forest mb-8 font-display">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
