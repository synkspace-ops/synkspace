// frontend/src/pages/brand/Step2_Brand_Registration.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../../lib/api';

const Step2_Brand_Registration = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiPost("/api/auth/register", {
  role: "brand",
  email: form.email,
  password: form.password,
});
      console.log("Success:", response);
      // Assuming next step is step3
      navigate('/brand/step3');
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-['Inter',sans-serif] bg-white overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-[#050B18] p-16 relative overflow-hidden justify-between">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]"></div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-24">
            <div className="flex items-center justify-center">
              <img
                src="https://fahadkasim.wordpress.com/wp-content/uploads/2026/04/chatgpt-image-apr-26-2026-02_33_31-pm.png"
                alt="SynkSpace logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">
              SynkSpace
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-white text-6xl font-bold leading-[1.1] mb-20 tracking-tight">
            Scale with the <br />SynkSpace Network.
          </h1>

          {/* Features */}
          <div className="space-y-12">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-[#1E293B]/60 rounded-xl flex items-center justify-center border border-white/5 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold mb-1">Access 12k+ Creators</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Verified influencers ready to collaborate.</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-[#1E293B]/60 rounded-xl flex items-center justify-center border border-white/5 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 9V3M12 21v-6M9 12H3M21 12h-6M18.36 18.36l-4.24-4.24M9.88 9.88l-4.24-4.24M18.36 5.64l-4.24 4.24M9.88 14.12l-4.24 4.24"></path></svg>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold mb-1">Data-Driven Matchmaking</h3>
                <p className="text-gray-400 text-sm leading-relaxed">AI-powered recommendations for your brand.</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-[#1E293B]/60 rounded-xl flex items-center justify-center border border-white/5 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path></svg>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold mb-1">Automated ROI Tracking</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Real-time performance analytics.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Card */}
        <div className="relative z-10">
          <div className="bg-[#1E293B]/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm max-w-[360px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Top Performing Creator</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center overflow-hidden border border-white/10">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="avatar" className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Sarah Jenkins</h4>
                  <p className="text-gray-400 text-[11px] mt-0.5 font-medium">Lifestyle & Fashion</p>
                </div>
              </div>
              <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-lg">
                +24%
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0F172A]/40 rounded-xl p-3 border border-white/5">
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-tighter mb-1">Reach</p>
                <p className="text-white font-bold text-xs uppercase">850K</p>
              </div>
              <div className="bg-[#0F172A]/40 rounded-xl p-3 border border-white/5">
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-tighter mb-1">Eng.</p>
                <p className="text-white font-bold text-xs uppercase">4.8%</p>
              </div>
              <div className="bg-[#0F172A]/40 rounded-xl p-3 border border-white/5">
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-tighter mb-1">Conv.</p>
                <p className="text-white font-bold text-xs uppercase">3.2%</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-8">
            <a href="#" className="text-gray-500 text-xs hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 text-xs hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-12 lg:p-24 overflow-y-auto bg-white">
        <div className="w-full max-w-[460px]">
          {/* Header */}
          <div className="flex justify-between items-start mb-14">
            <div>
              <h2 className="text-[#050B18] text-4xl font-extrabold mb-2 tracking-tight">Brand Registration</h2>
              <p className="text-gray-400 text-base font-medium">Step 1: Company Profile</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 bg-[#050B18] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg shadow-blue-900/10">1</div>
              <div className="w-9 h-9 border border-gray-200 text-gray-400 rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div className="w-9 h-9 border border-gray-200 text-gray-400 rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div className="w-9 h-9 border border-gray-200 text-gray-400 rounded-full flex items-center justify-center text-xs font-bold">4</div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Company Logo Upload */}
            <div className="space-y-3">
              <label className="text-gray-600 text-[13px] font-bold ml-1">Company Logo</label>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload</span>
                </div>
                <div>
                  <h4 className="text-[#050B18] text-sm font-bold mb-1">Upload your brand mark</h4>
                  <p className="text-gray-300 text-[11px] leading-relaxed max-w-[220px] font-medium">Recommended size: 400x400px.<br />Supported formats: JPG, PNG. Max file size: 5MB.</p>
                </div>
              </div>
            </div>

            {/* Company Name */}
            <div className="space-y-2.5">
              <label className="text-gray-600 text-[13px] font-bold ml-1">Company Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                </div>
                <input
                  type="text"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corp"
                  className="w-full h-12 bg-white border border-gray-100 rounded-lg pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/20 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                />
              </div>
            </div>

            {/* Brand Website */}
            <div className="space-y-2.5">
              <label className="text-gray-600 text-[13px] font-bold ml-1">Brand Website</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                </div>
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://www.example.com"
                  className="w-full h-12 bg-white border border-gray-100 rounded-lg pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/20 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                />
              </div>
            </div>

            {/* Industry & Company Size */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-bold ml-1">Industry</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>
                  <select
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    className="w-full h-12 bg-white border border-gray-100 rounded-lg pl-12 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/20 transition-all text-gray-600 font-medium appearance-none shadow-sm"
                  >
                    <option value="">Select industry</option>
                    <option value="ecommerce">E-Commerce</option>
                    <option value="tech">Technology</option>
                    <option value="fashion">Fashion & Apparel</option>
                    <option value="health">Health & Wellness</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 10 12 15 17 10"></polyline></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-bold ml-1">Company Size</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>
                  <select
                    name="companySize"
                    value={form.companySize}
                    onChange={handleChange}
                    className="w-full h-12 bg-white border border-gray-100 rounded-lg pl-12 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/20 transition-all text-gray-600 font-medium appearance-none shadow-sm"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201+">201+ employees</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 10 12 15 17 10"></polyline></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Headquarters Location */}
            <div className="space-y-2.5">
              <label className="text-gray-600 text-[13px] font-bold ml-1">Headquarters Location</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="w-full h-12 bg-white border border-gray-100 rounded-lg pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/20 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#010B1F] text-white rounded-[12px] font-bold text-[16px] flex items-center justify-center gap-3 hover:bg-[#02152a] transition-all shadow-[0_12px_24px_-8px_rgba(1,11,31,0.5)] active:scale-[0.99] border-none outline-none"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    Save & Continue
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-400 mt-10 font-medium">
            Already registered? <a href="#" className="text-[#050B18] font-bold hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step2_Brand_Registration;