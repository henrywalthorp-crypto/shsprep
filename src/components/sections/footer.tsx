import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#f5f5f5] pt-0">
      <div className="container mx-auto px-5 md:px-10 lg:px-20">
        <div className="bg-[#D0E6D6] rounded-t-[24px] md:rounded-t-[40px] px-8 py-16 md:px-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-8">
            {/* Logo Section */}
            <div className="lg:col-span-1">
              <a href="/" className="inline-block mb-8">
                <div className="flex items-center gap-2 bg-[#152822] text-white px-3 py-1.5 rounded-md border border-[#152822]">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <span className="font-bold text-lg tracking-tight">SHSprep</span>
                </div>
              </a>
              <p className="text-[#152822]/60 text-xs leading-relaxed max-w-[200px]">
                NYC&apos;s leading digital platform for SHSAT preparation. Built for excellence.
              </p>
            </div>

            {/* Links Columns */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[#152822] font-bold text-sm mb-2 uppercase tracking-wider">Courses</h4>
              <ul className="flex flex-col gap-3">
                <li><a href="#" className="text-[#152822] hover:opacity-70 transition-opacity text-sm font-medium">SHSAT Complete Prep</a></li>
                <li><a href="#" className="text-[#152822] hover:opacity-70 transition-opacity text-sm font-medium">Math Intensive</a></li>
                <li><a href="#" className="text-[#152822] hover:opacity-70 transition-opacity text-sm font-medium">ELA Intensive</a></li>
                <li><a href="#" className="text-[#152822] hover:opacity-70 transition-opacity text-sm font-medium">Practice Exams</a></li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-[#152822] font-bold text-sm mb-2 uppercase tracking-wider">Resources</h4>
              <ul className="flex flex-col gap-3">
                <li><a href="#" className="text-[#152822] hover:opacity-70 transition-opacity text-sm font-medium">SHSAT Guide</a></li>
                <li><a href="#" className="text-[#152822] hover:opacity-70 transition-opacity text-sm font-medium">Blog</a></li>
                <li><a href="#" className="text-[#152822] hover:opacity-70 transition-opacity text-sm font-medium">School Cutoffs</a></li>
                <li><a href="#" className="text-[#152822] hover:opacity-70 transition-opacity text-sm font-medium">FAQ</a></li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-[#152822] font-bold text-sm mb-2 uppercase tracking-wider">Company</h4>
              <ul className="flex flex-col gap-3">
                <li><a href="#" className="text-[#152822] hover:opacity-70 transition-opacity text-sm font-medium">Our Team</a></li>
                <li><a href="#" className="text-[#152822] hover:opacity-70 transition-opacity text-sm font-medium">Results</a></li>
                <li><a href="#" className="text-[#152822] hover:opacity-70 transition-opacity text-sm font-medium">Privacy Policy</a></li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-[#152822] font-bold text-sm mb-2 uppercase tracking-wider">Follow Us</h4>
              <ul className="flex flex-col gap-3">
                <li><a href="#" className="text-[#152822] hover:opacity-70 transition-opacity text-sm font-medium">Instagram</a></li>
                <li><a href="#" className="text-[#152822] hover:opacity-70 transition-opacity text-sm font-medium">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-[#152822]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[#152822]/40 text-[10px] font-bold uppercase tracking-widest">
             <div>© 2024 SHSPREP. ALL RIGHTS RESERVED.</div>
             <div className="flex gap-8">
                <a href="#">Terms</a>
                <a href="#">Privacy</a>
                <a href="#">Contact</a>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;