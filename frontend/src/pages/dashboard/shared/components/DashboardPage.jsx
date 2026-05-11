import { Search, MessageSquare, Bell, Clock, Users, ChevronRight, Download, Megaphone, DollarSign, Eye, TrendingUp } from 'lucide-react';
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildCampaignPerformanceData(campaigns, serverRows = []) {
  const currentMonth = new Date().getMonth();
  const recentMonths = Array.from({ length: 6 }, (_, idx) => monthNames[(currentMonth - 5 + idx + 12) % 12]);
  const rowsByMonth = new Map(
    recentMonths.map((month) => [month, { name: month, month, campaigns: 0, applications: 0 }])
  );

  for (const row of serverRows || []) {
    const month = row.month || row.name;
    if (!rowsByMonth.has(month)) continue;
    rowsByMonth.set(month, {
      ...rowsByMonth.get(month),
      ...row,
      name: month,
      month,
      campaigns: Number(row.campaigns || 0),
      applications: Number(row.applications || 0),
    });
  }

  const campaignCounts = new Map();
  for (const campaign of campaigns || []) {
    const createdAt = campaign.createdAt ? new Date(campaign.createdAt) : null;
    if (!createdAt || Number.isNaN(createdAt.getTime())) continue;
    const month = monthNames[createdAt.getMonth()];
    if (rowsByMonth.has(month)) {
      campaignCounts.set(month, (campaignCounts.get(month) || 0) + 1);
    }
  }

  for (const [month, count] of campaignCounts.entries()) {
    const row = rowsByMonth.get(month);
    row.campaigns = Math.max(Number(row.campaigns || 0), count);
  }

  return recentMonths.map((month) => rowsByMonth.get(month));
}

export function DashboardPage() {
  const { campaigns, payments, navigate, currentUser, analytics, loadingDashboard, dashboardError } = useApp();
  
  const storedName = currentUser?.name?.trim();
  const displayName = storedName && storedName.toLowerCase() !== 'pending' ? storedName : currentUser?.companyName;
  const firstName = displayName ? displayName.split(' ')[0] : 'there';
  
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const totalSpend = payments.reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9.-]+/g,"")), 0);
  const statsData = analytics?.stats || {};
  
  const stats = [
    { label: 'Active Campaigns', value: String(statsData.activeCampaigns ?? activeCampaigns), helper: `${statsData.totalCampaigns ?? campaigns.length} total`, trend: 'up', icon: Megaphone },
    { label: 'Creators Hired', value: String(statsData.totalCreators ?? 0), helper: `${statsData.acceptedApplications ?? 0} accepted`, trend: 'up', icon: Users },
    { label: 'Database Spend', value: `₹${Number(statsData.totalSpend ?? totalSpend).toLocaleString('en-IN')}`, helper: `${payments.length} escrow records`, trend: 'up', icon: DollarSign },
    { label: 'Applications', value: String(statsData.totalApplications ?? 0), helper: `${statsData.completionRate ?? 0}% accepted`, trend: 'up', icon: Eye },
  ];

  const engagementData = buildCampaignPerformanceData(campaigns, analytics?.performanceData);

  const categoryData = (analytics?.topCategories || []).map((category, index) => ({
    ...category,
    color: ['bg-[#f0ad9f]', 'bg-[#91c0cf]', 'bg-[#6b9186]', 'bg-[#eec1b0]', 'bg-[#82a89d]', 'bg-[#b2d2db]'][index % 6],
  }));

  const topCampaigns = campaigns.slice(0, 5);

  const recentActivity = analytics?.recentActivity || [];

  const avatarColors = [
    'bg-[#a3e4c7] text-[#4c7569]',
    'bg-[#f4a298] text-[#b5735c]',
    'bg-[#91c0cf] text-[#4f8396]',
    'bg-[#cbe0dc] text-[#5b7d73]',
    'bg-[#eec1b0] text-[#a56754]'
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 font-sans text-slate-800 flex flex-col gap-4 sm:gap-6 w-full">
      {/* Top Header */}
      <header className="flex items-center justify-between mb-2 gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl font-bold text-white tracking-wide mb-0.5 sm:mb-1 truncate">Welcome back, {firstName}</h1>
          <p className="text-white/80 text-xs sm:text-sm hidden sm:block">Here's what's happening with your campaigns today</p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-white/10 border border-white/20 text-white placeholder-white/60 text-sm rounded-full py-2.5 pl-10 pr-4 w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-md transition-all"
            />
          </div>
          <button onClick={() => navigate('messages')} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 backdrop-blur-md transition-all relative">
            <MessageSquare className="w-4 h-4" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-400 rounded-full border-2 border-[#6f8e97]" />
          </button>
          <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 backdrop-blur-md transition-all">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#6f8e97]/40 backdrop-blur-xl border border-white/20 rounded-3xl p-3 sm:p-5 text-white flex flex-col justify-between h-[130px] sm:h-[150px] shadow-sm relative overflow-hidden group"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 z-10">
              <stat.icon className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] text-white/80 shrink-0" strokeWidth={2} />
              <span className="text-[11px] sm:text-sm font-medium text-white/90 leading-tight">{stat.label}</span>
            </div>
            
            <div className="z-10 mt-auto">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1.5 sm:mb-2">{stat.value}</h3>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium flex-wrap">
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] sm:text-xs bg-[#a3e4c7]/20 text-[#a3e4c7]">
                  Live DB
                </span>
                <span className="text-white/60 hidden sm:inline">{stat.helper}</span>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 mb-4 sm:mb-6">
        
        {/* Audience Engagement Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-8 bg-white/95 backdrop-blur-sm rounded-[28px] sm:rounded-[32px] p-4 sm:p-7 shadow-sm border border-white/40 flex flex-col relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#f0ad9f]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-8 z-10">
            <div>
              <h2 className="text-[13px] font-semibold text-slate-500 mb-0.5">Audience Engagement</h2>
              <p className="text-2xl font-bold text-slate-800">{statsData.totalApplications ?? 0} Applications</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all">
              <Clock className="w-3.5 h-3.5" />
              This Week
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="flex-1 w-full min-h-[180px] sm:min-h-[220px] z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs key="defs">
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1" key="grad1">
                    <stop offset="5%" stopColor="#82a89d" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#82a89d" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1" key="grad2">
                    <stop offset="5%" stopColor="#f0ad9f" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f0ad9f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  key="tooltip"
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 600 }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                />
                <Area key="area1" type="monotone" dataKey="campaigns" stroke="#82a89d" strokeWidth={3} fillOpacity={1} fill="url(#colorReach)" />
                <Area key="area2" type="monotone" dataKey="applications" stroke="#f0ad9f" strokeWidth={3} fillOpacity={1} fill="url(#colorInteractions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Creators by Niche */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-4 bg-white/95 backdrop-blur-sm rounded-[28px] sm:rounded-[32px] p-4 sm:p-7 shadow-sm border border-white/40 flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[13px] font-semibold text-slate-500 mb-0.5">Top Niches</h2>
              <p className="text-2xl font-bold text-slate-800">{categoryData.length}</p>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all">
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col justify-between py-1 space-y-3">
            {categoryData.length === 0 ? (
              <p className="text-sm font-medium text-slate-500">Create campaigns to populate category analytics.</p>
            ) : categoryData.map((category, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{category.name}</span>
                  <span className="text-slate-500">{category.value}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(category.value / category.max) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                    className={`h-full rounded-full ${category.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-4 bg-white/95 backdrop-blur-sm rounded-[28px] sm:rounded-[32px] p-4 sm:p-7 shadow-sm border border-white/40 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[15px] font-bold text-slate-800">Recent Activity</h2>
            <button onClick={() => navigate('applications')} className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-all">
              See All
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 flex-1">
            {recentActivity.length === 0 ? (
              <p className="text-sm font-medium text-slate-500">No database activity yet.</p>
            ) : recentActivity.map((item, i) => (
              <div key={i} className="flex flex-col gap-2 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${item.color}`}>
                    {item.type}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-700 leading-snug">{item.title}</h3>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Campaigns Table */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-8 bg-white/95 backdrop-blur-sm rounded-[28px] sm:rounded-[32px] p-4 sm:p-7 shadow-sm border border-white/40 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[15px] font-bold text-slate-800">Top Performing Campaigns</h2>
            <button onClick={() => navigate('campaigns')} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
              <span className="sr-only">Export</span>
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-[11px] font-semibold text-slate-400 w-[15%] uppercase">ID</th>
                  <th className="pb-3 text-[11px] font-semibold text-slate-400 w-[30%] uppercase">Campaign Name</th>
                  <th className="pb-3 text-[11px] font-semibold text-slate-400 w-[15%] uppercase">Creators</th>
                  <th className="pb-3 text-[11px] font-semibold text-slate-400 w-[20%] uppercase">Applications</th>
                  <th className="pb-3 text-[11px] font-semibold text-slate-400 w-[20%] uppercase text-right">Fill Rate</th>
                </tr>
              </thead>
              <tbody>
                {topCampaigns.map((campaign, rowIdx) => (
                  <tr key={campaign.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                    <td className="py-3.5 text-xs font-semibold text-slate-600">{campaign.id}</td>
                    <td className="py-3.5">
                      <span className="text-sm font-bold text-slate-700">{campaign.name}</span>
                    </td>
                    <td className="py-3.5 text-xs font-semibold text-slate-600">
                      <div className="flex -space-x-2">
                        {[...Array(Math.min(Number(campaign.creators) || 0, 3))].map((_, i) => (
                          <div key={i} className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold overflow-hidden z-10 ${avatarColors[(rowIdx + i) % avatarColors.length]}`}>
                            {campaign.name.charAt(i)}
                          </div>
                        ))}
                        {Number(campaign.creators) > 3 && (
                          <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 z-10">
                            +{Number(campaign.creators) - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 text-xs font-semibold text-slate-600">{campaign.reach}</td>
                    <td className="py-3.5 text-xs font-semibold text-[#5b7d73] text-right">{campaign.engagement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
