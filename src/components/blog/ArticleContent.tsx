"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

export default function ArticleContent({ content }: { content: string }) {
  return (
    <div className="article-content prose prose-lg max-w-none">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2
              id={String(children).toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}
              className="text-[1.75rem] font-black text-[#0F172A] mt-12 mb-5 font-display"
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              id={String(children).toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}
              className="text-[1.375rem] font-extrabold text-[#0F172A] mt-8 mb-4"
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-[1.125rem] leading-[1.8] text-gray-700 mb-6">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-6 pl-6 space-y-2 text-[1.125rem] leading-[1.8] text-gray-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-6 pl-6 space-y-2 list-decimal text-[1.125rem] leading-[1.8] text-gray-700">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => (
            <strong className="text-[#0F172A] font-semibold">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#D6FF62] bg-[#F0FDF4] pl-6 py-4 pr-4 rounded-r-xl mb-6 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-10 border-black/10" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
