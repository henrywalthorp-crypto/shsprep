"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Users,
  MapPin,
  Star,
  Phone,
  Globe,
  Award,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const partnersData = [
  {
    id: 1,
    name: "Elite SHSAT Academy",
    type: "tutoring_center",
    rating: 4.9,
    reviews: 127,
    location: "Flushing, Queens",
    description: "Intensive SHSAT prep with small class sizes and personalized attention. 15+ years of experience helping students achieve their dream schools.",
    specialties: ["Small Classes", "1-on-1 Available", "Weekend Sessions"],
    priceRange: "$$$",
    phone: "(718) 555-0123",
    website: "eliteshsat.com",
    featured: true,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Brooklyn Test Prep",
    type: "tutoring_center",
    rating: 4.7,
    reviews: 89,
    location: "Park Slope, Brooklyn",
    description: "Comprehensive test preparation with proven strategies. Our students consistently score in the top percentile on the SHSAT.",
    specialties: ["Practice Tests", "Essay Help", "Math Focus"],
    priceRange: "$$",
    phone: "(718) 555-0456",
    website: "brooklyntestprep.com",
    featured: false,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Sarah Chen - Private Tutor",
    type: "private_tutor",
    rating: 5.0,
    reviews: 43,
    location: "Manhattan (In-home/Online)",
    description: "Stuyvesant graduate offering personalized SHSAT tutoring. Flexible scheduling and customized lesson plans based on student needs.",
    specialties: ["Stuyvesant Alum", "Flexible Schedule", "Online Option"],
    priceRange: "$$$",
    phone: "(212) 555-0789",
    website: null,
    featured: true,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Queens Learning Center",
    type: "tutoring_center",
    rating: 4.6,
    reviews: 156,
    location: "Jamaica, Queens",
    description: "Affordable SHSAT preparation with experienced instructors. Group classes and individual tutoring available.",
    specialties: ["Affordable", "Group Classes", "After School"],
    priceRange: "$",
    phone: "(718) 555-0321",
    website: "queenslearning.com",
    featured: false,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    name: "Michael Rodriguez - Math Specialist",
    type: "private_tutor",
    rating: 4.8,
    reviews: 67,
    location: "Bronx / Online",
    description: "Former math teacher specializing in SHSAT math section. Proven track record of improving student scores by 100+ points.",
    specialties: ["Math Expert", "Score Guarantee", "Weekends"],
    priceRange: "$$",
    phone: "(347) 555-0654",
    website: null,
    featured: false,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    name: "NYC Specialized HS Prep",
    type: "tutoring_center",
    rating: 4.9,
    reviews: 203,
    location: "Bayside, Queens",
    description: "Premier SHSAT preparation center with a 95% specialized high school admission rate. Comprehensive curriculum covering all test sections.",
    specialties: ["95% Success Rate", "Full Curriculum", "Mock Exams"],
    priceRange: "$$$",
    phone: "(718) 555-0987",
    website: "nycshsprep.com",
    featured: true,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop"
  },
  {
    id: 7,
    name: "Academic Excellence Tutoring",
    type: "tutoring_center",
    rating: 4.5,
    reviews: 78,
    location: "Staten Island",
    description: "Dedicated SHSAT prep program with diagnostic testing and targeted improvement plans. Summer intensive programs available.",
    specialties: ["Diagnostic Tests", "Summer Programs", "Progress Reports"],
    priceRange: "$$",
    phone: "(718) 555-0147",
    website: "academicexcellenceny.com",
    featured: false,
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop"
  },
  {
    id: 8,
    name: "Jenny Park - ELA Specialist",
    type: "private_tutor",
    rating: 4.9,
    reviews: 52,
    location: "Online Only",
    description: "Bronx Science graduate specializing in ELA and reading comprehension. Helping students master the verbal section of the SHSAT.",
    specialties: ["ELA Focus", "Reading Comp", "Online Only"],
    priceRange: "$$",
    phone: "(646) 555-0258",
    website: null,
    featured: false,
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&h=300&fit=crop"
  }
];

const PartnersPage = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "tutoring_center" | "private_tutor">("all");

  const filteredPartners = filter === "all" 
    ? partnersData 
    : partnersData.filter(p => p.type === filter);

  const featuredPartners = filteredPartners.filter(p => p.featured);
  const regularPartners = filteredPartners.filter(p => !p.featured);

  const PartnerCard = ({ partner, featured = false }: { partner: typeof partnersData[0], featured?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-[24px] border overflow-hidden transition-all hover:shadow-xl cursor-pointer group ${
        featured ? "border-[#D6FF62] shadow-lg" : "border-slate-100 hover:border-slate-200"
      }`}
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={partner.image} 
          alt={partner.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {featured && (
          <div className="absolute top-4 left-4 bg-[#D6FF62] text-deep-forest px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">Featured</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-deep-forest px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
          <span className="text-xs font-black">{partner.rating}</span>
          <span className="text-xs text-slate-400">({partner.reviews})</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-black text-deep-forest text-lg mb-1">{partner.name}</h3>
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{partner.location}</span>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
            partner.type === "private_tutor" 
              ? "bg-[#EEF2FF] text-[#4F46E5]" 
              : "bg-[#FEF3C7] text-[#D97706]"
          }`}>
            {partner.type === "private_tutor" ? "TUTOR" : "CENTER"}
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{partner.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {partner.specialties.map((spec, i) => (
            <div key={i} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
              {spec}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Phone className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{partner.phone}</span>
            </div>
            {partner.website && (
              <div className="flex items-center gap-1.5 text-[#4F46E5]">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{partner.website}</span>
              </div>
            )}
          </div>
          <div className="text-sm font-black text-slate-400">{partner.priceRange}</div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-6xl">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-black text-deep-forest font-display">Partner Directory</h1>
        </div>
        <p className="text-slate-400 font-medium">Find trusted SHSAT tutoring centers and private tutors in your area. All partners are vetted for quality.</p>
      </header>

      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-[24px] p-8 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D6FF62]/5 rounded-full -mr-48 -mt-48" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-[#D6FF62]" />
            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Partner With Us</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Are you an SHSAT tutor or run a prep center?</h2>
          <p className="text-white/60 mb-6 max-w-xl">Join our directory and connect with thousands of students preparing for the SHSAT. Featured listings get priority placement.</p>
          <button className="px-6 py-3 bg-[#D6FF62] text-deep-forest rounded-xl font-black text-sm flex items-center gap-2 hover:bg-[#C8F27B] transition-colors">
            Apply to Join
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {[
          { id: "all", label: "All Partners" },
          { id: "tutoring_center", label: "Tutoring Centers" },
          { id: "private_tutor", label: "Private Tutors" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as "all" | "tutoring_center" | "private_tutor")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              filter === tab.id 
                ? "bg-[#0F172A] text-white" 
                : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {featuredPartners.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-black text-deep-forest mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            Featured Partners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPartners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PartnerCard partner={partner} featured />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-black text-deep-forest mb-6">All Partners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPartners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PartnerCard partner={partner} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersPage;
