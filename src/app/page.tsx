import Navbar from "@/components/sections/navbar";
import HeroSection from "@/components/sections/hero";
import TrustedBy from "@/components/sections/trusted-by";
import DigitalTransition from "@/components/sections/digital-transition";
import AnyOpenModels from "@/components/sections/any-open-models";
import TailoredOptimization from "@/components/sections/tailored-optimization";
import PathToProduction from "@/components/sections/path-to-production";
import Enterprise from "@/components/sections/enterprise";
import Testimonials from "@/components/sections/testimonials";
import BlogPreview from "@/components/sections/blog-preview";
import PricingSection from "@/components/landing/PricingSection";
import CTABottom from "@/components/sections/cta-bottom";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        <HeroSection />
        <TrustedBy />
        <DigitalTransition />
        <AnyOpenModels />
        <TailoredOptimization />
        <PathToProduction />
        <Enterprise />
        <Testimonials />
        <PricingSection />
        <BlogPreview />
        <CTABottom />
      </main>
      <Footer />
    </div>
  );
}
