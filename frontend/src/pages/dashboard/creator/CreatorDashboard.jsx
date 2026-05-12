import { useMemo, useState } from 'react';
import {
  BarChart3,
  Bell,
  Briefcase,
  ChevronDown,
  CheckCircle2,
  Edit3,
  FileCheck,
  Grid3x3,
  LogOut,
  Mail,
  MessageSquare,
  Settings,
  Target,
  UserCircle,
  Wallet,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../../assets/synkspace-logo.png';
import { clearAuthSession } from '../../../lib/auth';
import { OpportunitiesScreen } from './components/OpportunitiesScreen';
import { MessagesScreen } from './components/MessagesScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { EarningsScreen } from './components/EarningsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { MyApplicationsScreen } from './components/MyApplicationsScreen';
import { AppProvider, useApp } from '../shared/context/AppContext';

function parseMoney(value) {
  if (typeof value === 'number') return value;
  return Number(String(value || '').replace(/[^\d.-]/g, '')) || 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function profileCompletion(user) {
  const profile = user?.profile || {};
  const fields = [
    user?.name,
    user?.email,
    user?.phone,
    user?.location,
    user?.avatarUrl,
    profile.niche,
    profile.socialHandle,
    profile.followerRange,
    profile.bio,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

function EmptyState({ title, body }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/50 p-8 text-center shadow-xl backdrop-blur-xl">
      <p className="text-base font-bold text-gray-900">{title}</p>
      <p className="mt-2 text-sm text-gray-600">{body}</p>
    </div>
  );
}

function StatCard({ label, value, helper, icon: Icon, tone }) {
  return (
    <div className={`rounded-2xl border-2 border-white/60 p-4 shadow-xl backdrop-blur-2xl ${tone}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-800/80">{label}</div>
          <div className="mt-1 text-2xl font-bold text-white drop-shadow-lg">{value}</div>
          {helper && <div className="mt-1 text-xs font-semibold text-gray-800/80">{helper}</div>}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/50 shadow-lg">
          <Icon className="h-5 w-5 text-gray-800" />
        </div>
      </div>
    </div>
  );
}

function CreatorDashboardContent() {
  const app = useApp() || {};
  const routerNavigate = useNavigate();
  const currentUser = app.currentUser;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const displayName = currentUser?.name && currentUser.name.toLowerCase() !== 'pending'
    ? currentUser.name
    : currentUser?.email?.split('@')[0] || 'Creator';
  const firstName = displayName.split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();
  const notifications = app.notifications || [];
  const unreadNotifications = notifications.filter((item) => !item.isRead).length;
  const totalUnread = (app.conversations || []).reduce((sum, chat) => sum + (chat.unread || 0), 0);

  const stats = useMemo(() => {
    const applications = app.applications || [];
    const campaigns = app.campaigns || [];
    const availableCampaigns = app.availableCampaigns || [];
    const payments = app.payments || [];
    const totalEarnings = payments
      .filter((payment) => ['released', 'held'].includes(String(payment.status || '').toLowerCase()))
      .reduce((sum, payment) => sum + parseMoney(payment.amount), 0);
    const accepted = applications.filter((item) => item.status === 'accepted').length;
    const pending = applications.filter((item) => item.status === 'pending').length;
    return {
      totalEarnings,
      appliedCampaigns: applications.length,
      accepted,
      pending,
      activeDeals: campaigns.filter((item) => ['active', 'accepted', 'shortlisted'].includes(String(item.status || '').toLowerCase())).length,
      opportunities: availableCampaigns.length,
      profile: profileCompletion(currentUser),
    };
  }, [app.applications, app.availableCampaigns, app.campaigns, app.payments, currentUser]);

  const navItems = [
    ['dashboard', Grid3x3],
    ['opportunities', Target],
    ['applications', FileCheck],
    ['messages', MessageSquare],
    ['analytics', BarChart3],
    ['earnings', Wallet],
    ['settings', Settings],
  ];

  const activeDeals = (app.campaigns || []).slice(0, 2);
  const recentApplications = (app.applications || []).slice(0, 3);
  const recentNotifications = notifications.slice(0, 2);

  const handleEditProfile = () => {
    setProfileMenuAnchor(null);
    setActiveTab('settings');
  };

  const handleLogout = () => {
    clearAuthSession();
    setProfileMenuAnchor(null);
    routerNavigate('/login', { replace: true });
  };

  const avatarNode = (size = 'h-14 w-14', textSize = 'text-base') => (
    <div className={`flex ${size} items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 ${textSize} font-semibold text-white shadow-xl`}>
      {currentUser?.avatarUrl ? <img src={currentUser.avatarUrl} alt={displayName} className="h-full w-full object-cover" /> : initial}
    </div>
  );

  const profileMenu = (
    <div className="absolute bottom-14 left-0 z-50 w-56 overflow-hidden rounded-2xl border border-white/70 bg-white/95 p-2 shadow-2xl backdrop-blur-xl">
      <div className="mb-2 flex items-center gap-3 rounded-xl bg-gray-50/80 p-3">
        {avatarNode('h-10 w-10', 'text-sm')}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-gray-950">{displayName}</p>
          <p className="truncate text-xs text-gray-500">{currentUser?.email}</p>
        </div>
      </div>
      <button onClick={handleEditProfile} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-700 transition hover:bg-purple-50 hover:text-purple-700">
        <Edit3 className="h-4 w-4" />
        Edit Profile
      </button>
      <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50">
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </div>
  );

  const renderPage = () => {
    if (activeTab === 'opportunities') return <OpportunitiesScreen />;
    if (activeTab === 'applications') return <MyApplicationsScreen />;
    if (activeTab === 'messages') return <MessagesScreen />;
    if (activeTab === 'analytics') return <AnalyticsScreen />;
    if (activeTab === 'earnings') return <EarningsScreen />;
    if (activeTab === 'settings') return <SettingsScreen />;

    return (
      <div className="h-full min-h-0 space-y-4 overflow-hidden">
        {app.loadingDashboard && <EmptyState title="Loading dashboard" body="Fetching your latest creator data." />}
        {app.dashboardError && <EmptyState title="Dashboard unavailable" body={app.dashboardError} />}

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-6">
          <StatCard label="Total Earnings" value={formatCurrency(stats.totalEarnings)} helper={`${app.payments?.length || 0} payment records`} icon={Wallet} tone="bg-gradient-to-br from-emerald-300/80 to-teal-400/80" />
          <StatCard label="Applications" value={stats.appliedCampaigns} helper={`${stats.pending} pending`} icon={FileCheck} tone="bg-gradient-to-br from-purple-300/80 to-indigo-400/80" />
          <StatCard label="Accepted" value={stats.accepted} helper="Approved collaborations" icon={CheckCircle2} tone="bg-gradient-to-br from-blue-300/80 to-cyan-400/80" />
          <StatCard label="Active Deals" value={stats.activeDeals} helper="Current collaborations" icon={Briefcase} tone="bg-gradient-to-br from-pink-300/80 to-rose-400/80" />
          <StatCard label="Opportunities" value={stats.opportunities} helper="Open campaigns" icon={Target} tone="bg-gradient-to-br from-orange-300/80 to-amber-400/80" />
          <StatCard label="Messages" value={totalUnread} helper="Unread conversations" icon={MessageSquare} tone="bg-gradient-to-br from-slate-300/80 to-gray-400/80" />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <section className="xl:col-span-8 rounded-2xl border border-white/60 bg-white/60 p-4 shadow-lg backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
              <button onClick={() => setActiveTab('applications')} className="text-sm font-bold text-purple-700">View all</button>
            </div>
            {recentApplications.length ? (
              <div className="space-y-2">
                {recentApplications.map((application) => (
                  <div key={application.id} className="rounded-xl border border-white/60 bg-white/60 p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-gray-900">{application.campaign}</p>
                        <p className="text-sm text-gray-600">{application.price} · {application.followers}</p>
                      </div>
                      <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-bold uppercase text-white">{application.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No applications yet" body="When you apply to campaigns, they will appear here." />
            )}
          </section>

          <section className="xl:col-span-4 rounded-2xl border border-white/60 bg-white/60 p-4 shadow-lg backdrop-blur-xl">
            <h3 className="mb-3 text-lg font-bold text-gray-900">Profile Completion</h3>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-full bg-white/70 p-1 shadow-inner">
                <div
                  className="h-full w-full rounded-full"
                  style={{ background: `conic-gradient(#8b5cf6 ${stats.profile * 3.6}deg, rgba(255,255,255,.7) 0deg)` }}
                />
                <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white text-lg font-black text-gray-900">
                  {stats.profile}%
                </div>
              </div>
              <div>
                <p className="font-bold text-gray-900">{displayName}</p>
                <p className="mt-1 text-sm text-gray-600">{currentUser?.location || 'Location not added'}</p>
                <p className="mt-1 text-sm text-gray-600">{currentUser?.profile?.niche || 'Niche not added'}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <section className="rounded-2xl border border-white/60 bg-white/60 p-4 shadow-lg backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Active Deals</h3>
              <button onClick={() => setActiveTab('opportunities')} className="text-sm font-bold text-purple-700">Open opportunities</button>
            </div>
            {activeDeals.length ? (
              <div className="space-y-2">
                {activeDeals.map((campaign) => (
                  <div key={campaign.id} className="rounded-xl border border-white/60 bg-white/60 p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-gray-900">{campaign.title || campaign.name}</p>
                        <p className="text-sm text-gray-600">{campaign.budget} · {campaign.deadline}</p>
                      </div>
                      <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold uppercase text-white">{campaign.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No active deals" body="Accepted or active campaign work will appear here." />
            )}
          </section>

          <section className="rounded-2xl border border-white/60 bg-white/60 p-4 shadow-lg backdrop-blur-xl">
            <h3 className="mb-3 text-lg font-bold text-gray-900">Recent Notifications</h3>
            {recentNotifications.length ? (
              <div className="space-y-2">
                {recentNotifications.map((notification) => (
                  <div key={notification.id} className="rounded-xl border border-white/60 bg-white/60 p-3 shadow-sm">
                    <p className="font-bold text-gray-900">{notification.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{notification.body}</p>
                    <p className="mt-2 text-xs font-semibold text-gray-500">{notification.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No notifications" body="New account updates will appear here." />
            )}
          </section>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 p-4">
      <aside className="relative z-10 mr-4 flex w-20 shrink-0 flex-col items-center gap-4 rounded-2xl border border-white/60 bg-white/50 py-4 shadow-xl backdrop-blur-2xl">
        <button onClick={() => setActiveTab('dashboard')} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 shadow-md transition hover:scale-105">
          <img src={logo} alt="SynkSpace" className="h-10 w-10 object-contain" />
        </button>
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          {navItems.map(([id, Icon]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
                activeTab === id ? 'scale-105 border border-white/70 bg-white/70 text-purple-600 shadow-md' : 'text-gray-500 hover:bg-white/50'
              }`}
              title={id}
            >
              <Icon className="h-5 w-5" />
              {id === 'messages' && totalUnread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{totalUnread}</span>
              )}
            </button>
          ))}
        </div>
        <div className="relative">
          <button
            onClick={() => setProfileMenuAnchor((value) => value === 'sidebar' ? null : 'sidebar')}
            className="transition hover:scale-110"
            title="Profile menu"
          >
            {avatarNode('h-12 w-12', 'text-sm')}
          </button>
          {profileMenuAnchor === 'sidebar' && profileMenu}
        </div>
      </aside>

      <main className="relative mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col overflow-hidden">
        <header className="z-10 mb-4 flex items-center justify-between rounded-2xl border-b border-white/50 bg-white/40 px-6 py-4 shadow-md backdrop-blur-xl">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {activeTab === 'dashboard' ? `Good morning, ${firstName}.` : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
          <div className="relative flex items-center gap-4">
            <button onClick={() => setActiveTab('messages')} className="relative rounded-xl border border-transparent p-2 transition hover:border-white/50 hover:bg-white/60">
              <Mail className="h-5 w-5 text-gray-700" />
              {totalUnread > 0 && <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{totalUnread}</span>}
            </button>
            <button onClick={() => setShowNotifications((value) => !value)} className="relative rounded-xl border border-transparent p-2 transition hover:border-white/50 hover:bg-white/60">
              <Bell className="h-5 w-5 text-gray-700" />
              {unreadNotifications > 0 && <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{unreadNotifications}</span>}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-2xl backdrop-blur-xl">
                <div className="border-b border-white/50 p-4">
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length ? notifications.map((notification) => (
                    <div key={notification.id} className="border-b border-white/40 p-4">
                      <p className="text-sm font-bold text-gray-900">{notification.title}</p>
                      <p className="mt-1 text-sm text-gray-700">{notification.body}</p>
                      <p className="mt-2 text-xs font-semibold text-gray-500">{notification.time}</p>
                    </div>
                  )) : (
                    <div className="p-4 text-sm text-gray-600">No notifications yet.</div>
                  )}
                </div>
              </div>
            )}
            <button
              onClick={() => setProfileMenuAnchor((value) => value === 'header' ? null : 'header')}
              className="relative flex items-center gap-2 rounded-xl px-3 py-2 transition hover:border-white/50 hover:bg-white/60"
            >
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={displayName} className="h-8 w-8 rounded-full object-cover shadow-lg" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-sm font-semibold text-white">{initial}</div>
              )}
              <span className="font-medium text-gray-900">{firstName}</span>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>
            {profileMenuAnchor === 'header' && (
              <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-2xl border border-white/70 bg-white/95 p-2 shadow-2xl backdrop-blur-xl">
                <div className="mb-2 flex items-center gap-3 rounded-xl bg-gray-50/80 p-3">
                  {avatarNode('h-10 w-10', 'text-sm')}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-950">{displayName}</p>
                    <p className="truncate text-xs text-gray-500">{currentUser?.email}</p>
                  </div>
                </div>
                <button onClick={handleEditProfile} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-700 transition hover:bg-purple-50 hover:text-purple-700">
                  <UserCircle className="h-4 w-4" />
                  Edit Profile
                </button>
                <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </header>
        <div className={`min-h-0 flex-1 p-4 pt-0 ${activeTab === 'dashboard' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default function CreatorDashboard() {
  return (
    <AppProvider navigate={() => {}}>
      <CreatorDashboardContent />
    </AppProvider>
  );
}
