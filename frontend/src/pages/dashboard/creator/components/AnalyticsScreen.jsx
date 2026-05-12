import { BarChart3, CheckCircle2, FileCheck, Target, TrendingUp, Wallet } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp } from '../../shared/context/AppContext';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function AnalyticsScreen() {
  const { analytics = {}, applications = [], campaigns = [], payments = [], loadingDashboard } = useApp() || {};
  const stats = analytics.stats || {};
  const performanceData = analytics.performanceData || [];
  const accepted = applications.filter((application) => application.status === 'accepted').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Stat label="Applications" value={applications.length} icon={FileCheck} tone="from-purple-300/80 to-purple-400/80" />
        <Stat label="Accepted" value={accepted} icon={CheckCircle2} tone="from-emerald-300/80 to-emerald-400/80" />
        <Stat label="Campaigns" value={campaigns.length} icon={Target} tone="from-blue-300/80 to-blue-400/80" />
        <Stat label="Spend / Earnings" value={formatCurrency(stats.totalSpend || 0)} icon={Wallet} tone="from-orange-300/80 to-orange-400/80" />
      </div>

      <section className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-bold text-gray-900">Campaign Performance</h3>
        {loadingDashboard ? (
          <Empty title="Loading analytics" body="Fetching dashboard analytics from the database." />
        ) : performanceData.length ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="creatorCampaigns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.3)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="applications" stroke="#8b5cf6" strokeWidth={3} fill="url(#creatorCampaigns)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Empty title="No analytics yet" body="Analytics will appear after applications, campaigns, or payments exist in the database." />
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl backdrop-blur-xl">
          <h3 className="mb-5 text-lg font-bold text-gray-900">Recent Activity</h3>
          {(analytics.recentActivity || []).length ? (
            <div className="space-y-3">
              {analytics.recentActivity.map((activity, index) => (
                <div key={`${activity.title}-${index}`} className="rounded-2xl border border-white/60 bg-white/60 p-4">
                  <p className="font-bold text-gray-900">{activity.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{activity.time}</p>
                </div>
              ))}
            </div>
          ) : (
            <Empty title="No recent activity" body="Recent activity is generated only from database application records." />
          )}
        </section>

        <section className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl backdrop-blur-xl">
          <h3 className="mb-5 text-lg font-bold text-gray-900">Payment Records</h3>
          {payments.length ? (
            <div className="space-y-3">
              {payments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="rounded-2xl border border-white/60 bg-white/60 p-4">
                  <p className="font-bold text-gray-900">{payment.campaign}</p>
                  <p className="mt-1 text-sm text-gray-600">{payment.amount} · {payment.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <Empty title="No payments" body="Payment analytics will appear when escrow records exist in the database." />
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, tone }) {
  return (
    <div className={`rounded-3xl border-2 border-white/60 bg-gradient-to-br ${tone} p-6 shadow-2xl`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-800/80">{label}</div>
          <div className="mt-2 text-3xl font-bold text-white drop-shadow-lg">{value}</div>
        </div>
        <Icon className="h-6 w-6 text-gray-800/80" />
      </div>
    </div>
  );
}

function Empty({ title, body }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/50 p-8 text-center">
      <BarChart3 className="mx-auto h-8 w-8 text-purple-700" />
      <p className="mt-3 font-bold text-gray-900">{title}</p>
      <p className="mt-2 text-sm text-gray-600">{body}</p>
    </div>
  );
}
