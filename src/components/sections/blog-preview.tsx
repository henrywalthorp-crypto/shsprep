import React from 'react';
import Image from 'next/image';

const BlogPreview = () => {
  const blogPosts = [
    {
      title: "SHSAT 2024: Everything You Need to Know",
      tag: "Guide",
      image: "https://images.unsplash.com/photo-1434031211128-a39118a7ae3f?auto=format&fit=crop&q=80&w=800",
      link: "/blog/shsat-2024-guide"
    },
    {
      title: "How to Master the SHSAT Math Section",
      tag: "Tips",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
      link: "/blog/shsat-math-mastery"
    },
    {
      title: "The Top 5 Specialized High Schools in NYC",
      tag: "Schools",
      image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
      link: "/blog/top-nyc-specialized-schools"
    }
  ];

  return (
    <section className="bg-[#F5F5F5] py-[80px] md:py-[120px]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-20">
        <div className="flex items-center justify-between mb-10 md:mb-12">
          <h2 className="text-[32px] md:text-[48px] font-semibold text-[#152822] tracking-tight">
            Preparation Resources
          </h2>
          <a
            href="/blog"
            className="group flex items-center justify-center gap-2 bg-[#C8F27B] hover:bg-[#b8e06a] transition-colors rounded-full px-5 py-2 text-[14px] font-semibold text-[#152822]"
          >
            All resources
            <div className="w-[18px] h-[18px] bg-[#152822] rounded-full flex items-center justify-center text-[#C8F27B] group-hover:translate-x-0.5 transition-transform">
              <svg 
                width="10" 
                height="10" 
                viewBox="0 0 10 10" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current"
              >
                <path d="M1 9L9 1M9 1H3M9 1V7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {blogPosts.map((post, index) => (
            <a 
              key={index}
              href={post.link}
              className="group flex flex-col bg-white border border-black/5 rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative w-full aspect-[1.33/1] bg-[#F9F9F9] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-[#E0F2E4] text-[#152822] text-[12px] font-medium rounded-full">
                    {post.tag}
                  </span>
                </div>
                
                <h3 className="text-[20px] md:text-[24px] leading-[1.3] font-semibold text-[#152822] mb-10 flex-1">
                  {post.title}
                </h3>
                
                <div className="mt-auto">
                  <span className="text-[14px] font-medium text-[#152822] underline underline-offset-4 decoration-black/20 group-hover:decoration-[#152822] transition-colors">
                    Read More
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;