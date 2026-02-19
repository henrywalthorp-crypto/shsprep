"use client";

import { useEffect, useState } from "react";
import { PageLoader } from "./PageLoader";

/**
 * Shows the branded loading screen on initial page load,
 * then plays the curtain-lift exit animation.
 */
export function AppLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for the page to be interactive, then dismiss
    const dismiss = () => setLoading(false);

    if (document.readyState === "complete") {
      // Already loaded — short delay so users see the branding briefly
      setTimeout(dismiss, 400);
    } else {
      window.addEventListener("load", () => setTimeout(dismiss, 300));
    }

    // Safety fallback — never show loader for more than 3s
    const fallback = setTimeout(dismiss, 3000);
    return () => clearTimeout(fallback);
  }, []);

  return <PageLoader loading={loading} />;
}
