"use client";

import React, { useMemo } from "react";
import katex from "katex";

/**
 * Renders a string that may contain LaTeX math delimiters.
 * - $...$ for inline math
 * - $$...$$ for block/display math
 * - Plain text passes through unchanged
 * - Malformed LaTeX falls back to raw text
 */
export function MathText({ children, className }: { children: string; className?: string }) {
  const rendered = useMemo(() => {
    if (!children || typeof children !== "string") return "";
    return renderMathInText(children);
  }, [children]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}

/**
 * Block-level version for display math or multi-line content.
 */
export function MathBlock({ children, className }: { children: string; className?: string }) {
  const rendered = useMemo(() => {
    if (!children || typeof children !== "string") return "";
    return renderMathInText(children);
  }, [children]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}

// ── Core rendering ──────────────────────────────────────────────────────────

const BLOCK_REGEX = /\$\$([\s\S]+?)\$\$/g;
const INLINE_REGEX = /\$([^\$\n]+?)\$/g;

function renderMathInText(text: string): string {
  // First pass: block math ($$...$$)
  let result = text.replace(BLOCK_REGEX, (_match, tex) => {
    return renderKatex(tex.trim(), true);
  });

  // Second pass: inline math ($...$)
  result = result.replace(INLINE_REGEX, (_match, tex) => {
    return renderKatex(tex.trim(), false);
  });

  return result;
}

function renderKatex(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      errorColor: "#ef4444",
      trust: true,
      strict: false,
    });
  } catch {
    // Fallback: show raw LaTeX in a code-like format
    return `<code class="text-red-500">${escapeHtml(tex)}</code>`;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
