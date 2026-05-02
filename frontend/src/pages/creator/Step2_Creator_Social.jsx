import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Step2_Creator_Social = () => {
  const navigate = useNavigate();
  const [genderDist, setGenderDist] = useState(65); // Default to 65% Female
  const [selectedAge, setSelectedAge] = useState('25-34');
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-['Inter',sans-serif] flex flex-col items-center py-20 px-4">
      {/* ... existing header ... */}
      {/* (Rest of code remains the same, I will just apply the specific button changes) */}
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
            <div className="w-8 h-8 bg-[#050B18] text-white rounded-full flex items-center justify-center font-bold text-xs">2</div>
            <div className="w-8 h-8 bg-white border border-gray-200 text-gray-300 rounded-full flex items-center justify-center font-bold text-xs">3</div>
            <div className="w-8 h-8 bg-white border border-gray-200 text-gray-300 rounded-full flex items-center justify-center font-bold text-xs">4</div>
          </div>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] text-center w-full">Social & Audience</span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[760px] bg-white rounded-[24px] shadow-[0_4px_40px_rgb(0,0,0,0.03)] relative overflow-hidden border border-gray-50">
        <div className="px-12 lg:px-20 py-16">
          <h1 className="text-[#050B18] text-3xl font-extrabold text-center mb-16 tracking-tight">Your Digital Footprint</h1>

          {/* Section 1: Connect Instagram */}
          <div className="bg-[#f5f7fb] rounded-[16px] p-8 flex items-center justify-between mb-12">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
              </div>
              <div>
                <h3 className="text-[#050B18] text-lg font-bold mb-1 tracking-tight">Connect Instagram</h3>
                <p className="text-gray-400 text-xs font-medium">Link your primary account to auto-sync followers.</p>
              </div>
            </div>
            <button className="bg-[#050B18] text-white px-6 py-3 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-[#0a1629] transition-all active:scale-[0.98]">
              Connect Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>

          {/* Section 2: Additional Platforms */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Additional Platforms</h4>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[#050B18] text-xs font-bold">YouTube Channel</label>
                <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#f9fafb] border-r border-gray-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  </div>
                  <input type="text" placeholder="https://youtube.com/c/yourchannel" className="flex-1 h-12 px-4 text-sm focus:outline-none placeholder:text-gray-300 font-medium text-gray-600" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[#050B18] text-xs font-bold">LinkedIn Profile</label>
                <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#f9fafb] border-r border-gray-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </div>
                  <input type="text" placeholder="https://linkedin.com/in/yourprofile" className="flex-1 h-12 px-4 text-sm focus:outline-none placeholder:text-gray-300 font-medium text-gray-600" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#050B18] text-xs font-bold">Website / Portfolio</label>
              <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
                <div className="w-12 h-12 flex items-center justify-center bg-[#f9fafb] border-r border-gray-100">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                </div>
                <input type="text" placeholder="https://www.yourwebsite.com" className="flex-1 h-12 px-4 text-sm focus:outline-none placeholder:text-gray-300 font-medium text-gray-600" />
              </div>
            </div>
          </div>

          {/* Section 3: Audience Demographics */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-10 border-b border-gray-100 pb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Audience Demographics</h4>
            </div>

            <div className="space-y-12">
              {/* Gender Distribution */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[#050B18] text-sm font-bold">Gender Distribution</span>
                  <span className="bg-[#f1f5f9] text-[#050B18] text-[11px] font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                    {100 - genderDist}% Male / {genderDist}% Female
                  </span>
                </div>
                <div className="relative h-[2px] w-full bg-gray-200 mt-6">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={genderDist} 
                    onChange={(e) => setGenderDist(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-[#050B18] z-10 transition-all duration-75" 
                    style={{ width: `${genderDist}%`, left: 0 }}
                  ></div>
                  <div 
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#050B18] rounded-full border-4 border-white shadow-md z-10 pointer-events-none transition-all duration-75"
                    style={{ left: `${genderDist}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-6">
                  <span>MALE</span>
                  <span>FEMALE</span>
                </div>
              </div>

              {/* Age Group */}
              <div className="space-y-6">
                <span className="text-[#050B18] text-sm font-bold block">Primary Age Group</span>
                <div className="flex flex-wrap gap-4">
                  {['13-17', '18-24', '25-34', '35-44', '45+'].map((age) => (
                    <button 
                      key={age}
                      type="button"
                      onClick={() => setSelectedAge(age)}
                      className={`px-6 py-3 rounded-full text-xs font-bold transition-all border ${
                        age === selectedAge 
                          ? 'bg-[#050B18] text-white border-[#050B18] shadow-lg shadow-blue-900/10' 
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-12 mt-12">
            <button 
              onClick={() => navigate('/creator/step1')}
              className="text-[#050B18] font-bold text-sm hover:underline px-4"
            >
              Back
            </button>
            <button 
              onClick={() => navigate('/creator/step3')}
              className="flex-1 h-16 bg-[#010B1F] text-white rounded-[12px] font-bold text-[16px] flex items-center justify-center gap-3 hover:bg-[#02152a] transition-all shadow-[0_12px_24px_-8px_rgba(1,11,31,0.5)] active:scale-[0.99] border-none outline-none"
            >
              Save & Continue
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex gap-10 mt-10">
        <a href="#" className="text-gray-400 text-xs font-medium hover:text-gray-600 transition-colors">Privacy Policy</a>
        <a href="#" className="text-gray-400 text-xs font-medium hover:text-gray-600 transition-colors">Terms of Service</a>
      </div>
    </div>
  );
};
export default Step2_Creator_Social;
