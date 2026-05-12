import { Calendar, CheckCircle2, DollarSign, Loader2, MapPin, Search, Share2, Target, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useApp } from '../../shared/context/AppContext';

export function OpportunitiesScreen() {
  const { availableCampaigns = [], loadingDashboard, applyToCampaign } = useApp() || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [proposal, setProposal] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');

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
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onApply={() => {
                setActiveCampaign(campaign);
                setProposedRate(campaign.budgetMin ? String(campaign.budgetMin) : '');
                setProposal('');
                setApplyError('');
                setApplySuccess('');
              }}
            />
          ))}
        </div>
      ) : (
        <Empty title="No open opportunities" body="There are no database campaigns available for this creator right now." />
      )}

      {activeCampaign && (
        <ApplyModal
          campaign={activeCampaign}
          proposal={proposal}
          proposedRate={proposedRate}
          applying={applying}
          error={applyError}
          success={applySuccess}
          onProposalChange={setProposal}
          onRateChange={setProposedRate}
          onClose={() => {
            if (applying) return;
            setActiveCampaign(null);
            setApplyError('');
            setApplySuccess('');
          }}
          onSubmit={async () => {
            const numericRate = Number(proposedRate);
            if (!Number.isFinite(numericRate) || numericRate <= 0) {
              setApplyError('Enter a valid proposed rate before applying.');
              return;
            }

            setApplying(true);
            setApplyError('');
            setApplySuccess('');
            try {
              if (typeof applyToCampaign !== 'function') {
                throw new Error('Application service is unavailable. Please sign in again.');
              }
              await applyToCampaign(activeCampaign.id, {
                proposedRate: numericRate,
                message: proposal.trim() || undefined,
              });
              setApplySuccess('Application submitted and saved in the database.');
              setTimeout(() => {
                setActiveCampaign(null);
                setProposal('');
                setProposedRate('');
                setApplySuccess('');
              }, 700);
            } catch (error) {
              setApplyError(error?.message || 'Could not submit application.');
            } finally {
              setApplying(false);
            }
          }}
        />
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

function CampaignCard({ campaign, onApply }) {
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
        <button
          onClick={onApply}
          className="flex-1 rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
        >
          Apply
        </button>
        <button className="rounded-xl border border-white/60 bg-white/80 px-4 text-gray-700">
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ApplyModal({
  campaign,
  proposal,
  proposedRate,
  applying,
  error,
  success,
  onProposalChange,
  onRateChange,
  onClose,
  onSubmit,
}) {
  const title = campaign.title || campaign.name || 'Campaign';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-white/70 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-purple-700">Apply to campaign</p>
            <h3 className="mt-1 text-2xl font-black text-gray-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">{campaign.description}</p>
          </div>
          <button onClick={onClose} className="rounded-xl border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Info icon={DollarSign} label={campaign.budget || 'Budget not set'} />
          <Info icon={Calendar} label={campaign.deadline || 'Deadline not set'} />
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-bold text-gray-800">Your proposed rate</span>
          <input
            type="number"
            min="1"
            value={proposedRate}
            onChange={(event) => onRateChange(event.target.value)}
            placeholder={campaign.budgetMin ? String(campaign.budgetMin) : '25000'}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-950 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-bold text-gray-800">Proposal message</span>
          <textarea
            value={proposal}
            onChange={(event) => onProposalChange(event.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="Tell the brand why you are a good fit and what you will deliver."
            className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-950 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
        </label>

        {error && <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
        {success && (
          <p className="mt-3 flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button onClick={onClose} disabled={applying} className="rounded-2xl border border-gray-200 px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60">
            Cancel
          </button>
          <button onClick={onSubmit} disabled={applying} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-purple-700 disabled:opacity-60">
            {applying && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit Application
          </button>
        </div>
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
