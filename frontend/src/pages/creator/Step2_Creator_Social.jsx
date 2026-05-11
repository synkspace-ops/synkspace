import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOnboardingStep } from '../../lib/onboardingProgress';

const Step2_Creator_Social = () => {
  const navigate = useNavigate();
  const [genderDist, setGenderDist] = useState(65); // Default to 65% Female
  const [selectedAge, setSelectedAge] = useState('25-34');
  const [form, setForm] = useState({
    youtube: '',
    linkedin: '',
    website: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem("onboardingData") || "{}");
      localStorage.setItem(
        "onboardingData",
        JSON.stringify({
          ...(existing && typeof existing === "object" ? existing : {}),
          creator: {
            ...((existing && typeof existing === "object" && existing.creator && typeof existing.creator === "object")
              ? existing.creator
              : {}),
            step2: { genderDist, selectedAge, ...form },
          },
        })
      );
    } catch (_) {}
  }, [genderDist, selectedAge, form]);

  const handleNext = async () => {
    const newErrors = {};
    if (!form.linkedin) newErrors.linkedin = "Required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await saveOnboardingStep("creator", "step2", { genderDist, selectedAge, ...form });
      navigate('/creator/step3');
    } catch (error) {
      console.error("Error saving creator step 2:", error);
      setErrors((prev) => ({ ...prev, submit: "Could not save this step. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

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
            <div className="w-8 h-8 bg-[#050B18] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-900/10">2</div>
            <div className="w-8 h-8 bg-white border border-gray-200 text-gray-300 rounded-full flex items-center justify-center font-bold text-xs">3</div>
            <div className="w-8 h-8 bg-white border border-gray-200 text-gray-300 rounded-full flex items-center justify-center font-bold text-xs">4</div>
          </div>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] text-center w-full">Social & Audience</span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[760px] bg-white rounded-[24px] shadow-[0_4px_40px_rgb(0,0,0,0.03)] relative overflow-hidden border border-gray-50 border-t-2 border-t-[#050B18]">
        <div className="px-12 lg:px-20 py-16">
          <h1 className="text-[#050B18] text-3xl font-extrabold text-center mb-16 tracking-tight">Your digital presence</h1>

          {/* Section 1: Social Links */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Social Profiles</h4>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[#050B18] text-xs font-bold">YouTube Channel</label>
                <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#f9fafb] border-r border-gray-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  </div>
                  <input 
                    type="text" 
                    name="youtube"
                    value={form.youtube}
                    onChange={handleChange}
                    placeholder="https://youtube.com/c/yourchannel" 
                    className="flex-1 h-12 px-4 text-sm focus:outline-none placeholder:text-gray-300 font-medium text-gray-600" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[#050B18] text-xs font-bold">LinkedIn Profile</label>
                <div className={`flex items-center bg-white border ${errors.linkedin ? 'border-red-500' : 'border-gray-200'} rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors`}>
                  <div className="w-12 h-12 flex items-center justify-center bg-[#f9fafb] border-r border-gray-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </div>
                  <input 
                    type="text" 
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile" 
                    className="flex-1 h-12 px-4 text-sm focus:outline-none placeholder:text-gray-300 font-medium text-gray-600" 
                  />
                </div>
                {errors.linkedin && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.linkedin}</p>}
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <label className="text-[#050B18] text-xs font-bold">Personal Website / Portfolio</label>
              <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
                <div className="w-12 h-12 flex items-center justify-center bg-[#f9fafb] border-r border-gray-100">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                </div>
                <input 
                  type="text" 
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://www.yourwebsite.com" 
                  className="flex-1 h-12 px-4 text-sm focus:outline-none placeholder:text-gray-300 font-medium text-gray-600" 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Audience Insights */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Audience Insights</h4>
            </div>

            <div className="space-y-12">
              {/* Gender Distribution */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <label className="text-[#050B18] text-xs font-bold block mb-1">Gender Distribution</label>
                    <p className="text-gray-400 text-[10px] font-medium">Approximate split of your audience</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[#050B18] font-bold text-sm">{genderDist}%</span>
                    <span className="text-gray-300 text-[10px] font-bold ml-1 uppercase">Female</span>
                  </div>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-[#050B18] transition-all duration-500"
                    style={{ width: `${genderDist}%` }}
                  ></div>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={genderDist} 
                  onChange={(e) => setGenderDist(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-transparent appearance-none cursor-pointer accent-[#050B18]"
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                  <span>100% Male</span>
                  <span>Neutral</span>
                  <span>100% Female</span>
                </div>
              </div>

              {/* Age Groups */}
              <div className="space-y-6">
                <label className="text-[#050B18] text-xs font-bold block">Primary Age Group</label>
                <div className="flex flex-wrap gap-3">
                  {['13-17', '18-24', '25-34', '35-44', '45+'].map((age) => (
                    <button
                      key={age}
                      onClick={() => setSelectedAge(age)}
                      className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border ${
                        selectedAge === age 
                          ? 'bg-[#050B18] text-white border-[#050B18]' 
                          : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
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
          <div className="flex items-center gap-12 mt-16 pt-10 border-t border-gray-50">
            <button 
              onClick={() => navigate('/creator/step1')}
              className="text-gray-400 font-bold text-[14px] hover:text-[#050B18] transition-colors px-6"
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              disabled={loading}
              className="flex-1 h-16 bg-[#010B1F] text-white rounded-[12px] font-bold text-[16px] flex items-center justify-center gap-3 hover:bg-[#02152a] transition-all shadow-[0_12px_24px_-8px_rgba(1,11,31,0.5)] active:scale-[0.99] border-none outline-none"
            >
              {loading ? "Saving..." : "Save & Continue"}
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

export default Step2_Creator_Social;
