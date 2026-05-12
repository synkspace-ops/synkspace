import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  Building2,
  CalendarDays,
  Eye,
  Globe2,
  LogOut,
  Megaphone,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import logo from '../../../assets/synkspace-logo.png';
import { apiGet } from '../../lib/api';
import { clearAuthSession } from '../../lib/auth';

const roleColors = ['#0f172a', '#2563eb', '#0891b2', '#f59e0b'];
const statusColors = {
  Pending: '#f59e0b',
  Verified: '#10b981',
  Suspended: '#ef4444',
};

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(Number(value || 0));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
          {hint ? <p className="mt-1 text-sm font-medium text-slate-500">{hint}</p> : null}
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </section>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-950">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function EmptyState({ label }) {
  return (
    <div className="flex h-full min-h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500">
      {label}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadOverview = async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const response = await apiGet('/api/admin/overview');
      setOverview(response?.data || null);
    } catch (overviewError) {
      setError(overviewError?.message || 'Could not load admin dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const totals = overview?.totals || {};
  const roleBreakdown = useMemo(
    () => (overview?.roleBreakdown || []).filter((item) => Number(item.value || 0) > 0),
    [overview]
  );
  const statusBreakdown = overview?.statusBreakdown || [];
  const hasDailyData = (overview?.daily || []).some((row) => Number(row.visits || 0) > 0 || Number(row.registrations || 0) > 0);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-300">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading admin dashboard
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-['Inter',sans-serif] text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-slate-800 bg-slate-950 px-5 py-6 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
            <img src={logo} alt="SynkSpace" className="h-8 w-8 object-contain" />
          </span>
          <div>
            <p className="text-lg font-black">SynkSpace</p>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Site Admin</p>
          </div>
        </div>

        <nav className="mt-10 space-y-2">
          {[
            { icon: BarChart3, label: 'Overview' },
            { icon: Users, label: 'Registrations' },
            { icon: Globe2, label: 'Traffic' },
            { icon: MessageSquare, label: 'Messages' },
            { icon: ShieldCheck, label: 'Audit' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-slate-100">
              <item.icon className="h-5 w-5" />
              {item.label}
            </div>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-left text-sm font-bold text-red-200 transition hover:bg-red-500/10 hover:text-red-100"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 lg:hidden">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950">
                  <img src={logo} alt="SynkSpace" className="h-7 w-7 object-contain" />
                </span>
                <span className="text-lg font-black">SynkSpace Admin</span>
              </div>
              <h1 className="hidden text-2xl font-black text-slate-950 lg:block">Website Admin Dashboard</h1>
              <p className="mt-1 truncate text-sm font-semibold text-slate-500">
                Updated {formatDate(overview?.generatedAt)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => loadOverview({ silent: true })}
                disabled={refreshing}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8">
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
              {error}
            </div>
          ) : null}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Eye} label="Traffic Today" value={formatNumber(totals.trafficToday)} hint={`${formatNumber(totals.trafficLast7)} visits in 7 days`} />
            <StatCard icon={UserPlus} label="New Users Today" value={formatNumber(totals.usersToday)} hint={`${formatNumber(totals.users)} total registered users`} />
            <StatCard icon={Users} label="Creators" value={formatNumber(totals.creators)} hint={`${formatNumber(totals.creatorProfiles)} completed profiles`} />
            <StatCard icon={Building2} label="Brands" value={formatNumber(totals.brands)} hint={`${formatNumber(totals.brandProfiles)} completed profiles`} />
            <StatCard icon={CalendarDays} label="Event Organisers" value={formatNumber(totals.organisers)} hint={`${formatNumber(totals.organiserProfiles)} completed profiles`} />
            <StatCard icon={Megaphone} label="Campaigns" value={formatNumber(totals.campaigns)} hint={`${formatNumber(totals.activeCampaigns)} active campaigns`} />
            <StatCard icon={MessageSquare} label="Messages" value={formatNumber(totals.messages)} hint={`${formatNumber(totals.directMessages)} direct messages`} />
            <StatCard icon={Wallet} label="Escrow Value" value={formatCurrency(totals.escrowValue)} hint={`${formatNumber(totals.escrowRecords)} escrow records`} />
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(360px,1fr)]">
            <Panel title="Traffic and Registrations" subtitle="Page views and user registrations over the last 30 days">
              <div className="h-80">
                {hasDailyData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={overview?.daily || []} margin={{ top: 10, right: 16, left: -18, bottom: 0 }}>
                      <defs>
                        <linearGradient id="visits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="registrations" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                      <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="visits" stroke="#2563eb" strokeWidth={3} fill="url(#visits)" />
                      <Area type="monotone" dataKey="registrations" stroke="#10b981" strokeWidth={3} fill="url(#registrations)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState label="Traffic will appear here as visitors use the website." />
                )}
              </div>
            </Panel>

            <Panel title="Registered User Split" subtitle={`${formatNumber(totals.uniqueVisitorsLast7)} unique visitors in the last 7 days`}>
              <div className="h-80">
                {roleBreakdown.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={roleBreakdown} dataKey="value" nameKey="name" innerRadius={62} outerRadius={104} paddingAngle={3}>
                        {roleBreakdown.map((entry, index) => (
                          <Cell key={entry.name} fill={roleColors[index % roleColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState label="No registered users yet." />
                )}
              </div>
              <div className="grid gap-2">
                {(overview?.roleBreakdown || []).map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: roleColors[index % roleColors.length] }} />
                      {item.name}
                    </span>
                    <span className="text-slate-950">{formatNumber(item.value)}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <Panel title="Account Status" subtitle="Verification health across all registered users">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusBreakdown} margin={{ top: 8, right: 12, left: -22, bottom: 0 }}>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {statusBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={statusColors[entry.name] || '#64748b'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Marketplace Health" subtitle="Campaign and application activity">
              <div className="grid gap-3">
                {[
                  { icon: Megaphone, label: 'Campaigns', value: totals.campaigns },
                  { icon: Activity, label: 'Active campaigns', value: totals.activeCampaigns },
                  { icon: UserCheck, label: 'Applications', value: totals.applications },
                  { icon: ShieldCheck, label: 'Accepted applications', value: totals.acceptedApplications },
                  { icon: Users, label: 'Team members', value: totals.teamMembers },
                  { icon: CalendarDays, label: 'Pending team invites', value: totals.pendingTeamMembers },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <item.icon className="h-4 w-4 text-slate-400" />
                      {item.label}
                    </span>
                    <span className="text-lg font-black text-slate-950">{formatNumber(item.value)}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Top Pages" subtitle="Most visited routes in the last 7 days">
              <div className="space-y-3">
                {(overview?.topPaths || []).length ? (
                  overview.topPaths.map((item) => (
                    <div key={item.path} className="rounded-xl bg-slate-50 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-bold text-slate-700">{item.path}</p>
                        <p className="text-sm font-black text-slate-950">{formatNumber(item.visits)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState label="Page traffic will appear here." />
                )}
              </div>
            </Panel>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <Panel title="Recent Registrations" subtitle="Latest users from the production database">
              <div className="space-y-3">
                {(overview?.recentUsers || []).length ? (
                  overview.recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-950">{user.name}</p>
                        <p className="truncate text-xs font-semibold text-slate-500">{user.email}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs font-black uppercase text-slate-700">{user.role}</p>
                        <p className="text-xs font-semibold text-slate-400">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState label="No users have registered yet." />
                )}
              </div>
            </Panel>

            <Panel title="Recent Activity" subtitle="Registrations, campaigns, applications, and messages">
              <div className="space-y-3">
                {(overview?.recentActivity || []).length ? (
                  overview.recentActivity.map((item) => (
                    <div key={item.id} className="rounded-xl bg-slate-50 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{item.type}</p>
                          <p className="mt-1 truncate text-sm font-bold text-slate-800">{item.title}</p>
                        </div>
                        <p className="shrink-0 text-xs font-semibold text-slate-400">{formatDate(item.at)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState label="Activity will appear as users interact with the platform." />
                )}
              </div>
            </Panel>
          </section>
        </div>
      </main>
    </div>
  );
}
