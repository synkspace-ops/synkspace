import { Calendar, DollarSign, MapPin, Search, Share2, Target, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useApp } from '../../shared/context/AppContext';

export function OpportunitiesScreen() {
  const { availableCampaigns = [], loadingDashboard } = useApp() || {};
  const [searchQuery, setSearchQuery] = useState('');
  const filteredCampaigns = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return availableCampaigns;
    return availableCampaigns.filter((campaign) => [
      campaign.title,
      campaign.name,
      campaign.category,
      campaign.location,
      campaign.deliverables,
      ...(campaign.platforms || []),
    ].filter(Boolean).some((value) => String(value).toLowerCase().includes(term)));
  }, [availableCampaigns, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search live campaigns from database..."
              className="w-full rounded-2xl border border-white/60 bg-white/80 py-3 pl-12 pr-4 text-gray-900 shadow-lg outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-3 text-sm font-bold text-gray-700 shadow-lg">
            {filteredCampaigns.length} open
          </div>
        </div>
      </div>

      {loadingDashboard ? (
        <Empty title="Loading opportunities" body="Fetching open campaigns from the database." />
      ) : filteredCampaigns.length ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <Empty title="No open opportunities" body="There are no database campaigns available for this creator right now." />
      )}
    </div>
  );
}

function Empty({ title, body }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/60 p-10 text-center shadow-xl backdrop-blur-xl">
      <Target className="mx-auto h-10 w-10 text-purple-600" />
      <h3 className="mt-4 text-xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{body}</p>
    </div>
  );
}

function CampaignCard({ campaign }) {
  const title = campaign.title || campaign.name;
  return (
    <div className="rounded-3xl border border-white/60 bg-white/50 p-5 shadow-2xl backdrop-blur-2xl transition hover:scale-[1.01]">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-lg font-bold text-white shadow-xl">
        {String(title || 'C').charAt(0).toUpperCase()}
      </div>
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wide text-purple-700">{campaign.category || 'Campaign'}</p>
        <h3 className="mt-1 text-xl font-bold text-gray-900">{title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">{campaign.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Info icon={DollarSign} label={campaign.budget || 'Budget not set'} />
        <Info icon={MapPin} label={campaign.location || 'Location not set'} />
        <Info icon={Calendar} label={campaign.deadline || 'Deadline not set'} />
        <Info icon={Users} label={`${campaign.applications || 0} applicants`} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {(campaign.platforms || []).map((platform) => (
          <span key={platform} className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-gray-700">{platform}</span>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <button className="flex-1 rounded-xl bg-gray-900 py-3 text-sm font-bold text-white opacity-70" disabled>
          Apply flow pending
        </button>
        <button className="rounded-xl border border-white/60 bg-white/80 px-4 text-gray-700">
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/60 bg-white/60 p-3">
      <Icon className="h-4 w-4 text-gray-500" />
      <span className="min-w-0 truncate font-semibold text-gray-800">{label}</span>
    </div>
  );
}
