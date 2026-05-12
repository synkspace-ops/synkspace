import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from '../../../../lib/api';

const AppContext = createContext(null);

const emptyDashboard = {
  campaigns: [],
  applications: [],
  conversations: [],
  notifications: [],
  availableCampaigns: [],
  payments: [],
  events: [],
  creators: [],
  analytics: {
    stats: {
      activeCampaigns: 0,
      totalCampaigns: 0,
      totalCreators: 0,
      totalSpend: 0,
      totalApplications: 0,
      acceptedApplications: 0,
      completionRate: 0,
    },
    performanceData: [],
    budgetDistribution: [],
    topCategories: [],
    recentActivity: [],
  },
};

function getStoredUser() {
  try {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function formatDashboardPayload(data) {
  return {
    ...emptyDashboard,
    ...data,
    analytics: {
      ...emptyDashboard.analytics,
      ...(data?.analytics || {}),
      stats: {
        ...emptyDashboard.analytics.stats,
        ...(data?.analytics?.stats || {}),
      },
    },
    conversations: data?.conversations || [],
    notifications: data?.notifications || [],
    availableCampaigns: data?.availableCampaigns || [],
  };
}

function normalizeCurrentUser(user, fallback = {}, patch = {}) {
  if (!user && !fallback && !patch) return null;
  const profile = user?.profile || user?.creatorProfile || user?.brandProfile || user?.organiserProfile || {};
  const roleValue = user?.role || fallback?.role || patch?.role || '';
  const profilePatch = { ...patch };
  delete profilePatch.displayName;
  delete profilePatch.companyName;
  delete profilePatch.founderName;
  delete profilePatch.orgName;
  delete profilePatch.contactName;

  if (patch.displayName !== undefined) profilePatch.displayName = patch.displayName;
  if (patch.avatarUrl !== undefined) profilePatch.avatarUrl = patch.avatarUrl || '';

  const avatarUrl = patch.avatarUrl !== undefined
    ? patch.avatarUrl || ''
    : user?.avatarUrl || profile.avatarUrl || fallback?.avatarUrl || '';
  const phone = patch.phone !== undefined
    ? patch.phone || ''
    : user?.phone || profile.phone || fallback?.phone || '';
  const location = user?.location || [
    profile.city,
    profile.state,
    profile.country,
  ].filter(Boolean).join(', ') || profile.location || fallback?.location || '';

  return {
    ...(fallback || {}),
    ...(user || {}),
    role: typeof roleValue === 'string' ? roleValue.toLowerCase() : roleValue,
    name: patch.displayName || user?.name || profile.displayName || profile.founderName || profile.contactName || fallback?.name || user?.email?.split('@')?.[0] || '',
    companyName: patch.companyName || user?.companyName || profile.companyName || profile.orgName || fallback?.companyName || '',
    phone,
    avatarUrl,
    location,
    profile: {
      ...(fallback?.profile || {}),
      ...profile,
      ...profilePatch,
    },
  };
}

export function AppProvider({ children, navigate }) {
  const [currentUser, setCurrentUser] = useState(getStoredUser);
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState("");

  const userId = currentUser?.id;

  const refreshDashboard = async () => {
    if (!userId) {
      setDashboard(emptyDashboard);
      setDashboardError("Complete onboarding or sign in to load dashboard data.");
      return;
    }

    setLoadingDashboard(true);
    setDashboardError("");
    try {
      const response = await apiGet(`/api/dashboard`);
      const payload = formatDashboardPayload(response.data || {});
      setDashboard(payload);
      if (payload.user) {
        const nextUser = normalizeCurrentUser(payload.user, currentUser);
        setCurrentUser(nextUser);
        localStorage.setItem("currentUser", JSON.stringify(nextUser));
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setDashboard(emptyDashboard);
      setDashboardError("Could not load database dashboard details.");
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    refreshDashboard();
  }, [userId]);

  const addCampaign = async (campaign) => {
    if (!userId) throw new Error("Missing dashboard user");
    const response = await apiPost(`/api/dashboard/campaigns`, campaign);
    setDashboard((prev) => ({
      ...prev,
      campaigns: [response.data, ...prev.campaigns],
      events: currentUser?.role === "organiser" ? [response.data, ...prev.events] : prev.events,
    }));
    await refreshDashboard();
    navigate('campaigns');
  };

  const updateCampaignStatus = async (id, status) => {
    if (!userId) return;
    const response = await apiPatch(`/api/dashboard/campaigns/${id}`, { status });
    setDashboard((prev) => ({
      ...prev,
      campaigns: prev.campaigns.map((campaign) => campaign.id === id ? response.data : campaign),
      events: prev.events.map((campaign) => campaign.id === id ? response.data : campaign),
    }));
    await refreshDashboard();
  };

  const deleteCampaign = async (id) => {
    if (!userId) return;
    await apiDelete(`/api/dashboard/campaigns/${id}`);
    setDashboard((prev) => ({
      ...prev,
      campaigns: prev.campaigns.filter((campaign) => campaign.id !== id),
      events: prev.events.filter((campaign) => campaign.id !== id),
    }));
    await refreshDashboard();
  };

  const updateApplication = async (id, status) => {
    if (!userId) return;
    const response = await apiPatch(`/api/dashboard/applications/${id}`, { status });
    setDashboard((prev) => ({
      ...prev,
      applications: prev.applications.map((app) => app.id === id ? response.data : app),
    }));
    await refreshDashboard();
  };

  const applyToCampaign = async (campaignId, application) => {
    if (!userId) throw new Error("Missing dashboard user");
    const response = await apiPost(`/api/campaigns/${campaignId}/applications`, application);
    await refreshDashboard();
    return response.data;
  };

  const addMessage = async (conversationId, text) => {
    const response = await apiPost(`/api/dashboard/messages/${conversationId}`, { text });
    setDashboard((prev) => ({
      ...prev,
      conversations: prev.conversations.map((conversation) =>
        conversation.id === conversationId ? response.data : conversation
      ),
    }));
  };

  const updateProfile = async (profile) => {
    if (!userId) throw new Error("Missing dashboard user");
    const response = await apiPut(`/api/users/me`, profile);
    const nextUser = normalizeCurrentUser(response.data, currentUser, profile);
    setCurrentUser(nextUser);
    localStorage.setItem("currentUser", JSON.stringify(nextUser));
    await refreshDashboard();
    return nextUser;
  };

  const markRead = async (conversationId) => {
    if (!conversationId) return;
    const response = await apiPatch(`/api/dashboard/messages/${conversationId}/read`, {});
    setDashboard((prev) => ({
      ...prev,
      conversations: prev.conversations.map((conversation) =>
        conversation.id === conversationId ? response.data : conversation
      ),
    }));
  };
  const releasePayment = () => {};
  const addEvent = addCampaign;

  const value = useMemo(() => ({
    currentUser,
    setCurrentUser,
    loadingDashboard,
    dashboardError,
    refreshDashboard,
    campaigns: dashboard.campaigns,
    addCampaign,
    updateCampaignStatus,
    deleteCampaign,
    applications: dashboard.applications,
    applyToCampaign,
    updateApplication,
    conversations: dashboard.conversations,
    notifications: dashboard.notifications,
    availableCampaigns: dashboard.availableCampaigns,
    addMessage,
    updateProfile,
    markRead,
    payments: dashboard.payments,
    releasePayment,
    events: dashboard.events,
    addEvent,
    creators: dashboard.creators,
    analytics: dashboard.analytics,
    navigate,
  }), [currentUser, dashboard, loadingDashboard, dashboardError]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
