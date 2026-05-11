import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOnboardingStep } from '../../lib/onboardingProgress';

const Step3_Creator_Value = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState(['Blogging', 'UGC']);
  const [preferences, setPreferences] = useState({
    barter: false,
    longTerm: true,
    travel: false
  });
  const [form, setForm] = useState({
    primaryNiche: '',
    rateReel: '',
    rateStory: '',
    rateEvent: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const categories = [
    'Photography', 'Video Production', 'Blogging', 
    'UGC', 'Live Streaming', 'Reviews',
    'Podcasting', 'Vlogging', 'Tutorials & How-tos',
    'Unboxing', 'Short-form Video', 'Long-form Video',
    'News & Commentary', 'Interviews', 'Live Events'
  ];

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const togglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
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
            step3: { selectedCategories, preferences, ...form },
          },
        })
      );
    } catch (_) {}
  }, [selectedCategories, preferences, form]);

  const handleNext = async () => {
    const newErrors = {};
    if (!form.primaryNiche || form.primaryNiche === 'Select your main category') newErrors.primaryNiche = "Required";
    if (selectedCategories.length === 0) newErrors.categories = "Select at least one";
    if (!form.rateReel) newErrors.rateReel = "Required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await saveOnboardingStep("creator", "step3", { selectedCategories, preferences, ...form });
      navigate('/creator/step4');
    } catch (error) {
      console.error("Error saving creator step 3:", error);
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
            <div className="w-8 h-8 bg-[#050B18] text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-900/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div className="w-8 h-8 bg-[#050B18] text-white rounded-full flex items-center justify-center font-bold text-xs">3</div>
            <div className="w-8 h-8 bg-white border border-gray-200 text-gray-300 rounded-full flex items-center justify-center font-bold text-xs">4</div>
          </div>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] text-center w-full">Professional Details</span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[760px] bg-white rounded-[24px] shadow-[0_4px_40px_rgb(0,0,0,0.03)] relative overflow-hidden border border-gray-50 border-t-2 border-t-[#050B18]">
        <div className="px-12 lg:px-20 py-16">
          <h1 className="text-[#050B18] text-3xl font-extrabold text-center mb-16 tracking-tight">Define Your Value</h1>

          {/* Section 1: Content & Niche */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Content & Niche</h4>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[#050B18] text-xs font-bold">Primary Niche</label>
                <div className="relative">
                  <select 
                    name="primaryNiche"
                    value={form.primaryNiche}
                    onChange={handleChange}
                    className={`w-full h-12 bg-white border ${errors.primaryNiche ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 appearance-none text-sm text-gray-400 font-medium focus:outline-none focus:border-blue-500 transition-all`}
                  >
                    <option value="">Select your main category</option>
                    <option value="Tech & Gaming">Tech & Gaming</option>
                    <option value="Lifestyle & Fashion">Lifestyle & Fashion</option>
                    <option value="Fitness & Wellness">Fitness & Wellness</option>
                    <option value="Beauty & Makeup">Beauty & Makeup</option>
                    <option value="Travel & Leisure">Travel & Leisure</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Business & Finance">Business & Finance</option>
                    <option value="Education & Learning">Education & Learning</option>
                    <option value="Entertainment & Comedy">Entertainment & Comedy</option>
                    <option value="Art & Design">Art & Design</option>
                    <option value="Parenting & Family">Parenting & Family</option>
                    <option value="Home & Decor">Home & Decor</option>
                  </select>
                  {errors.primaryNiche && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.primaryNiche}</p>}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-[#050B18] text-xs font-bold">Content Categories</label>
                  <span className="text-gray-300 text-[10px] font-medium">(Select all that apply)</span>
                </div>
                {errors.categories && <p className="text-red-500 text-[10px] ml-1">{errors.categories}</p>}
                <div className="flex flex-wrap gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border ${
                        selectedCategories.includes(cat)
                          ? 'bg-[#050B18] text-white border-[#050B18]'
                          : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Rate Card */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Rate Card</h4>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-4">
              <div className="space-y-2">
                <label className="text-[#050B18] text-xs font-bold">Rate per Reel</label>
                <div className={`flex items-center border ${errors.rateReel ? 'border-red-500' : 'border-gray-100'} rounded-lg overflow-hidden focus-within:border-blue-500`}>
                  <div className="w-10 h-12 bg-gray-50 flex items-center justify-center text-gray-400 text-sm font-bold border-r border-gray-50">$</div>
                  <input 
                    type="text" 
                    name="rateReel"
                    value={form.rateReel}
                    onChange={handleChange}
                    placeholder="0.00" 
                    className="flex-1 px-4 h-12 text-sm focus:outline-none placeholder:text-gray-200 text-gray-600 font-medium" 
                  />
                </div>
                {errors.rateReel && <p className="text-red-500 text-[10px] mt-1">{errors.rateReel}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[#050B18] text-xs font-bold">Rate per Story</label>
                <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden focus-within:border-blue-500">
                  <div className="w-10 h-12 bg-gray-50 flex items-center justify-center text-gray-400 text-sm font-bold border-r border-gray-50">$</div>
                  <input 
                    type="text" 
                    name="rateStory"
                    value={form.rateStory}
                    onChange={handleChange}
                    placeholder="0.00" 
                    className="flex-1 px-4 h-12 text-sm focus:outline-none placeholder:text-gray-200 text-gray-600 font-medium" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[#050B18] text-xs font-bold">Event Appearance Fee</label>
                <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden focus-within:border-blue-500">
                  <div className="w-10 h-12 bg-gray-50 flex items-center justify-center text-gray-400 text-sm font-bold border-r border-gray-50">$</div>
                  <input 
                    type="text" 
                    name="rateEvent"
                    value={form.rateEvent}
                    onChange={handleChange}
                    placeholder="0.00" 
                    className="flex-1 px-4 h-12 text-sm focus:outline-none placeholder:text-gray-200 text-gray-600 font-medium" 
                  />
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-[10px] font-medium px-1">Rates are indicative and can be negotiated per campaign.</p>
          </div>

          {/* Section 3: Collaboration Preferences */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Collaboration Preferences</h4>
            </div>

            <div className="space-y-4">
              <div className="bg-[#f8fafc] rounded-xl p-6 flex items-center justify-between border border-gray-50">
                <div>
                  <h5 className="text-[#050B18] text-[14px] font-bold mb-0.5 tracking-tight">Open to Barter</h5>
                  <p className="text-gray-400 text-[10px] font-medium">Accept products/services in exchange for content</p>
                </div>
                <button 
                  onClick={() => togglePreference('barter')}
                  className={`w-12 h-6 rounded-full transition-all relative ${preferences.barter ? 'bg-[#050B18]' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${preferences.barter ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="bg-[#f8fafc] rounded-xl p-6 flex items-center justify-between border border-gray-50">
                <div>
                  <h5 className="text-[#050B18] text-[14px] font-bold mb-0.5 tracking-tight">Open to Long-term Partnerships</h5>
                  <p className="text-gray-400 text-[10px] font-medium">Brand ambassadorships and retainer models</p>
                </div>
                <button 
                  onClick={() => togglePreference('longTerm')}
                  className={`w-12 h-6 rounded-full transition-all relative ${preferences.longTerm ? 'bg-[#050B18]' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${preferences.longTerm ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="bg-[#f8fafc] rounded-xl p-6 flex items-center justify-between border border-gray-50">
                <div>
                  <h5 className="text-[#050B18] text-[14px] font-bold mb-0.5 tracking-tight">Open to Travel</h5>
                  <p className="text-gray-400 text-[10px] font-medium">Available for events and campaigns outside current city</p>
                </div>
                <button 
                  onClick={() => togglePreference('travel')}
                  className={`w-12 h-6 rounded-full transition-all relative ${preferences.travel ? 'bg-[#050B18]' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${preferences.travel ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-12 mt-16 pt-10 border-t border-gray-50">
            <button 
              onClick={() => navigate('/creator/step2')}
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

export default Step3_Creator_Value;
