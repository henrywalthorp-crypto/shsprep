"use client";

import React, { useState } from "react";
import { Link as LinkIcon, Twitter, Check } from "lucide-react";

export default function ShareButtons({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = `https://shsprep.com/blog/${slug}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold text-text-gray">Share:</span>
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-off-white rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
      >
        <Twitter className="w-4 h-4 text-deep-forest" />
      </a>
      <button
        onClick={copyLink}
        className="w-10 h-10 bg-off-white rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <LinkIcon className="w-4 h-4 text-deep-forest" />
        )}
      </button>
    </div>
  );
}
