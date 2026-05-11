import { Check, X, MessageCircle, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export function ApplicationsPage() {
  const { applications, updateApplication, navigate } = useApp();
  const [filter, setFilter] = useState('all');

  const filteredApps = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-[#f0ad9f]/30 text-[#b5735c] border border-[#f0ad9f]/50';
      case 'shortlisted': return 'bg-[#91c0cf]/30 text-[#4f8396] border border-[#91c0cf]/50';
      case 'accepted': return 'bg-[#a3e4c7]/30 text-[#4c7569] border border-[#a3e4c7]/50';
      case 'rejected': return 'bg-[#f4a298]/30 text-[#a56754] border border-[#f4a298]/50';
      default: return 'bg-white/20 text-white/80 border border-white/30';
    }
  };

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 font-sans text-slate-800 flex flex-col gap-4 sm:gap-6 w-full">
      {/* Header */}
      <header className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide mb-1">Applications</h1>
        <p className="text-white/80 text-sm">Review and manage creator applications</p>
      </header>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-2">
        {['all', 'pending', 'shortlisted', 'accepted'].map(f => (
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

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="text-center py-12 text-white/80 font-medium">No applications found in this status.</div>
        ) : filteredApps.map((app) => (
          <div
            key={app.id}
            className="bg-white/70 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:bg-white/80 transition-all"
          >
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Creator Info */}
              <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-sm border border-white/40 ${app.color}`}>
                {app.creator.charAt(0)}
              </div>

              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{app.creator}</h3>
                    <p className="text-sm font-medium text-slate-500 mb-1">Applied for: <span className="text-[#6f8e97] font-bold">{app.campaign}</span></p>
                    <p className="text-sm font-medium text-slate-400">{app.followers} followers</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-bold text-slate-800 mb-2">{app.price}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Proposal */}
                <div className="bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl p-5 mb-5 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Proposal:</p>
                  <p className="text-slate-700 leading-relaxed font-medium">{app.proposal}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {app.status === 'pending' && (
                    <>
                      <button onClick={() => updateApplication(app.id, 'accepted')} className="px-5 py-2.5 bg-[#a3e4c7] text-[#345b4c] rounded-2xl hover:bg-[#8fd0b5] transition-all flex items-center gap-2 font-bold shadow-sm shadow-[#a3e4c7]/20">
                        <Check className="w-4 h-4" />
                        Accept
                      </button>
                      <button onClick={() => updateApplication(app.id, 'shortlisted')} className="px-5 py-2.5 bg-[#91c0cf]/30 text-[#4f8396] border border-[#91c0cf]/40 rounded-2xl hover:bg-[#91c0cf]/50 transition-all font-bold">
                        Shortlist
                      </button>
                      <button onClick={() => updateApplication(app.id, 'rejected')} className="px-5 py-2.5 bg-[#f4a298]/20 text-[#a56754] border border-[#f4a298]/30 rounded-2xl hover:bg-[#f4a298]/40 transition-all flex items-center gap-2 font-bold">
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                  {app.status === 'shortlisted' && (
                    <>
                      <button onClick={() => updateApplication(app.id, 'accepted')} className="px-5 py-2.5 bg-[#a3e4c7] text-[#345b4c] rounded-2xl hover:bg-[#8fd0b5] transition-all flex items-center gap-2 font-bold shadow-sm shadow-[#a3e4c7]/20">
                        <Check className="w-4 h-4" />
                        Accept
                      </button>
                      <button onClick={() => updateApplication(app.id, 'rejected')} className="px-5 py-2.5 bg-[#f4a298]/20 text-[#a56754] border border-[#f4a298]/30 rounded-2xl hover:bg-[#f4a298]/40 transition-all flex items-center gap-2 font-bold">
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                  <button onClick={() => navigate('messages')} className="px-5 py-2.5 bg-white/60 border border-white/60 text-slate-700 rounded-2xl hover:bg-white hover:text-[#6f8e97] transition-all flex items-center gap-2 font-semibold">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                  <button className="px-5 py-2.5 bg-white/60 border border-white/60 text-slate-700 rounded-2xl hover:bg-white hover:text-slate-900 transition-all flex items-center gap-2 font-semibold">
                    <Eye className="w-4 h-4" />
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

