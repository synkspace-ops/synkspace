import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOnboardingStep } from '../../lib/onboardingProgress';

const Event_Step2_Goals = () => {
  const navigate = useNavigate();
  const [selectedReqs, setSelectedReqs] = useState(['Local Micro-Influencers']);
  const [selectedGoal, setSelectedGoal] = useState('Increase Ticket Sales');
  const [form, setForm] = useState({
    footfall: '',
    budget: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const requirements = [
    'Local Micro-Influencers', 'Lifestyle Creators', 
    'Tech Reviewers', 'Campus Ambassadors'
  ];

  const goals = [
    {
      id: 'Increase Ticket Sales',
      title: 'Increase Ticket Sales',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
          <path d="M13 5v2"></path>
          <path d="M13 17v2"></path>
          <path d="M13 11v2"></path>
        </svg>
      )
    },
    {
      id: 'Boost Digital Hype',
      title: 'Boost Digital Hype',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m11 15 2 2 4-4"></path>
          <path d="M4 13a8 8 0 0 1 7-7 8.6 8.6 0 0 1 5 2"></path>
          <path d="m17 11 4 4-4 4"></path>
        </svg>
      )
    },
    {
      id: 'Verified Attendance',
      title: 'Verified Attendance',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
          <polyline points="16 11 18 13 22 9"></polyline>
        </svg>
      )
    },
    {
      id: 'Live Content Coverage',
      title: 'Live Content Coverage',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 7l-7 5 7 5V7z"></path>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="12" r="1.5"></circle>
        </svg>
      )
    }
  ];

  const toggleReq = (req) => {
    if (selectedReqs.includes(req)) {
      setSelectedReqs(selectedReqs.filter(r => r !== req));
    } else {
      setSelectedReqs([...selectedReqs, req]);
    }
  };

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem("onboardingData") || "{}");
      localStorage.setItem(
        "onboardingData",
        JSON.stringify({
          ...(existing && typeof existing === "object" ? existing : {}),
          event: {
            ...((existing && typeof existing === "object" && existing.event && typeof existing.event === "object")
              ? existing.event
              : {}),
            step2: { selectedReqs, selectedGoal, ...form },
          },
        })
      );
    } catch (_) {}
  }, [selectedReqs, selectedGoal, form]);

  const handleNext = async () => {
    const newErrors = {};
    if (!form.footfall) newErrors.footfall = "Required";
    if (!form.budget) newErrors.budget = "Required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await saveOnboardingStep("event", "step2", { selectedReqs, selectedGoal, ...form });
      navigate('/event/step3');
    } catch (error) {
      console.error("Error saving event step 2:", error);
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
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] text-center w-full">Event Goals & Requirements</span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[760px] bg-white rounded-[24px] shadow-[0_4px_40px_rgb(0,0,0,0.03)] relative overflow-hidden border border-gray-50 border-t-2 border-t-[#050B18]">
        <div className="px-12 lg:px-20 py-16">
          <h1 className="text-[#050B18] text-3xl font-extrabold text-center mb-16 tracking-tight">What are you looking to achieve?</h1>

          {/* Section 1: Influencer Requirements */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Influencer Requirements</h4>
            </div>

            <div className="flex flex-wrap gap-4">
              {requirements.map((req) => (
                <button
                  key={req}
                  onClick={() => toggleReq(req)}
                  className={`px-6 py-3 rounded-full text-xs font-bold transition-all border ${
                    selectedReqs.includes(req)
                      ? 'bg-[#050B18] text-white border-[#050B18] shadow-lg shadow-blue-900/10'
                      : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {req}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Primary Event Goals */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Primary Event Goals</h4>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedGoal === goal.id
                      ? 'bg-white border-[#050B18] shadow-lg shadow-blue-900/5'
                      : 'bg-white border-gray-50 hover:border-gray-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    selectedGoal === goal.id ? 'bg-[#050B18] text-white' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {goal.icon}
                  </div>
                  <h5 className={`text-sm font-bold tracking-tight transition-colors ${
                    selectedGoal === goal.id ? 'text-[#050B18]' : 'text-gray-400'
                  }`}>{goal.title}</h5>
                </div>
              ))}
            {errors.goal && <p className="text-red-500 text-[10px] mt-4 ml-1">{errors.goal}</p>}
            </div>
          </div>

          {/* Section 3: Estimated Reach & Budget */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Estimated Reach & Budget</h4>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-bold ml-1">Expected Footfall</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>
                  <input 
                    type="text" 
                    name="footfall"
                    value={form.footfall}
                    onChange={handleChange}
                    placeholder="e.g. 5000" 
                    className={`w-full h-12 bg-white border ${errors.footfall ? 'border-red-500' : 'border-gray-100'} rounded-lg pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm`}
                  />
                  {errors.footfall && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.footfall}</p>}
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-bold ml-1">Total Marketing Budget (₹)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path><path d="M6 12h.01M18 12h.01"></path></svg>
                  </div>
                  <input 
                    type="text" 
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    placeholder="e.g. 50,000" 
                    className={`w-full h-12 bg-white border ${errors.budget ? 'border-red-500' : 'border-gray-100'} rounded-lg pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm`}
                  />
                  {errors.budget && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.budget}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-12 mt-16 pt-10 border-t border-gray-50">
            <button 
              onClick={() => navigate('/event/step1')}
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

export default Event_Step2_Goals;
