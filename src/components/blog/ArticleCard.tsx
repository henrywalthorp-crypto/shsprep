import React from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
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

export default function ArticleCard({ article }: { article: BlogArticle }) {
  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${article.slug}`}>
      <div className="group bg-white rounded-[28px] border border-black/5 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-deep-forest px-3 py-1 rounded-full text-xs font-bold">
              {categoryLabels[article.category] || article.category}
            </span>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-lg font-black text-deep-forest mb-2 group-hover:text-deep-forest/80 transition-colors font-display line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-text-gray mb-4 line-clamp-2 flex-1">
            {article.description}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-black/5">
            <div className="text-xs text-text-gray">{date}</div>
            <div className="flex items-center gap-1 text-xs text-text-gray">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
