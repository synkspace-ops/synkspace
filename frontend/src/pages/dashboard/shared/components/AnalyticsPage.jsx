import { TrendingUp, Eye, Heart, DollarSign, Users } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../context/AppContext';

export function AnalyticsPage() {
  const { analytics, applications } = useApp();
  const performanceData = analytics?.performanceData || [];
  const budgetDistribution = analytics?.budgetDistribution || [];
  const creatorPerformance = applications
    .filter((app) => app.status === 'accepted')
    .map((app, index) => ({
      id: app.id,
      name: app.creator,
      applications: 1,
      engagement: app.followers || 'Not provided',
      roi: 0,
      color: ['bg-[#a3e4c7] text-[#4c7569]', 'bg-[#f4a298] text-[#b5735c]', 'bg-[#91c0cf] text-[#4f8396]', 'bg-[#cbe0dc] text-[#5b7d73]'][index % 4],
    }));
  const stats = analytics?.stats || {};

  const COLORS = ['#6f8e97', '#91c0cf', '#f0ad9f', '#a3e4c7'];

  return (
    <div className="min-h-screen p-4 sm:p-6 font-sans text-slate-800 flex flex-col gap-4 sm:gap-6 w-full">
      {/* Header */}
      <header className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide mb-1">Analytics Dashboard</h1>
        <p className="text-white/80 text-sm">Track live campaign, application, and spend data</p>
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-[#6f8e97]/40 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4 z-10 relative">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="z-10 relative">
            <p className="text-white/80 text-sm font-medium mb-1">Applications</p>
            <h3 className="text-3xl font-bold tracking-tight mb-2">{stats.totalApplications || 0}</h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-full bg-[#a3e4c7]/30 text-[#a3e4c7] flex items-center gap-1 border border-[#a3e4c7]/50">
                <TrendingUp className="w-3 h-3" /> Live DB
              </span>
              <span className="text-white/60">from Supabase</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all pointer-events-none" />
        </div>

        <div className="bg-[#6f8e97]/40 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4 z-10 relative">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="z-10 relative">
            <p className="text-white/80 text-sm font-medium mb-1">Accepted Rate</p>
            <h3 className="text-3xl font-bold tracking-tight mb-2">{stats.completionRate || 0}%</h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-full bg-[#a3e4c7]/30 text-[#a3e4c7] flex items-center gap-1 border border-[#a3e4c7]/50">
                <TrendingUp className="w-3 h-3" /> Live DB
              </span>
              <span className="text-white/60">from Supabase</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all pointer-events-none" />
        </div>

        <div className="bg-[#6f8e97]/40 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4 z-10 relative">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="z-10 relative">
            <p className="text-white/80 text-sm font-medium mb-1">Database Spend</p>
            <h3 className="text-3xl font-bold tracking-tight mb-2">₹{Number(stats.totalSpend || 0).toLocaleString('en-IN')}</h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-full bg-[#a3e4c7]/30 text-[#a3e4c7] flex items-center gap-1 border border-[#a3e4c7]/50">
                <TrendingUp className="w-3 h-3" /> Live DB
              </span>
              <span className="text-white/60">from Supabase</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all pointer-events-none" />
        </div>

        <div className="bg-[#6f8e97]/40 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4 z-10 relative">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="z-10 relative">
            <p className="text-white/80 text-sm font-medium mb-1">Active Creators</p>
            <h3 className="text-3xl font-bold tracking-tight mb-2">{stats.totalCreators || 0}</h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-full bg-[#a3e4c7]/30 text-[#a3e4c7] flex items-center gap-1 border border-[#a3e4c7]/50">
                <TrendingUp className="w-3 h-3" /> Live DB
              </span>
              <span className="text-white/60">from Supabase</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all pointer-events-none" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Performance Over Time */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex flex-col">
          <h2 className="text-[15px] font-bold text-slate-800 mb-6">Campaign Performance</h2>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 600 }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                />
                <Line
                  type="monotone"
                  dataKey="campaigns"
                  stroke="#6f8e97"
                  strokeWidth={4}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#6f8e97' }}
                  name="Campaigns"
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#f0ad9f"
                  strokeWidth={4}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#f0ad9f' }}
                  name="Applications"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Distribution */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex flex-col">
          <h2 className="text-[15px] font-bold text-slate-800 mb-6">Budget Distribution by Category</h2>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                {budgetDistribution.map((entry, index) => (
                    <Cell key={`cell-${entry.id}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Creators and Cost Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 mb-4 sm:mb-6">
        {/* Top Creators */}
        <div className="lg:col-span-7 bg-white/70 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
          <h2 className="text-[15px] font-bold text-slate-800 mb-6">Top Performing Creators</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/50">
                  <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Creator</th>
                  <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Accepted Apps</th>
                  <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Engagement</th>
                  <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Source</th>
                  <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Performance</th>
                </tr>
              </thead>
              <tbody>
                {creatorPerformance.map((creator) => (
                  <tr key={creator.id} className="border-b border-white/30 last:border-0 hover:bg-white/40 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center font-bold text-lg shadow-sm border border-white/50 ${creator.color}`}>
                          {creator.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800">{creator.name}</span>
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-slate-700">{creator.applications}</td>
                    <td className="py-4 font-semibold text-[#f0ad9f]">{creator.engagement}</td>
                    <td className="py-4 font-semibold text-[#6f8e97]">Live DB</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-white/50 rounded-full h-2 overflow-hidden border border-white/60">
                          <div
                            className={`h-full rounded-full transition-all ${creator.roi > 2.5 ? 'bg-[#a3e4c7]' : 'bg-[#91c0cf]'}`}
                            style={{ width: `${(creator.roi / 4) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold tracking-wide ${creator.roi > 2.5 ? 'text-[#345b4c]' : 'text-[#4f8396]'}`}>
                          {creator.roi > 2.5 ? 'EXCELLENT' : 'GOOD'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="lg:col-span-5 bg-white/70 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex flex-col">
          <h2 className="text-[15px] font-bold text-slate-800 mb-6">Cost Analysis (Spend)</h2>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 600 }}
                  cursor={{fill: 'rgba(255,255,255,0.4)'}}
                />
                <Bar
                  dataKey="spend"
                  fill="#91c0cf"
                  radius={[6, 6, 6, 6]}
                  barSize={32}
                  name="Spend"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}


