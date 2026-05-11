import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOnboardingStep } from '../../lib/onboardingProgress';

const PRIMARY_AUDIENCE_OPTIONS = [
  'Startup',
  'Small Business (SMB)',
  'Enterprise / Corporate',
  'Agency (Marketing / Design / Tech)',
  'Creator Brand / Influencer',
  'Educational Institution',
  'Student Organization / College Club',
  'NGO / Non-Profit',
  'Event / Community Brand',
  'Other',
];

const Step3_Brand_Goals = () => {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState(['Micro-Influencers']);
  const [selectedObjective, setSelectedObjective] = useState('Brand Awareness');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Primary Audience multi-select state
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState([]);
  const [audienceOtherText, setAudienceOtherText] = useState('');
  const audienceRef = useRef(null);

  // Age & Interest single-select states
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('');

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (audienceRef.current && !audienceRef.current.contains(e.target)) {
        setAudienceOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleAudience = (option) => {
    if (selectedAudience.includes(option)) {
      setSelectedAudience(selectedAudience.filter((o) => o !== option));
      if (option === 'Other') setAudienceOtherText('');
    } else {
      setSelectedAudience([...selectedAudience, option]);
    }
  };

  const removeAudience = (option) => {
    setSelectedAudience(selectedAudience.filter((o) => o !== option));
    if (option === 'Other') setAudienceOtherText('');
  };

  const influencerTypes = [
    'Nano-Influencers', 'Micro-Influencers', 
    'Macro-Influencers', 'Event Promoters'
  ];

  const objectives = [
    {
      id: 'Brand Awareness',
      title: 'Brand Awareness',
      desc: 'Maximize reach & impressions',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 15h2a2 2 0 1 0 0-4h-2V7a2 2 0 1 0-4 0v5"></path>
          <path d="M4 13a8 8 0 0 1 7-7 8.6 8.6 0 0 1 5 2"></path>
          <path d="m17 11 4 4-4 4"></path>
        </svg>
      )
    },
    {
      id: 'App Installs',
      title: 'App Installs',
      desc: 'Drive downloads & signups',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      )
    },
    {
      id: 'Product Sales',
      title: 'Product Sales',
      desc: 'Boost conversions & revenue',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
          <path d="M3 6h18"></path>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      )
    },
    {
      id: 'Event Footfall',
      title: 'Event Footfall',
      desc: 'Increase physical attendance',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      )
    }
  ];

  const toggleType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleNext = async () => {
    const newErrors = {};
    if (selectedTypes.length === 0) newErrors.types = "Select at least one influencer type";
    if (!selectedObjective) newErrors.objective = "Please select a primary objective";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await saveOnboardingStep("brand", "step3", { selectedTypes, selectedObjective, selectedAudience, audienceOtherText, selectedAgeGroup, selectedInterest });
      navigate('/brand/step3');
    } catch (error) {
      console.error("Error saving brand step 2:", error);
      setErrors((prev) => ({ ...prev, submit: "Could not save this step. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem("onboardingData") || "{}");
      localStorage.setItem(
        "onboardingData",
        JSON.stringify({
          ...(existing && typeof existing === "object" ? existing : {}),
          brand: {
            ...((existing && typeof existing === "object" && existing.brand && typeof existing.brand === "object")
              ? existing.brand
              : {}),
            step3: { selectedTypes, selectedObjective, selectedAudience, audienceOtherText, selectedAgeGroup, selectedInterest },
          },
        })
      );
    } catch (_) {}
  }, [selectedTypes, selectedObjective, selectedAudience, audienceOtherText, selectedAgeGroup, selectedInterest]);

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
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] text-center w-full">Campaign Goals</span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[760px] bg-white rounded-[24px] shadow-[0_4px_40px_rgb(0,0,0,0.03)] relative overflow-hidden border border-gray-50 border-t-2 border-t-[#050B18]">
        <div className="px-12 lg:px-20 py-16">
          <div className="text-center mb-16">
            <h1 className="text-[#050B18] text-4xl font-extrabold mb-4 tracking-tight">What are you looking for?</h1>
            <p className="text-gray-400 text-sm font-medium">Define your campaign needs to match with the perfect creators.</p>
          </div>

          {/* Section 1: Influencer Types */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 border-b border-gray-100 pb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Influencer Types</h4>
            </div>

            <div className="space-y-6">
              <p className="text-gray-300 text-[11px] font-medium px-1">Select all that apply to your campaign strategy.</p>
              {errors.types && <p className="text-red-500 text-[10px] ml-1">{errors.types}</p>}
              <div className="flex flex-wrap gap-4">
                {influencerTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-6 py-3 rounded-full text-xs font-bold transition-all border ${
                      selectedTypes.includes(type)
                        ? 'bg-[#050B18] text-white border-[#050B18] shadow-lg shadow-blue-900/10'
                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Primary Objectives */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 border-b border-gray-100 pb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Primary Objectives</h4>
            </div>
            {errors.objective && <p className="text-red-500 text-[10px] mb-4 ml-1">{errors.objective}</p>}

            <div className="grid grid-cols-2 gap-6">
              {objectives.map((obj) => (
                <div
                  key={obj.id}
                  onClick={() => setSelectedObjective(obj.id)}
                  className={`flex items-start gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedObjective === obj.id
                      ? 'bg-white border-[#050B18] shadow-lg shadow-blue-900/5'
                      : 'bg-white border-gray-50 hover:border-gray-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    selectedObjective === obj.id ? 'bg-[#050B18] text-white' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {obj.icon}
                  </div>
                  <div>
                    <h5 className="text-[#050B18] text-sm font-bold mb-1 tracking-tight">{obj.title}</h5>
                    <p className="text-gray-400 text-[11px] font-medium leading-relaxed">{obj.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Target Audience */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 border-b border-gray-100 pb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Target Audience</h4>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                {/* Primary Audience Multi-Select */}
                <div className="space-y-2.5" ref={audienceRef}>
                  <label className="text-gray-600 text-[13px] font-bold ml-1">Primary Audience</label>
                  <div className="relative">
                    {/* Trigger button */}
                    <button
                      type="button"
                      onClick={() => setAudienceOpen((prev) => !prev)}
                      className="w-full min-h-[48px] bg-white border border-gray-100 rounded-lg px-4 pr-10 text-left text-sm focus:outline-none focus:border-blue-500 transition-all font-medium shadow-sm flex flex-wrap gap-1.5 items-center py-2"
                    >
                      {selectedAudience.length === 0 ? (
                        <span className="text-gray-300">Select audience types</span>
                      ) : (
                        selectedAudience.map((opt) => (
                          <span
                            key={opt}
                            className="inline-flex items-center gap-1 bg-[#050B18] text-white text-[10px] font-bold px-2.5 py-1 rounded-full"
                          >
                            {opt}
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeAudience(opt); }}
                              className="ml-0.5 hover:text-gray-300 transition-colors leading-none"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </button>
                    {/* Chevron icon */}
                    <div className="absolute right-4 top-3.5 pointer-events-none text-gray-300">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: audienceOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                      >
                        <polyline points="7 10 12 15 17 10"></polyline>
                      </svg>
                    </div>
                    {/* Dropdown panel */}
                    {audienceOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                        <div className="max-h-52 overflow-y-auto py-1">
                          {PRIMARY_AUDIENCE_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => toggleAudience(opt)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-medium transition-colors ${
                                selectedAudience.includes(opt)
                                  ? 'bg-[#050B18]/5 text-[#050B18]'
                                  : 'text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                                selectedAudience.includes(opt)
                                  ? 'bg-[#050B18] border-[#050B18]'
                                  : 'border-gray-200'
                              }`}>
                                {selectedAudience.includes(opt) && (
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                )}
                              </span>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* "Other" text box */}
                  {selectedAudience.includes('Other') && (
                    <input
                      type="text"
                      value={audienceOtherText}
                      onChange={(e) => setAudienceOtherText(e.target.value)}
                      placeholder="Please describe your audience..."
                      className="w-full h-11 bg-white border border-gray-100 rounded-lg px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/20 transition-all placeholder:text-gray-300 font-medium text-gray-600 shadow-sm mt-2"
                    />
                  )}
                </div>
                <div className="space-y-2.5">
                  <label className="text-gray-600 text-[13px] font-bold ml-1">Primary Age Group</label>
                  <div className="relative group">
                    <select 
                      value={selectedAgeGroup}
                      onChange={(e) => setSelectedAgeGroup(e.target.value)}
                      className="w-full h-12 bg-white border border-gray-100 rounded-lg px-4 pr-10 text-sm focus:outline-none focus:border-blue-500 transition-all text-gray-600 font-medium appearance-none shadow-sm"
                    >
                      <option value="">Select Age Group</option>
                      <option value="under-18">Under 18</option>
                      <option value="18-24">18-24</option>
                      <option value="25-34">25-34</option>
                      <option value="35-44">35-44</option>
                      <option value="45-54">45-54</option>
                      <option value="55-64">55-64</option>
                      <option value="65+">65+</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 10 12 15 17 10"></polyline></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-bold ml-1">Niche Interests</label>
                <div className="relative group">
                  <select 
                    value={selectedInterest}
                    onChange={(e) => setSelectedInterest(e.target.value)}
                    className="w-full h-12 bg-white border border-gray-100 rounded-lg px-4 pr-10 text-sm focus:outline-none focus:border-blue-500 transition-all text-gray-600 font-medium appearance-none shadow-sm"
                  >
                    <option value="">Select Category</option>
                    <option value="fashion">Fashion & Apparel</option>
                    <option value="technology">Technology & Gadgets</option>
                    <option value="food">Food & Beverage</option>
                    <option value="travel">Travel & Leisure</option>
                    <option value="health">Health & Wellness</option>
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="sports">Sports</option>
                    <option value="art">Art & Design</option>
                    <option value="finance">Finance & Crypto</option>
                    <option value="gaming">Gaming & Esports</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 10 12 15 17 10"></polyline></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-12 mt-16 pt-10 border-t border-gray-50">
            <button 
              onClick={() => navigate('/brand/step1')}
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

export default Step3_Brand_Goals;
