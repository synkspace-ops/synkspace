import {
  ArrowRight,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  DollarSign,
  Filter,
  Loader2,
  MapPin,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Target,
  Users,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useApp } from '../../shared/context/AppContext';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function parseDeadline(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function platformIcon(platform) {
  const normalized = String(platform || '').toLowerCase();
  if (normalized.includes('instagram')) return Camera;
  if (normalized.includes('youtube')) return Video;
  if (normalized.includes('video')) return Video;
  return Sparkles;
}

export function OpportunitiesScreen() {
  const { availableCampaigns = [], loadingDashboard, applyToCampaign } = useApp() || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [proposal, setProposal] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');

  const categories = useMemo(() => {
    const values = availableCampaigns.map((campaign) => campaign.category).filter(Boolean);
    return ['all', ...Array.from(new Set(values))];
  }, [availableCampaigns]);

  const stats = useMemo(() => {
    const budgets = availableCampaigns.map((campaign) => Number(campaign.budgetMax || 0)).filter(Boolean);
    const averageBudget = budgets.length ? Math.round(budgets.reduce((sum, value) => sum + value, 0) / budgets.length) : 0;
    const platformCount = new Set(availableCampaigns.flatMap((campaign) => campaign.platforms || [])).size;
    const closingSoon = availableCampaigns.filter((campaign) => {
      const deadline = parseDeadline(campaign.deadline);
      if (!deadline) return false;
      const days = (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 7;
    }).length;
    return { averageBudget, platformCount, closingSoon };
  }, [availableCampaigns]);

  const filteredCampaigns = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    const filtered = availableCampaigns.filter((campaign) => {
      const matchesCategory = category === 'all' || campaign.category === category;
      const matchesSearch = !term || [
        campaign.title,
        campaign.name,
        campaign.category,
        campaign.location,
        campaign.deliverables,
        campaign.description,
        ...(campaign.platforms || []),
      ].filter(Boolean).some((value) => String(value).toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'budget') return Number(b.budgetMax || 0) - Number(a.budgetMax || 0);
      if (sortBy === 'applicants') return Number(b.applications || 0) - Number(a.applications || 0);
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [availableCampaigns, category, searchQuery, sortBy]);

  const openApply = (campaign) => {
    setActiveCampaign(campaign);
    setProposedRate(campaign.budgetMin ? String(campaign.budgetMin) : '');
    setProposal('');
    setApplyError('');
    setApplySuccess('');
  };

  const submitApplication = async () => {
    const numericRate = Number(proposedRate);
    if (!Number.isFinite(numericRate) || numericRate <= 0) {
      setApplyError('Enter a valid proposed rate before applying.');
      return;
    }
    if (proposal.trim().length < 20) {
      setApplyError('Add a short proposal so the brand has context.');
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
        message: proposal.trim(),
      });
      setApplySuccess('Application submitted and saved in the database.');
      setTimeout(() => {
        setActiveCampaign(null);
        setProposal('');
        setProposedRate('');
        setApplySuccess('');
      }, 800);
    } catch (error) {
      setApplyError(error?.message || 'Could not submit application.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search campaigns, categories, locations..."
              className="w-full rounded-2xl border border-white/60 bg-white/80 py-3 pl-12 pr-4 text-gray-900 shadow-lg outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Control icon={Filter}>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="bg-transparent font-bold text-gray-700 outline-none">
                {categories.map((item) => (
                  <option key={item} value={item}>{item === 'all' ? 'All categories' : item}</option>
                ))}
              </select>
            </Control>
            <Control icon={SlidersHorizontal}>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="bg-transparent font-bold text-gray-700 outline-none">
                <option value="newest">Newest</option>
                <option value="budget">Highest budget</option>
                <option value="applicants">Most applicants</option>
              </select>
            </Control>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Open Campaigns" value={availableCampaigns.length} helper={`${filteredCampaigns.length} matching`} icon={Target} tone="from-emerald-200 to-emerald-300" />
        <MetricCard label="Avg Budget" value={stats.averageBudget ? formatCurrency(stats.averageBudget) : 'Not set'} helper="From live campaign budgets" icon={DollarSign} tone="from-blue-200 to-blue-300" />
        <MetricCard label="Platforms" value={stats.platformCount} helper="Channels requested" icon={Zap} tone="from-orange-200 to-orange-300" />
        <MetricCard label="Closing Soon" value={stats.closingSoon} helper="Within 7 days when dated" icon={Clock} tone="from-purple-200 to-purple-300" />
      </div>

      {loadingDashboard ? (
        <Empty title="Loading opportunities" body="Fetching open campaigns from the database." />
      ) : filteredCampaigns.length ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} onApply={() => openApply(campaign)} />
          ))}
        </div>
      ) : (
        <Empty title="No open opportunities" body="There are no database campaigns matching this view right now." />
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
          onSubmit={submitApplication}
        />
      )}
    </div>
  );
}

function Control({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-lg">
      <Icon className="h-5 w-5 text-gray-500" />
      {children}
    </div>
  );
}

function MetricCard({ label, value, helper, icon: Icon, tone }) {
  return (
    <div className={`rounded-3xl border border-white/60 bg-gradient-to-br ${tone} p-5 shadow-xl`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-gray-800/80">{label}</p>
          <p className="mt-2 text-3xl font-black text-gray-950">{value}</p>
          <p className="mt-2 text-xs font-bold text-gray-700">{helper}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/60 shadow-lg">
          <Icon className="h-5 w-5 text-gray-800" />
        </div>
      </div>
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
  const title = campaign.title || campaign.name || 'Campaign';
  const platforms = campaign.platforms || [];
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/60 bg-white/45 shadow-2xl backdrop-blur-2xl transition hover:scale-[1.01]">
      <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />
        <div className="relative text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">{campaign.category || 'Campaign'}</p>
          <h3 className="mt-2 line-clamp-2 text-2xl font-black leading-tight">{title}</h3>
        </div>
        <div className="absolute right-4 top-4 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-black backdrop-blur-md">
          {campaign.status || 'active'}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-base font-black text-white shadow-lg">
              {String(title).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-lg font-black text-gray-950">{title}</h4>
              <p className="truncate text-xs font-semibold text-gray-500">{campaign.location || 'Location not set'}</p>
            </div>
          </div>
          <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 fill-blue-500 text-blue-500" />
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-gray-600">{campaign.description || 'No campaign description saved yet.'}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {platforms.length ? platforms.map((platform) => {
            const Icon = platformIcon(platform);
            return (
              <span key={platform} className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-gray-700">
                <Icon className="h-3.5 w-3.5" />
                {platform}
              </span>
            );
          }) : (
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-gray-700">Platforms not set</span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Info icon={DollarSign} label={campaign.budget || 'Budget not set'} />
          <Info icon={Calendar} label={campaign.deadline || 'Deadline not set'} />
          <Info icon={Users} label={`${campaign.applications || 0} applicants`} />
          <Info icon={MapPin} label={campaign.location || 'Remote / TBD'} />
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onApply}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-950 py-3 text-sm font-black text-white transition hover:bg-purple-700"
          >
            View & Apply
            <ArrowRight className="h-4 w-4" />
          </button>
          <button className="rounded-xl border border-white/60 bg-white/80 px-4 text-gray-700 transition hover:bg-white">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
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
  const deliverables = String(campaign.deliverables || '')
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/45 p-4 backdrop-blur-sm">
      <div className="grid max-h-[92vh] w-full max-w-5xl grid-cols-1 overflow-y-auto rounded-3xl border border-white/70 bg-white/95 shadow-2xl backdrop-blur-2xl lg:grid-cols-12">
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950 p-7 text-white lg:col-span-5">
          <button onClick={onClose} className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-md transition hover:bg-white/20">
            <X className="h-5 w-5" />
          </button>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-white/60">Campaign brief</p>
          <h2 className="mt-3 text-3xl font-black leading-tight">{title}</h2>
          <p className="mt-4 text-sm leading-7 text-white/75">{campaign.description || 'No description has been saved for this campaign yet.'}</p>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <DarkInfo icon={DollarSign} label="Budget" value={campaign.budget || 'Budget not set'} />
            <DarkInfo icon={Calendar} label="Deadline" value={campaign.deadline || 'Deadline not set'} />
            <DarkInfo icon={MapPin} label="Location" value={campaign.location || 'Location not set'} />
            <DarkInfo icon={Users} label="Applicants" value={`${campaign.applications || 0} creators applied`} />
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-white/60">Platforms</p>
            <div className="flex flex-wrap gap-2">
              {(campaign.platforms || []).length ? (campaign.platforms || []).map((platform) => (
                <span key={platform} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-md">
                  {platform}
                </span>
              )) : (
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-md">Not specified</span>
              )}
            </div>
          </div>
        </section>

        <section className="p-7 lg:col-span-7">
          <p className="text-xs font-black uppercase tracking-wide text-purple-700">Application</p>
          <h3 className="mt-1 text-2xl font-black text-gray-950">Send your proposal</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">Your application and proposal message will be saved in the database and used to start the campaign conversation.</p>

          <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50/80 p-4">
            <p className="text-sm font-black text-gray-950">Deliverables</p>
            <div className="mt-3 space-y-2">
              {deliverables.length ? deliverables.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {item}
                </div>
              )) : (
                <p className="text-sm text-gray-600">Deliverables have not been specified in the campaign record.</p>
              )}
            </div>
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
              rows={7}
              maxLength={2000}
              placeholder="Tell the brand why you are a fit, what content you will create, and when you can deliver it."
              className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-950 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
            <span className="mt-1 block text-right text-xs font-semibold text-gray-400">{proposal.length}/2000</span>
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
        </section>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/60 bg-white/60 p-3">
      <Icon className="h-4 w-4 shrink-0 text-gray-500" />
      <span className="min-w-0 truncate text-xs font-bold text-gray-800">{label}</span>
    </div>
  );
}

function DarkInfo({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
      <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-white/50">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="font-bold text-white">{value}</p>
    </div>
  );
}
