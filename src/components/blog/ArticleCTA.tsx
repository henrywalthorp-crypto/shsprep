import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ArticleCTA() {
  return (
    <div className="bg-deep-forest rounded-[32px] p-10 md:p-14 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-mint/10 rounded-full -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-52 h-52 bg-mint/5 rounded-full -ml-26 -mb-26" />
      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-3 font-display">
          Ready to start practicing?
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          Join SHS Prep today and get access to adaptive practice tests, personalized study plans, and expert strategies.
        </p>
        <Link
          href="/signup/student"
          className="inline-flex items-center gap-2 bg-mint text-deep-forest px-8 py-4 rounded-xl font-black hover:bg-mint/90 transition-colors"
        >
          Join SHS Prep
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
