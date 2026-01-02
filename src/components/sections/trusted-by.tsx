"use client";

import React from 'react';

const TrustedBy = () => {
  const specializedSchools = [
    "Stuyvesant", "Bronx Science", "Brooklyn Tech", 
    "Staten Island Tech", "HS American Studies", 
    "Queens Science", "HSMSE", "Brooklyn Latin"
  ];

  const marqueeItems = [...specializedSchools, ...specializedSchools];

  return (
    <section className="w-full bg-[#F5F5F5] pt-10 pb-10 md:pt-16 md:pb-20">
      <div className="flex flex-col items-center justify-center text-center w-full px-5 mx-auto md:px-20 mb-8 md:mb-12">
        <p className="text-[#6A6A6A] font-medium tracking-tight text-sm uppercase">
          Our students get into the most selective schools in NYC
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-10 bg-gradient-to-r from-[#F5F5F5] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-10 bg-gradient-to-l from-[#F5F5F5] to-transparent pointer-events-none" />

        <div className="flex w-max animate-marquee">
          {marqueeItems.map((school, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center px-10 md:px-20"
            >
              <span className="text-2xl md:text-4xl font-bold text-[#152822] opacity-30 hover:opacity-100 transition-opacity cursor-default whitespace-nowrap">
                {school}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;