"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/sections/navbar";
import Footer from "@/components/sections/footer";
import { 
  ArrowLeft, 
  Clock, 
  Calendar,
  Share2,
  Bookmark,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  AlertCircle
} from "lucide-react";

const articlesData: Record<string, any> = {
  "ultimate-shsat-study-guide-2024": {
    title: "The Ultimate SHSAT Study Guide for 2024",
    excerpt: "Everything you need to know about preparing for the SHSAT, from understanding the test format to creating an effective study schedule that actually works.",
    category: "Study Tips",
    author: {
      name: "Dr. Sarah Chen",
      role: "Head of Curriculum",
      bio: "Dr. Chen has over 15 years of experience in education and has helped thousands of students achieve their academic goals. She holds a Ph.D. in Educational Psychology from Columbia University.",
      avatar: "SC"
    },
    date: "November 15, 2024",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=600&fit=crop",
    content: `
      <p class="lead">The Specialized High Schools Admissions Test (SHSAT) is one of the most important exams for middle school students in New York City. With the right preparation strategy, you can maximize your score and increase your chances of admission to one of NYC's elite specialized high schools.</p>

      <h2>Understanding the SHSAT Format</h2>
      
      <p>Before diving into study strategies, it's crucial to understand exactly what you're preparing for. The SHSAT consists of two main sections:</p>
      
      <div class="info-box">
        <h4>English Language Arts (ELA)</h4>
        <ul>
          <li><strong>Revising/Editing:</strong> 20 questions testing grammar, sentence structure, and revision skills</li>
          <li><strong>Reading Comprehension:</strong> 37 questions based on literary and informational passages</li>
        </ul>
      </div>
      
      <div class="info-box">
        <h4>Mathematics</h4>
        <ul>
          <li><strong>Multiple Choice:</strong> 52 questions covering arithmetic, algebra, geometry, and statistics</li>
          <li><strong>Grid-In:</strong> 5 questions requiring numerical answers</li>
        </ul>
      </div>
      
      <p>You'll have 180 minutes (3 hours) to complete both sections. Time management is critical—many students struggle not because they don't know the material, but because they run out of time.</p>

      <h2>Creating Your Study Schedule</h2>
      
      <p>The most successful SHSAT students don't cram—they follow a consistent, well-structured study plan. Here's a recommended timeline based on when you start preparing:</p>

      <h3>6+ Months Before the Test (Ideal)</h3>
      <ul>
        <li>Focus on building foundational skills in math and reading</li>
        <li>Study 1-2 hours daily, 5 days a week</li>
        <li>Take one full-length practice test per month to track progress</li>
        <li>Work through concept lessons before practice problems</li>
      </ul>

      <h3>3-6 Months Before the Test</h3>
      <ul>
        <li>Increase study time to 2-3 hours daily</li>
        <li>Take practice tests bi-weekly</li>
        <li>Focus heavily on weak areas identified in practice tests</li>
        <li>Begin timed practice sessions</li>
      </ul>

      <h3>1-3 Months Before the Test</h3>
      <ul>
        <li>Take weekly full-length practice tests under realistic conditions</li>
        <li>Review all incorrect answers thoroughly</li>
        <li>Focus on test-taking strategies and time management</li>
        <li>Reduce new content learning; focus on reinforcement</li>
      </ul>

      <div class="tip-box">
        <h4>Pro Tip: The 20-Minute Rule</h4>
        <p>Research shows that studying in focused 20-minute blocks with short breaks is more effective than marathon study sessions. Try the Pomodoro Technique: 20 minutes of focused study, followed by a 5-minute break.</p>
      </div>

      <h2>Math Preparation Strategies</h2>
      
      <p>The math section often determines acceptance into the most competitive schools like Stuyvesant. Here's how to maximize your math score:</p>

      <h3>Master the Fundamentals First</h3>
      <p>Before attempting complex problems, ensure you have solid foundations in:</p>
      <ul>
        <li>Order of operations (PEMDAS)</li>
        <li>Fractions, decimals, and percentages</li>
        <li>Basic algebraic manipulation</li>
        <li>Geometry formulas (area, perimeter, volume)</li>
        <li>Ratio and proportion</li>
      </ul>

      <h3>Learn Problem-Solving Strategies</h3>
      <p>Many SHSAT math problems can be solved faster using strategic approaches:</p>
      
      <div class="strategy-box">
        <h4>Backsolving</h4>
        <p>For multiple-choice questions, try plugging answer choices back into the problem. Start with choice C (middle value) to determine if you need a larger or smaller answer.</p>
      </div>

      <div class="strategy-box">
        <h4>Picking Numbers</h4>
        <p>When a problem contains variables, substitute simple numbers (like 2, 3, or 10) to make the math concrete and manageable.</p>
      </div>

      <div class="strategy-box">
        <h4>Drawing Diagrams</h4>
        <p>For geometry and word problems, always draw a picture. Visual representation often reveals the solution path.</p>
      </div>

      <h2>ELA Preparation Strategies</h2>
      
      <p>The ELA section tests both your grammar knowledge and reading comprehension skills. Here's how to excel in each area:</p>

      <h3>Revising/Editing Section</h3>
      <p>This section tests your ability to identify and correct errors in written passages. Key areas to study:</p>
      <ul>
        <li><strong>Subject-verb agreement:</strong> Ensure verbs match their subjects in number</li>
        <li><strong>Pronoun clarity:</strong> Pronouns should clearly refer to specific nouns</li>
        <li><strong>Parallelism:</strong> Items in a list should follow the same grammatical structure</li>
        <li><strong>Sentence structure:</strong> Identify and correct run-ons and fragments</li>
        <li><strong>Punctuation:</strong> Focus on commas, semicolons, and colons</li>
      </ul>

      <h3>Reading Comprehension Section</h3>
      <p>Success in reading comprehension comes from developing strong annotation habits:</p>
      
      <div class="tip-box">
        <h4>The SOAR Method</h4>
        <ul>
          <li><strong>S</strong>kim the questions first (know what you're looking for)</li>
          <li><strong>O</strong>rganize the passage structure mentally</li>
          <li><strong>A</strong>nnotate key points, main ideas, and transitions</li>
          <li><strong>R</strong>efer back to the passage for every answer</li>
        </ul>
      </div>

      <h2>Test Day Tips</h2>
      
      <p>All your preparation leads to this moment. Here's how to perform your best on test day:</p>

      <div class="checklist">
        <h4>The Night Before</h4>
        <ul>
          <li>Get 8+ hours of sleep</li>
          <li>Prepare your materials (admission ticket, pencils, calculator if allowed)</li>
          <li>Eat a light, healthy dinner</li>
          <li>Do NOT cram—review notes briefly, then relax</li>
        </ul>
      </div>

      <div class="checklist">
        <h4>Test Morning</h4>
        <ul>
          <li>Eat a protein-rich breakfast (eggs, yogurt, nuts)</li>
          <li>Arrive 30 minutes early</li>
          <li>Use the bathroom before the test starts</li>
          <li>Take deep breaths to calm nerves</li>
        </ul>
      </div>

      <div class="checklist">
        <h4>During the Test</h4>
        <ul>
          <li>Read every question carefully—don't rush</li>
          <li>Skip difficult questions and return to them later</li>
          <li>Never leave a question blank (there's no penalty for guessing)</li>
          <li>Check your work if time permits</li>
        </ul>
      </div>

      <div class="warning-box">
        <h4>Common Mistakes to Avoid</h4>
        <ul>
          <li>Spending too much time on one difficult question</li>
          <li>Not reading all answer choices before selecting</li>
          <li>Making careless arithmetic errors</li>
          <li>Misreading the question (especially "NOT" or "EXCEPT" questions)</li>
        </ul>
      </div>

      <h2>Final Thoughts</h2>
      
      <p>Preparing for the SHSAT is a marathon, not a sprint. Consistent, focused preparation over time will yield far better results than last-minute cramming. Remember:</p>
      
      <ul>
        <li>Start early and create a realistic study schedule</li>
        <li>Focus on understanding concepts, not just memorizing formulas</li>
        <li>Take regular practice tests to track your progress</li>
        <li>Learn from your mistakes—review every incorrect answer</li>
        <li>Take care of your mental and physical health throughout the process</li>
      </ul>
      
      <p>With dedication and the right strategies, you can achieve your target score and open the door to an incredible high school experience. Good luck!</p>
    `,
    relatedArticles: [
      {
        id: "top-10-math-mistakes",
        title: "Top 10 Math Mistakes SHSAT Students Make",
        category: "Math Strategies",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop"
      },
      {
        id: "reading-comprehension-secrets",
        title: "5 Reading Comprehension Secrets Top Scorers Use",
        category: "ELA & Reading",
        readTime: "10 min read",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop"
      },
      {
        id: "test-day-checklist",
        title: "The Complete SHSAT Test Day Checklist",
        category: "Test Prep",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop"
      }
    ]
  }
};

const defaultArticle = {
  title: "Article Not Found",
  content: "<p>Sorry, this article could not be found. Please check the URL or return to our resources page.</p>",
  author: { name: "SHSprep Team", role: "Editorial", avatar: "SP", bio: "" },
  date: "",
  readTime: "",
  category: "",
  image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=600&fit=crop",
  relatedArticles: []
};

const ArticlePage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const article = articlesData[slug] || defaultArticle;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        {/* Back Link */}
        <section className="px-5 md:px-10 lg:px-20 mb-8">
          <div className="max-w-[900px] mx-auto">
            <Link 
              href="/resources"
              className="inline-flex items-center gap-2 text-text-gray hover:text-deep-forest transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Resources
            </Link>
          </div>
        </section>

        {/* Article Header */}
        <section className="px-5 md:px-10 lg:px-20 mb-10">
          <div className="max-w-[900px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {article.category && (
                <span className="inline-block bg-mint text-deep-forest px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                  {article.category}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-deep-forest mb-6 font-display leading-tight">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-deep-forest rounded-full flex items-center justify-center text-mint font-bold">
                    {article.author.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-deep-forest">{article.author.name}</div>
                    <div className="text-sm text-text-gray">{article.author.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-gray">
                  {article.date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {article.date}
                    </div>
                  )}
                  {article.readTime && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {article.readTime}
                    </div>
                  )}
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-text-gray">Share:</span>
                <button className="w-10 h-10 bg-off-white rounded-full flex items-center justify-center hover:bg-black/10 transition-colors">
                  <Twitter className="w-4 h-4 text-deep-forest" />
                </button>
                <button className="w-10 h-10 bg-off-white rounded-full flex items-center justify-center hover:bg-black/10 transition-colors">
                  <Facebook className="w-4 h-4 text-deep-forest" />
                </button>
                <button className="w-10 h-10 bg-off-white rounded-full flex items-center justify-center hover:bg-black/10 transition-colors">
                  <Linkedin className="w-4 h-4 text-deep-forest" />
                </button>
                <button className="w-10 h-10 bg-off-white rounded-full flex items-center justify-center hover:bg-black/10 transition-colors">
                  <LinkIcon className="w-4 h-4 text-deep-forest" />
                </button>
                <button className="ml-2 w-10 h-10 bg-off-white rounded-full flex items-center justify-center hover:bg-black/10 transition-colors">
                  <Bookmark className="w-4 h-4 text-deep-forest" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        {article.image && (
          <section className="px-5 md:px-10 lg:px-20 mb-12">
            <div className="max-w-[1100px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-[32px] overflow-hidden"
              >
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
              </motion.div>
            </div>
          </section>
        )}

        {/* Article Content */}
        <section className="px-5 md:px-10 lg:px-20 mb-16">
          <div className="max-w-[750px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </section>

        {/* Author Bio */}
        {article.author.bio && (
          <section className="px-5 md:px-10 lg:px-20 mb-16">
            <div className="max-w-[750px] mx-auto">
              <div className="bg-off-white rounded-[28px] p-8">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-deep-forest rounded-2xl flex items-center justify-center text-mint font-bold text-2xl flex-shrink-0">
                    {article.author.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text-gray uppercase tracking-wider mb-1">Written by</div>
                    <h3 className="text-xl font-black text-deep-forest mb-2">{article.author.name}</h3>
                    <p className="text-text-gray">{article.author.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Articles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <section className="px-5 md:px-10 lg:px-20">
            <div className="max-w-[1100px] mx-auto">
              <h2 className="text-2xl font-black text-deep-forest mb-8 font-display">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {article.relatedArticles.map((related: any, index: number) => (
                  <Link key={related.id} href={`/resources/${related.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white rounded-[24px] border border-black/5 overflow-hidden hover:shadow-xl transition-all"
                    >
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={related.image} 
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <span className="text-xs font-bold text-text-gray">{related.category}</span>
                        <h3 className="font-bold text-deep-forest mt-1 mb-2 group-hover:text-deep-forest/80 transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-text-gray">
                          <Clock className="w-3.5 h-3.5" />
                          {related.readTime}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      <style jsx global>{`
        .article-content {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #374151;
        }
        
        .article-content p {
          margin-bottom: 1.5rem;
        }
        
        .article-content p.lead {
          font-size: 1.25rem;
          color: #1f2937;
          font-weight: 500;
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        
        .article-content h2 {
          font-size: 1.75rem;
          font-weight: 900;
          color: #0F172A;
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          font-family: var(--font-display);
        }
        
        .article-content h3 {
          font-size: 1.375rem;
          font-weight: 800;
          color: #0F172A;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .article-content h4 {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 0.75rem;
        }
        
        .article-content ul {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        
        .article-content ul li {
          margin-bottom: 0.5rem;
          position: relative;
        }
        
        .article-content ul li::marker {
          color: #D6FF62;
        }
        
        .article-content strong {
          color: #0F172A;
          font-weight: 600;
        }
        
        .article-content .info-box,
        .article-content .tip-box,
        .article-content .strategy-box,
        .article-content .warning-box,
        .article-content .checklist {
          padding: 1.5rem;
          border-radius: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .article-content .info-box {
          background: #F0F9FF;
          border-left: 4px solid #0EA5E9;
        }
        
        .article-content .tip-box {
          background: #F0FDF4;
          border-left: 4px solid #D6FF62;
        }
        
        .article-content .strategy-box {
          background: #FDF4FF;
          border-left: 4px solid #A855F7;
        }
        
        .article-content .warning-box {
          background: #FEF2F2;
          border-left: 4px solid #EF4444;
        }
        
        .article-content .checklist {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
        }
        
        .article-content .info-box h4,
        .article-content .tip-box h4,
        .article-content .strategy-box h4,
        .article-content .warning-box h4,
        .article-content .checklist h4 {
          margin-top: 0;
        }
        
        .article-content .info-box ul,
        .article-content .tip-box ul,
        .article-content .strategy-box ul,
        .article-content .warning-box ul,
        .article-content .checklist ul {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default ArticlePage;
