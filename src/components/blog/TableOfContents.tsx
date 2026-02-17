"use client";

import React, { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const headings: TocItem[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const text = match[2].replace(/\*\*/g, "");
      headings.push({
        id: text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
        text,
        level: match[1].length,
      });
    }
  }
  return headings;
}

export default function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-32">
      <h4 className="text-sm font-black text-deep-forest uppercase tracking-wider mb-4">
        Table of Contents
      </h4>
      <ul className="space-y-2 border-l-2 border-black/10">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block text-sm py-1 transition-colors ${
                h.level === 3 ? "pl-6" : "pl-4"
              } ${
                activeId === h.id
                  ? "text-deep-forest font-bold border-l-2 border-deep-forest -ml-[2px]"
                  : "text-text-gray hover:text-deep-forest"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
