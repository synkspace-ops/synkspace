import React from 'react';
import { useNavigate } from 'react-router-dom';

const Step4_Brand_Team = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-['Inter',sans-serif] flex flex-col items-center py-20 px-4">
      {/* Top Header */}
      <div className="flex flex-col items-center mb-14 w-full max-w-[650px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-24">
          <div className="flex items-center justify-center">
            <img
              src="https://fahadkasim.wordpress.com/wp-content/uploads/2026/04/chatgpt-image-apr-26-2026-02_33_31-pm.png"
              alt="SynkSpace logo"
              className="h-12 w-auto object-contain"
            />
          </div>
          <span className="text-[#050B18] text-2xl font-bold tracking-tight">
            SynkSpace
          </span>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center w-full max-w-[340px] relative mb-8">
          <div className="absolute top-1/2 left-0 w-full h-[0.5px] bg-gray-200 -translate-y-1/2 z-0"></div>
          <div className="relative z-10 flex justify-between w-full">
            <div className="w-8 h-8 bg-[#050B18] text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-900/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div className="w-8 h-8 bg-[#050B18] text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-900/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div className="w-8 h-8 bg-[#050B18] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-900/10">3</div>
            <div className="w-8 h-8 bg-white border border-gray-200 text-gray-300 rounded-full flex items-center justify-center font-bold text-xs">4</div>
          </div>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] text-center w-full">Team & Contact</span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[760px] bg-white rounded-[24px] shadow-[0_4px_40px_rgb(0,0,0,0.03)] relative overflow-hidden border border-gray-50 border-t-2 border-t-[#050B18]">
        <div className="px-12 lg:px-20 py-16">
          <h1 className="text-[#050B18] text-3xl font-extrabold text-center mb-16 tracking-tight">Who is managing the brand?</h1>

          {/* Section 1: Primary Point of Contact */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Primary Point of Contact</h4>
            </div>

            <div className="space-y-8">
              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-bold ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. Sarah Williams" 
                    className="w-full h-12 bg-white border border-gray-100 rounded-lg pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <label className="text-gray-600 text-[13px] font-bold ml-1">Job Title</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. Marketing Manager" 
                      className="w-full h-12 bg-white border border-gray-100 rounded-lg pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-gray-600 text-[13px] font-bold ml-1">Work Email</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <input 
                      type="email" 
                      placeholder="sarah@brand.com" 
                      className="w-full h-12 bg-white border border-gray-100 rounded-lg pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Details */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Contact Details</h4>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-bold ml-1">Phone Number</label>
                <div className="flex items-center gap-2">
                  <div className="relative w-24">
                    <select className="w-full h-12 bg-gray-50 border border-gray-100 rounded-lg px-3 appearance-none text-sm text-gray-500 font-bold focus:outline-none focus:border-blue-500 transition-all shadow-sm">
                      <option>+1</option>
                      <option>+91</option>
                      <option>+44</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                  <input 
                    type="tel" 
                    placeholder="(555) 123-4567" 
                    className="flex-1 h-12 bg-white border border-gray-100 rounded-lg px-4 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 ml-1">
                  <label className="text-gray-600 text-[13px] font-bold">Official LinkedIn Profile</label>
                  <span className="text-gray-300 text-[11px] font-medium">(Optional)</span>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="linkedin.com/in/username" 
                    className="w-full h-12 bg-white border border-gray-100 rounded-lg pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Collaborators */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Collaborators</h4>
            </div>

            <div className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-2xl p-12 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
              </div>
              <h5 className="text-[#050B18] text-base font-bold mb-2 tracking-tight">Invite Team Members</h5>
              <p className="text-gray-400 text-[12px] font-medium leading-relaxed max-w-[320px] mb-8">Allow colleagues to join this brand workspace to help manage campaigns and payments.</p>
              <button className="bg-white border border-gray-200 text-[#050B18] px-8 py-3 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]">
                + Invite Member
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-12 mt-16 pt-10 border-t border-gray-50">
            <button 
              onClick={() => navigate('/brand/step2')}
              className="text-gray-400 font-bold text-[14px] hover:text-[#050B18] transition-colors px-6"
            >
              Back
            </button>
            <button 
              onClick={() => navigate('/brand/step4')}
              className="flex-1 h-16 bg-[#010B1F] text-white rounded-[12px] font-bold text-[16px] flex items-center justify-center gap-3 hover:bg-[#02152a] transition-all shadow-[0_12px_24px_-8px_rgba(1,11,31,0.5)] active:scale-[0.99] border-none outline-none"
            >
              Save & Continue
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex items-center gap-3 mt-10">
        <a href="#" className="text-gray-400 text-[11px] font-medium hover:text-gray-600 transition-colors">Privacy Policy</a>
        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
        <a href="#" className="text-gray-400 text-[11px] font-medium hover:text-gray-600 transition-colors">Terms of Service</a>
      </div>
    </div>
  );
};

export default Step4_Brand_Team;
