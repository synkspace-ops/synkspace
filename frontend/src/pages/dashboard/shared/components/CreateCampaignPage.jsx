import { useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function CreateCampaignPage() {
  const { addCampaign, currentUser } = useApp();
  const [form, setForm] = useState({
    title: '',
    brandName: '',
    category: '',
    description: '',
    location: '',
    totalSlots: '1',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
    guidelines: '',
    status: 'active',
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter'];
  const deliverableOptions = ['Reel', 'Post', 'Story', 'Video', 'Thread'];

  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const toggleDeliverable = (deliverable) => {
    setDeliverables(prev =>
      prev.includes(deliverable) ? prev.filter(d => d !== deliverable) : [...prev, deliverable]
    );
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLaunch = async (status = 'active') => {
    setError('');
    if (!form.title.trim()) {
      setError("Please enter a campaign title.");
      return;
    }
    if (!form.description.trim() || !form.category || !form.location.trim()) {
      setError("Please complete campaign description, category, and location.");
      return;
    }
    if (!form.budgetMin || !form.budgetMax || Number(form.budgetMax) < Number(form.budgetMin)) {
      setError("Please enter a valid budget range.");
      return;
    }
    if (!form.deadline) {
      setError("Please select a campaign deadline.");
      return;
    }
    if (selectedPlatforms.length === 0 || deliverables.length === 0) {
      setError("Please choose at least one platform and deliverable.");
      return;
    }

    setSaving(true);
    try {
      await addCampaign({
        title: form.title.trim(),
        description: [form.description, form.guidelines].filter(Boolean).join("\n\nGuidelines:\n"),
        category: form.category,
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
        totalSlots: Number(form.totalSlots) || 1,
        location: form.location.trim(),
        platforms: selectedPlatforms,
        deliverables: deliverables.join(", "),
        deadline: new Date(form.deadline).toISOString(),
        status,
      });
    } catch (err) {
      console.error("Error creating campaign:", err);
      setError("Could not save campaign to the database. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 font-sans text-slate-800 flex flex-col gap-4 sm:gap-6 w-full">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide mb-1">Create New Campaign</h1>
          <p className="text-white/80 text-sm">Fill in the details to launch your campaign</p>
        </header>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Campaign Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Enter campaign title"
                  className="w-full bg-white/50 border border-white/50 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Brand Name</label>
                <input
                  type="text"
                  value={form.brandName || currentUser?.companyName || ''}
                  onChange={(e) => updateField('brandName', e.target.value)}
                  placeholder="Enter brand name"
                  className="w-full bg-white/50 border border-white/50 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full bg-white/50 border border-white/50 rounded-2xl px-4 py-3 text-slate-800 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all appearance-none"
                >
                  <option value="">Select category</option>
                  <option>Fashion</option>
                  <option>Technology</option>
                  <option>Beauty</option>
                  <option>Fitness</option>
                  <option>Food & Beverage</option>
                  <option>Travel</option>
                </select>
              </div>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Campaign Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe your campaign objectives and requirements"
                  className="w-full bg-white/50 border border-white/50 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 resize-none transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Campaign Objective</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Brand Awareness', 'Sales', 'Event Promotion'].map((objective) => (
                    <button
                      key={objective}
                      className="px-4 py-3 bg-white/50 border border-white/50 rounded-2xl text-slate-700 hover:border-[#6f8e97] hover:text-[#6f8e97] hover:bg-white/80 transition-all text-sm font-medium"
                    >
                      {objective}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Platforms</label>
                <div className="flex flex-wrap gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={`px-5 py-2.5 rounded-2xl transition-all text-sm font-semibold border ${
                        selectedPlatforms.includes(platform)
                          ? 'bg-[#6f8e97] border-[#6f8e97] text-white shadow-md'
                          : 'bg-white/50 border-white/50 text-slate-600 hover:border-[#6f8e97]'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Targeting */}
          <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Creator Targeting</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Creator Niche</label>
                <input
                  type="text"
                  placeholder="e.g., Fashion, Tech, Beauty"
                  className="w-full bg-white/50 border border-white/50 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-2 text-sm">Min Followers</label>
                  <input
                    type="text"
                    placeholder="10,000"
                    className="w-full bg-white/50 border border-white/50 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2 text-sm">Max Followers</label>
                  <input
                    type="text"
                    placeholder="100,000"
                    className="w-full bg-white/50 border border-white/50 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Enter location"
                  className="w-full bg-white/50 border border-white/50 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Deliverables */}
          <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Deliverables</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Content Type</label>
                <div className="flex flex-wrap gap-3">
                  {deliverableOptions.map((deliverable) => (
                    <button
                      key={deliverable}
                      onClick={() => toggleDeliverable(deliverable)}
                      className={`px-5 py-2.5 rounded-2xl transition-all text-sm font-semibold border ${
                        deliverables.includes(deliverable)
                          ? 'bg-[#6f8e97] border-[#6f8e97] text-white shadow-md'
                          : 'bg-white/50 border-white/50 text-slate-600 hover:border-[#6f8e97]'
                      }`}
                    >
                      {deliverable}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Number of Posts</label>
                <input
                  type="number"
                  value={form.totalSlots}
                  min="1"
                  onChange={(e) => updateField('totalSlots', e.target.value)}
                  placeholder="e.g., 3"
                  className="w-full bg-white/50 border border-white/50 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Budget & Payment</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-2 text-sm">Minimum Budget</label>
                  <input
                    type="number"
                    min="1"
                    value={form.budgetMin}
                    onChange={(e) => updateField('budgetMin', e.target.value)}
                    placeholder="5000"
                    className="w-full bg-white/50 border border-white/50 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2 text-sm">Maximum Budget</label>
                  <input
                    type="number"
                    min="1"
                    value={form.budgetMax}
                    onChange={(e) => updateField('budgetMax', e.target.value)}
                    placeholder="15000"
                    className="w-full bg-white/50 border border-white/50 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Payment Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Fixed', 'Barter', 'Affiliate'].map((type) => (
                    <button
                      key={type}
                      className="px-4 py-3 bg-white/50 border border-white/50 rounded-2xl text-slate-700 hover:border-[#6f8e97] hover:text-[#6f8e97] hover:bg-white/80 transition-all text-sm font-medium"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional */}
          <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Additional Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => updateField('deadline', e.target.value)}
                  className="w-full bg-white/50 border border-white/50 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Campaign Guidelines</label>
                <textarea
                  rows={3}
                  value={form.guidelines}
                  onChange={(e) => updateField('guidelines', e.target.value)}
                  placeholder="Any specific guidelines or requirements for creators"
                  className="w-full bg-white/50 border border-white/50 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 resize-none transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Attach Files</label>
                <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center hover:border-[#6f8e97] transition-all cursor-pointer bg-white/40 backdrop-blur-sm">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-700 font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500">PDF, PNG, JPG (max 10MB)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {error && <p className="text-sm font-semibold text-red-100 bg-red-500/40 border border-red-200/40 rounded-2xl px-4 py-3">{error}</p>}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button disabled={saving} onClick={() => handleLaunch('active')} className="flex-1 px-6 py-3.5 sm:py-4 bg-[#6f8e97] text-white rounded-2xl hover:bg-[#5A7684] transition-all font-bold shadow-lg shadow-[#6f8e97]/20 disabled:opacity-60">
              {saving ? 'Saving...' : 'Launch Campaign'}
            </button>
            <button disabled={saving} onClick={() => handleLaunch('draft')} className="sm:px-8 py-3.5 sm:py-4 bg-white/70 backdrop-blur-xl border border-white/60 text-slate-700 rounded-2xl hover:bg-white transition-all font-bold disabled:opacity-60">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

