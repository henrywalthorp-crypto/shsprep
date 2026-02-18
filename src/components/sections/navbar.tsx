"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, X, Menu, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative w-full py-2.5 px-4 bg-mint text-deep-forest text-sm font-semibold text-center overflow-hidden"
          >
            <motion.span
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              🎓 Get ready for the 2026 SHSAT —{" "}
              <a href="/practice" className="underline hover:opacity-80 transition-opacity">
                Join our diagnostic test
              </a>{" "}
              today.
            </motion.span>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <div className="w-full px-5 md:px-10 lg:px-20 mt-4">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "mx-auto max-w-[1280px] rounded-[24px] border border-black/5 shadow-sm transition-all duration-500 glass",
            scrolled ? "py-3 translate-y-[-4px]" : "py-5"
          )}
        >
          <div className="flex items-center justify-between px-6 md:px-8">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center flex-shrink-0"
            >
              <a href="/" className="flex items-center gap-3">
                <div className="h-10 w-10 bg-deep-forest rounded-xl flex items-center justify-center text-mint font-bold text-xl shadow-lg shadow-deep-forest/10">
                  S
                </div>
                <span className="text-2xl font-bold text-deep-forest tracking-tight font-display">
                  SHS<span className="text-text-gray/60">prep</span>
                </span>
              </a>
            </motion.div>

            {/* Desktop Links */}
            <div className="hidden min-[1225px]:flex items-center space-x-1 text-sm font-semibold text-deep-forest">
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("courses")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-black/5 transition-colors group">
                  Courses <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", activeDropdown === "courses" && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {activeDropdown === "courses" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[640px]"
                    >
                      <div className="bg-white rounded-[28px] border border-black/5 shadow-2xl p-6 flex gap-4 overflow-hidden perspective-1000">
                        <motion.a
                          href="/courses/shsat-full"
                          whileHover={{ y: -5 }}
                          className="flex-1 p-6 rounded-[20px] bg-off-white hover:bg-muted transition-colors group/item"
                        >
                          <div className="w-12 h-12 bg-deep-forest rounded-xl mb-5 flex items-center justify-center shadow-md">
                            <div className="w-5 h-5 bg-mint rounded-full animate-pulse" />
                          </div>
                          <h4 className="font-bold text-lg mb-2 font-display">SHSAT Complete Prep</h4>
                          <p className="text-sm text-text-gray leading-relaxed mb-6">
                            Comprehensive curriculum covering ELA and Math with 20+ full-length practice exams.
                          </p>
                          <span className="text-xs font-bold flex items-center gap-1 text-deep-forest">
                            Explore Curriculum <ArrowRight className="w-3.5 h-3.5 group-hover/item:translate-x-1 transition-transform" />
                          </span>
                        </motion.a>
                        <motion.a
                          href="/practice"
                          whileHover={{ y: -5 }}
                          className="flex-1 p-6 rounded-[20px] bg-off-white hover:bg-pastel-purple/30 transition-colors group/item"
                        >
                          <div className="w-12 h-12 bg-deep-forest rounded-xl mb-5 flex items-center justify-center text-mint shadow-md">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                          </div>
                          <h4 className="font-bold text-lg mb-2 font-display">Practice Library</h4>
                          <p className="text-sm text-text-gray leading-relaxed mb-6">
                            Over 2,000 adaptive practice questions tailored to the latest SHSAT digital format.
                          </p>
                          <span className="text-xs font-bold flex items-center gap-1 text-deep-forest">
                            Start Practice <ArrowRight className="w-3.5 h-3.5 group-hover/item:translate-x-1 transition-transform" />
                          </span>
                        </motion.a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <a href="/pricing" className="px-4 py-2 rounded-full hover:bg-black/5 transition-colors">Pricing</a>
              <a href="/resources" className="px-4 py-2 rounded-full hover:bg-black/5 transition-colors">Resources</a>
              <a href="/blog" className="px-4 py-2 rounded-full hover:bg-black/5 transition-colors">Blog</a>
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("about")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-black/5 transition-colors">
                  About <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", activeDropdown === "about" && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {activeDropdown === "about" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 pt-4 w-60"
                    >
                      <div className="bg-white rounded-[24px] border border-black/5 shadow-2xl p-3 flex flex-col space-y-1">
                        {["Our Story", "Results", "NYC School Guide", "FAQ"].map((item) => (
                          <a
                            key={item}
                            href="#"
                            className="px-4 py-2.5 hover:bg-off-white rounded-xl transition-colors text-sm font-semibold"
                          >
                            {item}
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <a
                href="/sign-in"
                className="hidden min-[1225px]:block px-5 py-2.5 text-sm font-bold hover:opacity-70 transition-opacity"
              >
                Log In
              </a>
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden min-[1225px]:flex items-center gap-2 bg-deep-forest text-mint px-7 py-3 rounded-full text-sm font-bold shadow-xl shadow-deep-forest/10 hover:shadow-deep-forest/20 transition-all"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </motion.a>

              {/* Mobile Menu Toggle */}
              <button
                className="min-[1225px]:hidden p-3 hover:bg-black/5 rounded-full transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
                  {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </motion.div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="min-[1225px]:hidden mt-6 border-t border-black/5 pt-6 pb-10 px-6 max-h-[80vh] overflow-y-auto"
              >
                <ul className="flex flex-col space-y-2 mb-10">
                  <li>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === "courses" ? null : "courses")}
                      className="flex items-center justify-between w-full py-4 text-xl font-bold font-display"
                    >
                      Courses <ChevronDown className={cn("w-5 h-5 transition-transform", activeDropdown === "courses" && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === "courses" && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-4 pb-4 flex flex-col space-y-4"
                        >
                          <a href="#" className="text-text-gray font-semibold">SHSAT Complete Prep</a>
                          <a href="#" className="text-text-gray font-semibold">Practice Library</a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                  <li><a href="/pricing" className="block py-4 text-xl font-bold font-display border-b border-black/5">Pricing</a></li>
                  <li><a href="/resources" className="block py-4 text-xl font-bold font-display border-b border-black/5">Resources</a></li>
                  <li><a href="/blog" className="block py-4 text-xl font-bold font-display border-b border-black/5">Blog</a></li>
                  <li>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === "about" ? null : "about")}
                      className="flex items-center justify-between w-full py-4 text-xl font-bold font-display"
                    >
                      About <ChevronDown className={cn("w-5 h-5 transition-transform", activeDropdown === "about" && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === "about" && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-4 pb-4 flex flex-col space-y-4"
                        >
                          <a href="#" className="text-text-gray font-semibold">Our Story</a>
                          <a href="#" className="text-text-gray font-semibold">Results</a>
                          <a href="#" className="text-text-gray font-semibold">School Guide</a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                </ul>
                <div className="flex flex-col gap-4">
                  <motion.a
                    href="/sign-in"
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between w-full p-6 bg-pastel-purple/40 rounded-[24px] group"
                  >
                    <span className="text-xl font-bold font-display text-deep-forest">Log In</span>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </motion.a>
                  <motion.a
                    href="/signup"
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between w-full p-6 bg-mint rounded-[24px] group"
                  >
                    <span className="text-xl font-bold font-display text-deep-forest">Get Started</span>
                    <div className="w-12 h-12 bg-deep-forest text-mint rounded-full flex items-center justify-center shadow-md">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </header>
  );
};

export default Navbar;