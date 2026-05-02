// frontend/src/pages/event/Event_Step1_CreateAccount.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { apiPost } from '../../lib/api';

const Event_Step1_CreateAccount = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    eventType: '',
    country: '',
    state: '',
    city: ''
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
  role: "event",
  email: form.email,
  password: form.password,
});
      console.log("Success:", response);
      navigate('/event/step2');
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-['Inter',sans-serif] bg-white overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-[#050B18] p-16 relative overflow-hidden justify-start">
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
            Host with the <br />SynkSpace Network.
          </h1>

          {/* Features */}
          <div className="space-y-12">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-[#1E293B]/60 rounded-xl flex items-center justify-center border border-white/5 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold mb-1">Reach Local Creators</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Connect with influencers in your area.</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-[#1E293B]/60 rounded-xl flex items-center justify-center border border-white/5 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold mb-1">Boost Event Attendance</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Drive ticket sales and RSVPs effortlessly.</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-[#1E293B]/60 rounded-xl flex items-center justify-center border border-white/5 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold mb-1">Secure RSVP Tracking</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Real-time guest list management.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Card */}
        <div className="relative z-10 mt-24">
          <div className="bg-[#1E293B]/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm max-w-[360px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Active Event</span>
              </div>
              <span className="bg-gray-600/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/10 tracking-widest">LIVE</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm tracking-tight">Tech Summit 2024</h4>
                <p className="text-gray-400 text-[11px] font-medium mt-0.5">San Francisco, CA</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0F172A]/40 rounded-xl p-4 border border-white/5">
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1.5">Invited Creators</p>
                <p className="text-white font-bold text-xl">124</p>
              </div>
              <div className="bg-[#0F172A]/40 rounded-xl p-4 border border-white/5">
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1.5">Digital Reach</p>
                <p className="text-white font-bold text-xl uppercase">1.2M+</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-12 flex gap-8">
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
              <h2 className="text-[#050B18] text-4xl font-extrabold mb-2 tracking-tight">Create event account</h2>
              <p className="text-gray-400 text-base font-medium">Step 1: Organizer Details</p>
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
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-bold ml-1">Full Name</label>
                <div className="relative group">
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className="w-full h-12 bg-white border border-gray-100 rounded-lg px-4 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/20 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-bold ml-1">Organizer / Company</label>
                <div className="relative group">
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Acme Events LLC"
                    className="w-full h-12 bg-white border border-gray-100 rounded-lg px-4 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/20 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4"></path><line x1="9" y1="21" x2="9" y2="14"></line><line x1="15" y1="21" x2="15" y2="14"></line></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-bold ml-1">Work Email</label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    className="w-full h-12 bg-white border border-gray-100 rounded-lg px-4 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/20 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-bold ml-1">Phone Number</label>
                <div className="relative group">
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-12 bg-white border border-gray-100 rounded-lg px-4 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/20 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-gray-600 text-[13px] font-bold ml-1">Event Type</label>
              <div className="relative group">
                <select
                  name="eventType"
                  value={form.eventType}
                  onChange={handleChange}
                  className="w-full h-12 bg-white border border-gray-100 rounded-lg px-4 appearance-none text-sm text-gray-400 font-medium focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                >
                  <option value="">Select event category</option>
                  <option value="music">Music & Festival</option>
                  <option value="tech">Tech & Business</option>
                  <option value="sports">Sports & Outdoor</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 10 12 15 17 10"></polyline></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-gray-600 text-[13px] font-bold ml-1">Location</label>
              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full h-12 bg-white border border-gray-100 rounded-lg px-3 appearance-none text-sm text-gray-400 font-medium focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="">Country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 10 12 15 17 10"></polyline></svg>
                  </div>
                </div>
                <div className="relative">
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full h-12 bg-white border border-gray-100 rounded-lg px-3 appearance-none text-sm text-gray-400 font-medium focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="">State</option>
                    <option value="NY">New York</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 10 12 15 17 10"></polyline></svg>
                  </div>
                </div>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full h-12 bg-white border border-gray-100 rounded-lg px-4 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
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
            Already have an organizer account? <a href="#" className="text-[#050B18] font-bold hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Event_Step1_CreateAccount;