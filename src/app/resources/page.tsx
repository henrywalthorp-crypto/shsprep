"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/sections/navbar";
import Footer from "@/components/sections/footer";
import { 
  Search, 
  Clock, 
  ArrowRight, 
  BookOpen,
  Calculator,
  Brain,
  GraduationCap,
  TrendingUp,
  Users,
  Lightbulb
} from "lucide-react";

const categories = [
  { id: "all", label: "All Posts", icon: BookOpen },
  { id: "study-tips", label: "Study Tips", icon: Lightbulb },
  { id: "math", label: "Math Strategies", icon: Calculator },
  { id: "ela", label: "ELA & Reading", icon: BookOpen },
  { id: "test-prep", label: "Test Prep", icon: Brain },
  { id: "school-guides", label: "School Guides", icon: GraduationCap },
  { id: "success-stories", label: "Success Stories", icon: TrendingUp },
  { id: "parent-resources", label: "For Parents", icon: Users },
];

const blogPosts = [
  {
    id: "ultimate-shsat-study-guide-2024",
    title: "The Ultimate SHSAT Study Guide for 2024",
    excerpt: "Everything you need to know about preparing for the SHSAT, from understanding the test format to creating an effective study schedule that actually works.",
    category: "study-tips",
    author: "Dr. Sarah Chen",
    authorRole: "Head of Curriculum",
    date: "November 15, 2024",
    readTime: "12 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop"
  },
  {
    id: "top-10-math-mistakes",
    title: "Top 10 Math Mistakes SHSAT Students Make (And How to Avoid Them)",
    excerpt: "Common algebraic errors, geometry misconceptions, and calculation mistakes that cost students points—plus proven strategies to overcome each one.",
    category: "math",
    author: "Michael Rodriguez",
    authorRole: "Math Specialist",
    date: "November 12, 2024",
    readTime: "8 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=500&fit=crop"
  },
  {
    id: "reading-comprehension-secrets",
    title: "5 Reading Comprehension Secrets Top Scorers Use",
    excerpt: "Learn the annotation techniques, passage-mapping strategies, and time management tips that helped our students improve their ELA scores by 50+ points.",
    category: "ela",
    author: "Jennifer Park",
    authorRole: "ELA Instructor",
    date: "November 8, 2024",
    readTime: "10 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=500&fit=crop"
  },
  {
    id: "stuyvesant-vs-bronx-science",
    title: "Stuyvesant vs. Bronx Science: Which School Is Right for You?",
    excerpt: "A comprehensive comparison of NYC's top two specialized high schools, including culture, programs, extracurriculars, and what current students say.",
    category: "school-guides",
    author: "Alex Thompson",
    authorRole: "Admissions Advisor",
    date: "November 5, 2024",
    readTime: "15 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=500&fit=crop"
  },
  {
    id: "from-450-to-580",
    title: "From 450 to 580: How Maria Transformed Her SHSAT Score in 3 Months",
    excerpt: "Maria shares her journey from struggling student to Stuyvesant acceptance, including the study habits and mindset shifts that made the difference.",
    category: "success-stories",
    author: "Maria Santos",
    authorRole: "SHSprep Student",
    date: "November 1, 2024",
    readTime: "7 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop"
  },
  {
    id: "test-day-checklist",
    title: "The Complete SHSAT Test Day Checklist",
    excerpt: "What to bring, what to eat, when to arrive, and how to stay calm. Everything your child needs to perform their best on exam day.",
    category: "test-prep",
    author: "Dr. Sarah Chen",
    authorRole: "Head of Curriculum",
    date: "October 28, 2024",
    readTime: "6 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop"
  },
  {
    id: "parent-guide-supporting-child",
    title: "A Parent's Guide to Supporting Your Child Through SHSAT Prep",
    excerpt: "How to create a supportive environment, manage stress, and help your child succeed without adding pressure. Advice from child psychologists and educators.",
    category: "parent-resources",
    author: "Dr. Lisa Wong",
    authorRole: "Educational Psychologist",
    date: "October 25, 2024",
    readTime: "11 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&h=500&fit=crop"
  },
  {
    id: "algebra-word-problems",
    title: "Mastering Algebra Word Problems: A Step-by-Step Approach",
    excerpt: "The TRANSLATE method for turning confusing word problems into simple equations. Includes 15 practice problems with detailed solutions.",
    category: "math",
    author: "Michael Rodriguez",
    authorRole: "Math Specialist",
    date: "October 20, 2024",
    readTime: "14 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&h=500&fit=crop"
  },
  {
    id: "grammar-rules-must-know",
    title: "15 Grammar Rules Every SHSAT Student Must Know",
    excerpt: "From subject-verb agreement to parallel structure, these are the grammar concepts that appear most frequently on the SHSAT—with examples and practice.",
    category: "ela",
    author: "Jennifer Park",
    authorRole: "ELA Instructor",
    date: "October 15, 2024",
    readTime: "9 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&h=500&fit=crop"
  }
];

const ResourcesPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        {/* Hero Section */}
        <section className="px-5 md:px-10 lg:px-20 mb-16">
          <div className="max-w-[1280px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-mint/30 text-deep-forest px-4 py-2 rounded-full text-sm font-bold mb-6"
            >
              <BookOpen className="w-4 h-4" />
              Resources & Blog
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-deep-forest mb-6 font-display"
            >
              Expert SHSAT Tips & Guides
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-text-gray max-w-2xl mx-auto mb-10"
            >
              Study strategies, school guides, success stories, and everything you need to ace the SHSAT and get into your dream school.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-xl mx-auto relative"
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-off-white rounded-2xl border border-black/5 focus:ring-2 focus:ring-deep-forest/20 focus:border-transparent text-deep-forest font-medium"
              />
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="px-5 md:px-10 lg:px-20 mb-12">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
                    activeCategory === category.id
                      ? "bg-deep-forest text-mint"
                      : "bg-off-white text-text-gray hover:bg-black/5"
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && activeCategory === "all" && !searchQuery && (
          <section className="px-5 md:px-10 lg:px-20 mb-16">
            <div className="max-w-[1280px] mx-auto">
              <h2 className="text-2xl font-black text-deep-forest mb-8 font-display">Featured Articles</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {featuredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
                  >
                    <Link href={`/resources/${post.id}`}>
                      <div className={`group bg-white rounded-[32px] border border-black/5 overflow-hidden hover:shadow-2xl transition-all duration-500 h-full ${
                        index === 0 ? "flex flex-col" : ""
                      }`}>
                        <div className={`relative overflow-hidden ${index === 0 ? "h-64 lg:h-80" : "h-48"}`}>
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-mint text-deep-forest px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                              {categories.find(c => c.id === post.category)?.label}
                            </span>
                          </div>
                        </div>
                        <div className={`p-6 flex flex-col flex-1 ${index === 0 ? "lg:p-8" : ""}`}>
                          <h3 className={`font-black text-deep-forest mb-3 group-hover:text-deep-forest/80 transition-colors font-display ${
                            index === 0 ? "text-2xl lg:text-3xl" : "text-lg"
                          }`}>
                            {post.title}
                          </h3>
                          <p className={`text-text-gray mb-4 flex-1 ${index === 0 ? "text-base" : "text-sm line-clamp-2"}`}>
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-black/5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-deep-forest rounded-full flex items-center justify-center text-mint text-xs font-bold">
                                {post.author.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-deep-forest">{post.author}</div>
                                <div className="text-xs text-text-gray">{post.date}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-text-gray">
                              <Clock className="w-3.5 h-3.5" />
                              {post.readTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        <section className="px-5 md:px-10 lg:px-20">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-2xl font-black text-deep-forest mb-8 font-display">
              {activeCategory === "all" && !searchQuery ? "Latest Articles" : `${filteredPosts.length} Articles Found`}
            </h2>
            
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-off-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-text-gray" />
                </div>
                <h3 className="text-xl font-bold text-deep-forest mb-2">No articles found</h3>
                <p className="text-text-gray">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeCategory === "all" && !searchQuery ? regularPosts : filteredPosts).map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/resources/${post.id}`}>
                      <div className="group bg-white rounded-[28px] border border-black/5 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur-sm text-deep-forest px-3 py-1 rounded-full text-xs font-bold">
                              {categories.find(c => c.id === post.category)?.label}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="text-lg font-black text-deep-forest mb-2 group-hover:text-deep-forest/80 transition-colors font-display line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-text-gray mb-4 line-clamp-2 flex-1">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-black/5">
                            <div className="text-xs text-text-gray">{post.date}</div>
                            <div className="flex items-center gap-1 text-xs text-text-gray">
                              <Clock className="w-3.5 h-3.5" />
                              {post.readTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="px-5 md:px-10 lg:px-20 mt-20">
          <div className="max-w-[1280px] mx-auto">
            <div className="bg-deep-forest rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-mint/10 rounded-full -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-mint/5 rounded-full -ml-32 -mb-32" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-display">
                  Get Weekly SHSAT Tips
                </h2>
                <p className="text-white/60 mb-8 max-w-lg mx-auto">
                  Join 5,000+ students and parents receiving our best study tips, practice problems, and school news every week.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-mint focus:border-transparent"
                  />
                  <button className="px-8 py-4 bg-mint text-deep-forest rounded-xl font-black flex items-center justify-center gap-2 hover:bg-mint/90 transition-colors">
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ResourcesPage;
