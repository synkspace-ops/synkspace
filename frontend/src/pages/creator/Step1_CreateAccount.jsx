// frontend/src/pages/creator/Step1_CreateAccount.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { apiPost } from '../../lib/api';
import { saveOnboardingStep } from '../../lib/onboardingProgress';

const Step1_CreateAccount = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    country: '',
    state: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    
    // Validation
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = "Required";
    if (!form.username) newErrors.username = "Required";
    if (!form.email) {
      newErrors.email = "Required";
    } else if (!form.email.includes('@') || !form.email.includes('.')) {
      newErrors.email = "Invalid email format";
    }
    if (!form.phone) newErrors.phone = "Required";
    if (!form.password) {
      newErrors.password = "Required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!form.country) newErrors.country = "Required";
    if (!form.state) newErrors.state = "Required";
    if (!form.city) newErrors.city = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await saveOnboardingStep("creator", "step1", { ...form });

      try {
        await apiPost("/api/auth/register", {
          role: "CREATOR",
          email: form.email,
          password: form.password,
        });
      } catch (authError) {
        console.warn("Auth registration did not complete, onboarding data is still saved:", authError);
      }

      let loginRes = null;
      try {
        loginRes = await apiPost("/api/auth/login", {
          email: form.email,
          password: form.password,
        });
      } catch (authError) {
        console.warn("Auth login did not complete, continuing with saved onboarding:", authError);
      }

      const token = loginRes?.data?.accessToken;
      if (token) localStorage.setItem("token", token);

      navigate("/creator/step2");
    } catch (error) {
      console.error("Error saving creator step 1:", error);
      setErrors((prev) => ({ ...prev, submit: "Could not save this step. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-['Inter'] bg-white overflow-hidden">
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
            Join the <br />SynkSpace Network.
          </h1>

          {/* Features */}
          <div className="space-y-12">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-[#1E293B]/60 rounded-xl flex items-center justify-center border border-white/5 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold mb-1">Access 850+ Brands</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Connect with top-tier global partnerships.</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-[#1E293B]/60 rounded-xl flex items-center justify-center border border-white/5 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold mb-1">Secure Escrow Payments</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Guaranteed payouts for every campaign.</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-[#1E293B]/60 rounded-xl flex items-center justify-center border border-white/5 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold mb-1">Verified Creator Status</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Get the blue check and boost credibility.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Card */}
        <div className="relative z-10">
          <div className="bg-[#1E293B]/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm max-w-[340px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Trending Campaign</span>
              </div>
              <span className="bg-gray-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">ACTIVE</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#050B18] font-bold text-sm">
                  NB
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Neon Beverage Launch</h4>
                  <p className="text-gray-400 text-xs mt-0.5">$2.5k - $5k / post</p>
                </div>
              </div>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-[#1E293B] bg-gray-400 overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" alt="avatar" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-[#1E293B] bg-gray-500 overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" alt="avatar" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-[#1E293B] bg-[#050B18] flex items-center justify-center text-[10px] font-bold text-white">
                  +42
                </div>
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
              <h2 className="text-[#050B18] text-4xl font-extrabold mb-2 tracking-tight">Create your account</h2>
              <p className="text-gray-400 text-base font-medium">Step 1: Basic Information</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 bg-[#050B18] text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div className="w-9 h-9 border border-gray-200 text-gray-400 rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div className="w-9 h-9 border border-gray-200 text-gray-400 rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div className="w-9 h-9 border border-gray-200 text-gray-400 rounded-full flex items-center justify-center text-xs font-bold">4</div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-semibold ml-1">Full Name</label>
                <div className="relative group">
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className={`w-full h-12 bg-white border ${errors.fullName ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-gray-300`}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName}</p>}
                  <div className="absolute right-4 top-6 -translate-y-1/2 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-semibold ml-1">Username</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">@</span>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="janedoe"
                    className={`w-full h-12 bg-white border ${errors.username ? 'border-red-500' : 'border-gray-200'} rounded-lg pl-8 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-gray-300`}
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1 ml-1">{errors.username}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-semibold ml-1">Email Address</label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className={`w-full h-12 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-gray-300`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                  <div className="absolute right-4 top-6 -translate-y-1/2 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-semibold ml-1">Phone Number</label>
                <div className="relative group">
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full h-12 bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-gray-300`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                  <div className="absolute right-4 top-6 -translate-y-1/2 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-gray-600 text-[13px] font-semibold ml-1">Password</label>
              <div className="relative group">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className={`w-full h-12 bg-white border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-gray-300`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                <div className="absolute right-4 top-6 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <label className="text-gray-600 text-[13px] font-semibold ml-1">Location</label>
              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <select 
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className={`w-full h-12 bg-white border ${errors.country ? 'border-red-500' : 'border-gray-200'} rounded-lg px-3 appearance-none text-sm ${form.country ? 'text-gray-600' : 'text-gray-400'} focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all`}
                  >
                    <option value="">Country</option>
                    <option value="IN">India</option>
                    <option value="Others">Others</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
                <div className="relative">
                  {form.country === 'Others' ? (
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State / Region"
                      className={`w-full h-12 bg-white border ${errors.state ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-gray-300`}
                    />
                  ) : (
                    <>
                      <select 
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className={`w-full h-12 bg-white border ${errors.state ? 'border-red-500' : 'border-gray-200'} rounded-lg px-3 appearance-none text-sm ${form.state ? 'text-gray-600' : 'text-gray-400'} focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all`}
                      >
                        <option value="">State</option>
                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Puducherry">Puducherry</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                    </>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={`w-full h-12 bg-white border ${errors.city ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-gray-300`}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                {errors.country && <p className="text-red-500 text-xs mt-1 flex-1">{errors.country}</p>}
                {errors.state && <p className="text-red-500 text-xs mt-1 flex-1">{errors.state}</p>}
                {errors.city && <p className="text-red-500 text-xs mt-1 flex-1">{errors.city}</p>}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-14 bg-[#050B18] text-white rounded-lg font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-[#0a1629] transition-all shadow-xl shadow-blue-900/10 active:scale-[0.98] mt-8"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  Save & Continue
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-10">
            Already have an account? <a href="#" className="text-[#050B18] font-bold hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step1_CreateAccount;
