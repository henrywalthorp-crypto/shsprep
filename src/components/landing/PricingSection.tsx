"use client";

import React from "react";
import { PricingCards } from "@/components/billing/PricingCards";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

const FAQ_ITEMS = [
  { q: "Can I cancel anytime?", a: "Yes! You can cancel your subscription directly from your dashboard. No questions asked." },
  { q: "When does my subscription expire?", a: "All subscriptions run through December 31st of the current year, right through exam season." },
  { q: "Do you offer refunds?", a: "Absolutely. We offer a 7-day money-back guarantee on all plans." },
  { q: "Can parents track multiple students?", a: "A family plan supporting up to 3 students is coming soon!" },
];

export default function PricingSection() {
  const router = useRouter();

  const handleSelect = (plan: "monthly" | "annual") => {
    router.push(`/signup/paywall?plan=${plan}`);
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-deep-forest font-display mb-4">
            Simple, Affordable Pricing
          </h2>
          <p className="text-lg text-slate-400 font-medium">
            Unlimited access through exam season
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <PricingCards onSelect={handleSelect} />
        </div>

        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-black text-deep-forest mb-6 text-center">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-white border border-slate-100 rounded-2xl px-6 overflow-hidden">
                <AccordionTrigger className="text-sm font-bold text-deep-forest hover:no-underline py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-400 pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
