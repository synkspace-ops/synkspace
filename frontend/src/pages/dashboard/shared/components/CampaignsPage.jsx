import { MoreVertical, Users, Target, TrendingUp, Copy, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export function CampaignsPage() {
  const { campaigns, updateCampaignStatus, deleteCampaign, navigate } = useApp();
  const [filter, setFilter] = useState('all');

  const filteredCampaigns = campaigns.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-[#a3e4c7]/30 text-[#a3e4c7] border border-[#a3e4c7]/50';
      case 'completed': return 'bg-[#91c0cf]/30 text-[#91c0cf] border border-[#91c0cf]/50';
      case 'draft': return 'bg-white/20 text-white/80 border border-white/30';
      default: return 'bg-white/20 text-white/80 border border-white/30';
    }
  };

  const counts = {
  all: campaigns.length,
  active: campaigns.filter((c) => c.status === 'active').length,
  completed: campaigns.filter((c) => c.status === 'completed').length,
  draft: campaigns.filter((c) => c.status === 'draft').length,
};

  return (
    <div className="min-h-screen p-4 sm:p-6 font-sans text-slate-800 flex flex-col gap-4 sm:gap-6 w-full">
      <header className="mb-2 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide mb-1">Campaigns</h1>
          <p className="text-white/80 text-sm">Manage and track all your campaigns</p>
        </div>
        <button onClick={() => navigate('create-campaign')} className="self-start sm:self-auto px-5 py-2.5 bg-[#6f8e97] text-white rounded-2xl font-bold shadow-md shadow-[#6f8e97]/20 border border-[#6f8e97] hover:bg-[#5A7684] transition-all text-sm">
          + New Campaign
        </button>
      </header>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-2">
        {['all', 'active', 'completed', 'draft'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-2xl transition-all font-semibold ${
              filter === f 
                ? 'bg-[#6f8e97] text-white shadow-md shadow-[#6f8e97]/20 border border-[#6f8e97]' 
                : 'bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12 text-white/80 font-medium">No campaigns found in this status.</div>
        ) : filteredCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white/70 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 transition-all"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-800">{campaign.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${getStatusColor(campaign.status)}`}>
                    {campaign.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500">Deadline: {campaign.deadline}</p>
              </div>
              <button onClick={() => deleteCampaign(campaign.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white/50 rounded-xl transition-all">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            {campaign.status !== 'draft' && (
              <div className="mb-6">
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-500">Campaign Progress</span>
                  <span className="text-slate-700">{campaign.progress}%</span>
                </div>
                <div className="w-full bg-white/40 rounded-full h-2.5 overflow-hidden border border-white/50">
                  <div
                    className="bg-gradient-to-r from-[#6f8e97] to-[#91c0cf] h-full rounded-full transition-all"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-[#6f8e97]" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Creators</p>
                </div>
                <p className="text-xl font-bold text-slate-800">{campaign.creators}</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-[#6f8e97]" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Budget</p>
                </div>
                <p className="text-xl font-bold text-slate-800">{campaign.budget}</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[#6f8e97]" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Applications</p>
                </div>
                <p className="text-xl font-bold text-slate-800">{campaign.reach}</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[#f0ad9f]" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fill Rate</p>
                </div>
                <p className="text-xl font-bold text-slate-800">{campaign.engagement}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {campaign.status === 'draft' && (
                <button onClick={() => updateCampaignStatus(campaign.id, 'active')} className="px-6 py-3 bg-[#6f8e97] text-white rounded-2xl hover:bg-[#5A7684] transition-all font-bold shadow-sm shadow-[#6f8e97]/20">
                  Launch Campaign
                </button>
              )}
              {campaign.status === 'active' && (
                <button onClick={() => updateCampaignStatus(campaign.id, 'completed')} className="px-6 py-3 bg-[#6f8e97] text-white rounded-2xl hover:bg-[#5A7684] transition-all font-bold shadow-sm shadow-[#6f8e97]/20">
                  Mark Completed
                </button>
              )}
              <button onClick={() => navigate('analytics')} className="px-6 py-3 bg-white/60 border border-white/60 text-slate-700 rounded-2xl hover:bg-white hover:text-slate-900 transition-all flex items-center gap-2 font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
