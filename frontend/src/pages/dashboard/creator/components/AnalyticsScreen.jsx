import { TrendingUp, Users, Eye, Heart, MessageCircle, Share2, Globe, MapPin, ArrowUp, ArrowDown, Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AnalyticsScreen() {
  const [dateRange, setDateRange] = useState('30d');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex justify-end">
        <div className="relative">
          <button
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="px-6 py-3 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-2xl hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-semibold"
          >
            <Calendar className="w-5 h-5" />
            <span>
              {dateRange === '7d' && 'Last 7 Days'}
              {dateRange === '30d' && 'Last 30 Days'}
              {dateRange === '90d' && 'Last 90 Days'}
              {dateRange === '12m' && 'Last 12 Months'}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showDateDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden z-10">
              {['7d', '30d', '90d', '12m'].map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setDateRange(range);
                    setShowDateDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-white/60 transition-all ${
                    dateRange === range ? 'bg-purple-100/80 text-purple-900 font-semibold' : 'text-gray-700'
                  }`}
                >
                  {range === '7d' && 'Last 7 Days'}
                  {range === '30d' && 'Last 30 Days'}
                  {range === '90d' && 'Last 90 Days'}
                  {range === '12m' && 'Last 12 Months'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-6">
        {/* Followers */}
        <div className="bg-gradient-to-br from-purple-300/70 to-purple-400/70 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-purple-900 mb-1">Total Followers</div>
                <div className="text-4xl font-bold text-white drop-shadow-lg">124.5K</div>
              </div>
              <div className="w-12 h-12 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border-2 border-white/70">
                <Users className="w-6 h-6 text-purple-700" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-white/40 backdrop-blur-md rounded-lg">
                <ArrowUp className="w-3 h-3 text-green-700" />
                <span className="text-xs font-bold text-green-800">+12.3%</span>
              </div>
              <span className="text-xs text-purple-900">vs last month</span>
            </div>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-gradient-to-br from-blue-300/70 to-blue-400/70 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-blue-900 mb-1">Engagement Rate</div>
                <div className="text-4xl font-bold text-white drop-shadow-lg">8.4%</div>
              </div>
              <div className="w-12 h-12 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border-2 border-white/70">
                <Heart className="w-6 h-6 text-blue-700" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-white/40 backdrop-blur-md rounded-lg">
                <ArrowUp className="w-3 h-3 text-green-700" />
                <span className="text-xs font-bold text-green-800">+2.1%</span>
              </div>
              <span className="text-xs text-blue-900">vs last month</span>
            </div>
          </div>
        </div>

        {/* Profile Views */}
        <div className="bg-gradient-to-br from-pink-300/70 to-pink-400/70 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-pink-900 mb-1">Profile Views</div>
                <div className="text-4xl font-bold text-white drop-shadow-lg">42.8K</div>
              </div>
              <div className="w-12 h-12 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border-2 border-white/70">
                <Eye className="w-6 h-6 text-pink-700" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-white/40 backdrop-blur-md rounded-lg">
                <ArrowUp className="w-3 h-3 text-green-700" />
                <span className="text-xs font-bold text-green-800">+18.5%</span>
              </div>
              <span className="text-xs text-pink-900">vs last month</span>
            </div>
          </div>
        </div>

        {/* Growth Rate */}
        <div className="bg-gradient-to-br from-emerald-300/70 to-emerald-400/70 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-900 mb-1">Growth Rate</div>
                <div className="text-4xl font-bold text-white drop-shadow-lg">+15.2%</div>
              </div>
              <div className="w-12 h-12 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border-2 border-white/70">
                <TrendingUp className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-white/40 backdrop-blur-md rounded-lg">
                <ArrowUp className="w-3 h-3 text-green-700" />
                <span className="text-xs font-bold text-green-800">+4.2%</span>
              </div>
              <span className="text-xs text-emerald-900">vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Chart & Audience Demographics */}
      <div className="grid grid-cols-12 gap-6">
        {/* Growth Chart */}
        <div className="col-span-8 bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>

          <div className="relative">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Follower Growth</h3>

            {/* Follower Growth Recharts Graph */}
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { name: 'Jan', followers: 65000 },
                    { name: 'Feb', followers: 72000 },
                    { name: 'Mar', followers: 68000 },
                    { name: 'Apr', followers: 80000 },
                    { name: 'May', followers: 75000 },
                    { name: 'Jun', followers: 85000 },
                    { name: 'Jul', followers: 90000 },
                    { name: 'Aug', followers: 88000 },
                    { name: 'Sep', followers: 95000 },
                    { name: 'Oct', followers: 92000 },
                    { name: 'Nov', followers: 98000 },
                    { name: 'Dec', followers: 124500 }
                  ]}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.2)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#4b5563', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#4b5563', fontSize: 12 }}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.5)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="followers" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorFollowers)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Audience Demographics */}
        <div className="col-span-4 bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Audience Split</h3>

            <div className="space-y-4">
              {/* Gender */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">Gender</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600">Female</span>
                      <span className="text-xs font-bold text-gray-900">62%</span>
                    </div>
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600">Male</span>
                      <span className="text-xs font-bold text-gray-900">38%</span>
                    </div>
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style={{ width: '38%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Age Groups */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">Age Groups</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600">18-24</span>
                      <span className="text-xs font-bold text-gray-900">45%</span>
                    </div>
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600">25-34</span>
                      <span className="text-xs font-bold text-gray-900">35%</span>
                    </div>
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600">35-44</span>
                      <span className="text-xs font-bold text-gray-900">20%</span>
                    </div>
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Locations */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">Top Locations</span>
                </div>
                <div className="space-y-2">
                  {[
                    { country: 'United States', percentage: 42 },
                    { country: 'United Kingdom', percentage: 28 },
                    { country: 'Canada', percentage: 15 }
                  ].map((location, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600 flex-1">{location.country}</span>
                      <span className="text-xs font-bold text-gray-900">{location.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Performance & Campaign Stats */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Posts */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-pink-200/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performing Content</h3>

            <div className="space-y-3">
              {[
                { platform: 'Instagram', type: 'Reel', reach: '245K', engagement: '24.5K', rate: '10.2%' },
                { platform: 'Youtube', type: 'Video', reach: '189K', engagement: '18.2K', rate: '9.6%' },
                { platform: 'Instagram', type: 'Post', reach: '156K', engagement: '12.8K', rate: '8.2%' }
              ].map((post, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg hover:scale-102 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-900">{post.platform} {post.type}</h4>
                      <p className="text-xs text-gray-600">Engagement Rate: {post.rate}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Reach</div>
                      <div className="text-lg font-bold text-gray-900">{post.reach}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Engagement</div>
                      <div className="text-lg font-bold text-gray-900">{post.engagement}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-200/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Campaign Performance</h3>

            <div className="space-y-3">
              {[
                { name: 'Nike Summer Launch', revenue: '$2,500', engagement: '145K', success: 94 },
                { name: 'Lumina Gaming', revenue: '$3,800', engagement: '98K', success: 88 },
                { name: 'Aura Wellness', revenue: '$1,800', engagement: '76K', success: 92 }
              ].map((campaign, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg hover:scale-102 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 mb-1">{campaign.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>Revenue: {campaign.revenue}</span>
                        <span>•</span>
                        <span>Engagement: {campaign.engagement}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-600">Success Rate</span>
                      <span className="text-xs font-bold text-gray-900">{campaign.success}%</span>
                    </div>
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: `${campaign.success}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


