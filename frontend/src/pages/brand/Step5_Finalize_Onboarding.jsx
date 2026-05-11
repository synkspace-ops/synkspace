import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../../lib/api';
import { persistDashboardUser } from '../../lib/dashboardUser';
import { buildOnboardingCompletePayload, clearOnboardingSession, saveOnboardingStep } from '../../lib/onboardingProgress';

const Step5_Finalize_Onboarding = () => {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState({
    brand: false,
    commission: false,
    escrow: false,
    conduct: false
  });
  const [errors, setErrors] = useState({});

  const toggleAgreement = (key) => {
    setAgreements(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem("onboardingData") || "{}");
      const next = {
        ...(existing && typeof existing === "object" ? existing : {}),
        brand: {
          ...((existing && typeof existing === "object" && existing.brand && typeof existing.brand === "object")
            ? existing.brand
            : {}),
          step5: { agreements },
        },
      };
      localStorage.setItem("onboardingData", JSON.stringify(next));
    } catch (_) {}
  }, [agreements]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const newErrors = {};
    if (!agreements.brand) newErrors.brand = "Please accept the agreement";
    if (!agreements.commission) newErrors.commission = "Please accept the commission structure";
    if (!agreements.escrow) newErrors.escrow = "Please accept the escrow system";
    if (!agreements.conduct) newErrors.conduct = "Please accept the code of conduct";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      await saveOnboardingStep("brand", "step5", { agreements });
      const stored = JSON.parse(localStorage.getItem("onboardingData"));
      const payload = buildOnboardingCompletePayload("brand");
      const response = await apiPost("/api/onboarding/complete", payload);
      persistDashboardUser("brand", stored, response?.data?.user);
      localStorage.removeItem("onboardingData");
      clearOnboardingSession();
      navigate("/brand/dashboard");
    } catch (error) {
      console.error("Error completing onboarding via API:", error);
      setErrors((prev) => ({ ...prev, submit: "Could not verify saved database details. Please try again." }));
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
            <div className="w-8 h-8 bg-[#050B18] text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-900/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div className="w-8 h-8 bg-[#050B18] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-900/10">4</div>
          </div>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] text-center w-full">Finalize Onboarding</span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[760px] bg-white rounded-[24px] shadow-[0_4px_40px_rgb(0,0,0,0.03)] relative overflow-hidden border border-gray-50 border-t-2 border-t-[#050B18]">
        <div className="px-12 lg:px-20 py-16">
          <h1 className="text-[#050B18] text-3xl font-extrabold text-center mb-16 tracking-tight leading-tight">Platform Guidelines & <br />Success Criteria</h1>

          {/* Section 1: The Sync Standard */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-8">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">The SynkSpace Standard</h4>
            </div>

            <div className="bg-[#f8fafc] rounded-2xl p-10 space-y-8 border border-gray-50">
              <p className="text-gray-500 text-[13px] font-medium leading-relaxed">We hold our brand partners to the highest standards of professional conduct to ensure a thriving ecosystem.</p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-5 h-5 bg-white border border-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <p className="text-gray-500 text-[13px] font-medium leading-relaxed">
                    <span className="text-[#050B18] font-bold">Commitment to fair payment terms:</span> Honoring agreed-upon rates and schedules for all creator collaborations.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="w-5 h-5 bg-white border border-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <p className="text-gray-500 text-[13px] font-medium leading-relaxed">
                    <span className="text-[#050B18] font-bold">Clear deliverable expectations:</span> Providing concise briefs and actionable feedback to creators.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="w-5 h-5 bg-white border border-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <p className="text-gray-500 text-[13px] font-medium leading-relaxed">
                    <span className="text-[#050B18] font-bold">Responsive communication:</span> Maintaining timely correspondence throughout active campaigns.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Detailed Legal Agreements */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Detailed Legal Agreements</h4>
            </div>

            <div className="space-y-8 px-2">
              {/* Checkbox 1 */}
              <div className="flex gap-6 items-start group cursor-pointer" onClick={() => toggleAgreement('brand')}>
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${agreements.brand ? 'bg-[#050B18] border-[#050B18]' : 'bg-white border-gray-200 group-hover:border-gray-300'}`}>
                  {agreements.brand && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
                <p className="text-gray-400 text-[13px] font-medium leading-relaxed">
                  I agree to the <span className="text-[#050B18] font-bold">Standard Brand Agreement</span>, which governs the overall relationship with SynkSpace.
                </p>
                {errors.brand && <p className="text-red-500 text-[10px] mt-1">{errors.brand}</p>}
              </div>

              {/* Checkbox 2 */}
              <div className="flex gap-6 items-start group cursor-pointer" onClick={() => toggleAgreement('commission')}>
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${agreements.commission ? 'bg-[#050B18] border-[#050B18]' : 'bg-white border-gray-200 group-hover:border-gray-300'}`}>
                  {agreements.commission && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
                <p className="text-gray-400 text-[13px] font-medium leading-relaxed">
                  I acknowledge the <span className="text-[#050B18] font-bold">10-20% commission structure</span> applied to successful campaign transactions.
                </p>
                {errors.commission && <p className="text-red-500 text-[10px] mt-1">{errors.commission}</p>}
              </div>

              {/* Checkbox 3 */}
              <div className="flex gap-6 items-start group cursor-pointer" onClick={() => toggleAgreement('escrow')}>
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${agreements.escrow ? 'bg-[#050B18] border-[#050B18]' : 'bg-white border-gray-200 group-hover:border-gray-300'}`}>
                  {agreements.escrow && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
                <p className="text-gray-400 text-[13px] font-medium leading-relaxed">
                  I agree to use the secure <span className="text-[#050B18] font-bold">Escrow system</span> for all payments to protect both parties.
                </p>
                {errors.escrow && <p className="text-red-500 text-[10px] mt-1">{errors.escrow}</p>}
              </div>

              {/* Checkbox 4 */}
              <div className="flex gap-6 items-start group cursor-pointer" onClick={() => toggleAgreement('conduct')}>
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${agreements.conduct ? 'bg-[#050B18] border-[#050B18]' : 'bg-white border-gray-200 group-hover:border-gray-300'}`}>
                  {agreements.conduct && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
                <p className="text-gray-400 text-[13px] font-medium leading-relaxed">
                  I consent to the <span className="text-[#050B18] font-bold">Community Code of Conduct</span>.
                </p>
                {errors.conduct && <p className="text-red-500 text-[10px] mt-1">{errors.conduct}</p>}
              </div>
            </div>
          </div>

          {errors.submit && (
            <p className="mt-8 text-sm font-semibold text-red-500">
              {errors.submit}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-12 mt-16 pt-10 border-t border-gray-50">
            <button 
              onClick={() => navigate('/brand/step3')}
              className="text-gray-400 font-bold text-[14px] hover:text-[#050B18] transition-colors px-6"
            >
              Back
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-1 h-16 bg-[#010B1F] text-white rounded-[12px] font-bold text-[16px] flex items-center justify-center gap-3 hover:bg-[#02152a] transition-all shadow-[0_12px_24px_-8px_rgba(1,11,31,0.5)] active:scale-[0.99] border-none outline-none"
            >
              Complete Onboarding
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
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

export default Step5_Finalize_Onboarding;
