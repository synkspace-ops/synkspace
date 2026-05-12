import { CheckCircle, Clock, DollarSign, FileCheck, Search, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useApp } from '../../shared/context/AppContext';

const statusIcon = {
  accepted: CheckCircle,
  pending: Clock,
  rejected: XCircle,
  shortlisted: CheckCircle,
};

export function MyApplicationsScreen() {
  const { applications = [], loadingDashboard } = useApp() || {};
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const filteredApplications = useMemo(() => applications.filter((application) => {
    const matchesStatus = activeFilter === 'all' || application.status === activeFilter;
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [application.campaign, application.creator, application.proposal, application.price]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  }), [activeFilter, applications, search]);

  const stats = {
    total: applications.length,
    pending: applications.filter((item) => item.status === 'pending').length,
    accepted: applications.filter((item) => item.status === 'accepted').length,
    rejected: applications.filter((item) => item.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Stat label="Total Apps" value={stats.total} tone="from-purple-300/80 to-purple-400/80" />
        <Stat label="Pending" value={stats.pending} tone="from-orange-300/80 to-orange-400/80" />
        <Stat label="Accepted" value={stats.accepted} tone="from-emerald-300/80 to-emerald-400/80" />
        <Stat label="Rejected" value={stats.rejected} tone="from-red-300/80 to-red-400/80" />
      </div>

      <div className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'accepted', 'rejected'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-xl px-4 py-2 text-sm font-bold capitalize transition ${
                  activeFilter === filter ? 'border border-white/70 bg-white/80 text-gray-900 shadow-lg' : 'text-gray-600 hover:bg-white/40'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="relative min-w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search database applications..."
              className="w-full rounded-xl border border-white/60 bg-white/80 py-2 pl-10 pr-4 text-sm text-gray-900 shadow-md outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </div>
      </div>

      {loadingDashboard ? (
        <Empty title="Loading applications" body="Fetching your applications from the database." />
      ) : filteredApplications.length ? (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const Icon = statusIcon[application.status] || Clock;
            return (
              <div key={application.id} className="rounded-3xl border border-white/60 bg-white/50 p-6 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-lg font-bold text-white">
                    {String(application.campaign || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{application.campaign}</h3>
                        <p className="mt-1 text-sm text-gray-600">{application.proposal}</p>
                      </div>
                      <span className="flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-bold uppercase text-white">
                        <Icon className="h-3 w-3" />
                        {application.status}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                      <Info icon={DollarSign} label="Proposed Rate" value={application.price} />
                      <Info icon={FileCheck} label="Followers" value={application.followers} />
                      <Info icon={Clock} label="Status" value={application.status} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty title="No applications found" body="Only real applications from the database are shown here." />
      )}
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className={`rounded-3xl border-2 border-white/60 bg-gradient-to-br ${tone} p-5 shadow-2xl`}>
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-800/80">{label}</div>
      <div className="mt-2 text-4xl font-bold text-white drop-shadow-lg">{value}</div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/60 bg-white/60 p-3 shadow-md">
      <div className="mb-1 flex items-center gap-2 text-xs text-gray-600">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="font-bold capitalize text-gray-900">{value || 'Not set'}</div>
    </div>
  );
}

function Empty({ title, body }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/60 p-10 text-center shadow-xl backdrop-blur-xl">
      <FileCheck className="mx-auto h-10 w-10 text-purple-600" />
      <h3 className="mt-4 text-xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{body}</p>
    </div>
  );
}
