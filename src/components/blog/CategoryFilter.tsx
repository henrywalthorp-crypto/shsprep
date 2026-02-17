"use client";

import React from "react";

const categoryLabels: Record<string, string> = {
  all: "All Posts",
  "test-prep": "Test Prep",
  math: "Math Strategies",
  ela: "ELA & Reading",
  "study-tips": "Study Tips",
  "school-guides": "School Guides",
  "parent-resources": "For Parents",
  "success-stories": "Success Stories",
};

export default function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}) {
  const allCats = ["all", ...categories];
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {allCats.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
            active === cat
              ? "bg-deep-forest text-mint"
              : "bg-off-white text-text-gray hover:bg-black/5"
          }`}
        >
          {categoryLabels[cat] || cat}
        </button>
      ))}
    </div>
  );
}
