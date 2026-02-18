"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const SignUpFormPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: "student",
          },
        },
      });
      if (error) {
        toast.error(error.message);
      } else {
        localStorage.setItem("shs_student_name", firstName);
        toast.success("Account created!");
        router.push("/signup/onboarding");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-forest relative flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Wavy Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="waves-form" x="0" y="0" width="100" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 Q 25 10 50 20 T 100 20" fill="none" stroke="white" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves-form)" />
        </svg>
      </div>

      {/* Back Button & Logo */}
      <div className="absolute top-8 left-0 right-0 px-8 flex items-center justify-center max-w-[600px] mx-auto z-20">
        <Link 
          href="/signup" 
          className="absolute left-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 bg-mint rounded-xl flex items-center justify-center text-deep-forest font-bold text-xl shadow-lg shadow-mint/20">
            S
          </div>
          <span className="text-2xl font-bold text-white tracking-tight font-display">
            SHS<span className="text-white/60">prep</span>
          </span>
        </Link>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] bg-white rounded-[32px] p-8 md:p-10 shadow-2xl relative z-10 mt-16"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-deep-forest text-center mb-8 font-display tracking-tight leading-tight">
          Your path to a higher score starts here
        </h1>

        <form className="space-y-4" onSubmit={handleSignUp}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-deep-forest ml-1 uppercase tracking-wider">Your email</label>
              <input
                type="email"
                placeholder="email@address.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-off-white border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-mint focus:bg-white focus:border-mint/20 transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-deep-forest ml-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-off-white border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-mint focus:bg-white focus:border-mint/20 transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-deep-forest ml-1 uppercase tracking-wider">Your name</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-off-white border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-mint focus:bg-white focus:border-mint/20 transition-all text-sm font-medium"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-off-white border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-mint focus:bg-white focus:border-mint/20 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-mint text-deep-forest rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#B8E26B] transition-all shadow-lg shadow-mint/20 mt-6 group disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Continue
              {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

        <p className="mt-6 text-[10px] text-gray-400 text-center leading-relaxed">
          By continuing, you agree to our <Link href="/terms" className="underline hover:text-deep-forest">Terms of Use</Link> and <Link href="/privacy" className="underline hover:text-deep-forest">Privacy Policy</Link>. You also agree to receive emails from SHSprep. You can turn off emails at any time.
        </p>

        <div className="mt-8 text-center">
          <p className="text-sm text-text-gray font-medium">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-deep-forest font-bold hover:underline transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpFormPage;
