"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { friendlyAuthError } from "@/lib/auth/errors";

const SignInPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(friendlyAuthError(error.message));
      } else {
        toast.success("Welcome back!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-white">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-20 py-12">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 bg-deep-forest rounded-xl flex items-center justify-center text-mint font-bold text-xl shadow-lg shadow-deep-forest/10">
                S
              </div>
              <span className="text-2xl font-bold text-deep-forest tracking-tight font-display">
                SHS<span className="text-text-gray/60">prep</span>
              </span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-deep-forest mb-2 font-display tracking-tight">
              Welcome Back
            </h1>
            <p className="text-text-gray text-sm">
              Sign in to start practicing with SHSprep
            </p>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-forest/10 focus:border-deep-forest transition-all"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-forest/10 focus:border-deep-forest transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 border border-gray-200 rounded-xl text-deep-forest font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In with Email
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-text-gray">
              Don't have an account?{" "}
              <Link href="/signup" className="text-deep-forest font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-400 leading-relaxed max-w-[300px] mx-auto">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-deep-forest">Terms of Use</Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-deep-forest">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Features/Testimonial */}
      <div className="hidden lg:flex flex-1 bg-deep-forest relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full">
           <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-mint/10 rounded-full blur-3xl animate-pulse" />
           <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-mint/5 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Feature Cards Stack */}
        <div className="relative w-full max-w-[450px] aspect-[4/5] perspective-1000">
          <motion.div
            initial={{ opacity: 0, rotate: -5, y: 20 }}
            animate={{ opacity: 1, rotate: -5, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-0 left-0 w-full bg-pastel-purple/20 backdrop-blur-sm rounded-[32px] border border-white/5 h-full transform translate-x-4 translate-y-8"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white rounded-[32px] p-8 shadow-2xl h-full flex flex-col"
          >
            {/* User Profile Hook */}
            <div className="flex items-center gap-3 mb-8 bg-off-white/80 p-3 rounded-2xl w-fit">
              <div className="h-10 w-10 bg-sage rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-deep-forest">Alex's SHSAT Plan</p>
                <p className="text-[10px] text-text-gray font-medium">Exam 4 months away</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-deep-forest mb-8 font-display tracking-tight">
              Your Daily Tasks
            </h2>

            <div className="space-y-4">
              {[
                { title: "Information and Ideas", sub: "10 Questions", completed: true },
                { title: "Linear equations in 1 variable", sub: "15 Questions", completed: false },
                { title: "Practice your mistakes", sub: "Focus: Geometry", completed: false },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                    task.completed ? "bg-mint text-deep-forest" : "border-2 border-gray-100"
                  )}>
                    {task.completed && <Check className="w-5 h-5 stroke-[3]" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-deep-forest group-hover:text-mint transition-colors cursor-pointer">{task.title}</p>
                    <p className="text-[11px] text-text-gray font-medium">{task.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Testimonial at bottom */}
        <div className="mt-16 text-center max-w-[400px]">
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 fill-mint text-mint" />
            ))}
          </div>
          <p className="text-white font-medium italic text-lg leading-relaxed mb-4">
            "SHSprep helped me immensely in targeted practice. I increased my score by 120 points!"
          </p>
          <p className="text-mint font-bold text-sm tracking-wide uppercase">
            SHAURYA <span className="text-white/40 ml-2 font-medium normal-case">increased score 140 pts</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
