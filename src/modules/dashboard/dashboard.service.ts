import { prisma } from "../../db/client.js";
import type { AppStatus, Campaign, CampaignStatus, User } from "@prisma/client";

const STATUS_TO_UI: Record<CampaignStatus, string> = {
  DRAFT: "draft",
  ACTIVE: "active",
  CLOSED: "closed",
  COMPLETED: "completed",
};

const UI_TO_STATUS: Record<string, CampaignStatus> = {
  draft: "DRAFT",
  active: "ACTIVE",
  closed: "CLOSED",
  completed: "COMPLETED",
};

const APP_STATUS_TO_UI: Record<AppStatus, string> = {
  APPLIED: "pending",
  SHORTLISTED: "shortlisted",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

const UI_TO_APP_STATUS: Record<string, AppStatus> = {
  pending: "APPLIED",
  shortlisted: "SHORTLISTED",
  accepted: "ACCEPTED",
  rejected: "REJECTED",
};

const DIRECT_CONVERSATION_PREFIX = "direct_";

function directConversationId(userId: string) {
  return `${DIRECT_CONVERSATION_PREFIX}${userId}`;
}

function directUserIdFromConversation(conversationId: string) {
  return conversationId.startsWith(DIRECT_CONVERSATION_PREFIX)
    ? conversationId.slice(DIRECT_CONVERSATION_PREFIX.length)
    : null;
}

function money(value: unknown) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function shortNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

function dateLabel(value?: Date | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric", year: "numeric" }).format(value);
}

function monthKey(value: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(value);
}

function profileName(user: Awaited<ReturnType<typeof getUserWithProfiles>>) {
  if (!user) return "";
  return (
    user.creatorProfile?.displayName ||
    user.brandProfile?.founderName ||
    user.organiserProfile?.contactName ||
    user.email.split("@")[0]
  );
}

function displayNameForUser(user: any) {
  if (!user) return "User";
  return (
    user.creatorProfile?.displayName ||
    user.brandProfile?.companyName ||
    user.brandProfile?.founderName ||
    user.organiserProfile?.orgName ||
    user.organiserProfile?.contactName ||
    user.email?.split("@")?.[0] ||
    "User"
  );
}

function avatarUrlForUser(user: any) {
  return user?.creatorProfile?.avatarUrl || user?.brandProfile?.avatarUrl || user?.organiserProfile?.avatarUrl || "";
}

function subtitleForUser(user: any) {
  if (user?.creatorProfile) {
    return [user.creatorProfile.niche, user.creatorProfile.followerRange].filter(Boolean).join(" · ");
  }
  if (user?.brandProfile) return user.brandProfile.companyName || "Brand";
  if (user?.organiserProfile) return user.organiserProfile.orgName || "Event organiser";
  return user?.role ? String(user.role).toLowerCase() : "";
}

async function getUserWithProfiles(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      creatorProfile: true,
      brandProfile: true,
      organiserProfile: true,
    },
  });
}

function buildUser(user: NonNullable<Awaited<ReturnType<typeof getUserWithProfiles>>>) {
  const profile = user.creatorProfile || user.brandProfile || user.organiserProfile;
  const profileWithPhoneCode = profile && "phoneCode" in profile ? profile : undefined;
  const profileWithLocation = profile && "city" in profile ? profile : undefined;
  const state = profile && "state" in profile ? profile.state : undefined;
  const brandLocation = user.brandProfile?.location;
  return {
    id: user.id,
    email: user.email,
    role: user.role.toLowerCase(),
    name: profileName(user),
    companyName: user.brandProfile?.companyName || user.organiserProfile?.orgName || "",
    phone: profile?.phone || "",
    phoneCode: profileWithPhoneCode?.phoneCode,
    phoneCountry: profileWithPhoneCode && "phoneCountry" in profileWithPhoneCode ? profileWithPhoneCode.phoneCountry : undefined,
    avatarUrl: profile?.avatarUrl || "",
    status: user.status,
    location: [
      profileWithLocation?.city,
      state,
      profileWithLocation?.country,
    ].filter(Boolean).join(", ") || brandLocation || "",
    profile,
  };
}

function buildCampaign(campaign: Campaign & { applications?: unknown[] }) {
  const applicationCount = Array.isArray(campaign.applications) ? campaign.applications.length : 0;
  const acceptedCount = Array.isArray(campaign.applications)
    ? campaign.applications.filter((app: any) => app.status === "ACCEPTED").length
    : campaign.filledSlots;
  const progress = campaign.totalSlots > 0
    ? Math.min(100, Math.round((acceptedCount / campaign.totalSlots) * 100))
    : 0;

  return {
    id: campaign.id,
    name: campaign.title,
    title: campaign.title,
    description: campaign.description,
    category: campaign.category,
    status: STATUS_TO_UI[campaign.status],
    creators: acceptedCount,
    applications: applicationCount,
    budget: `${money(campaign.budgetMin)} - ${money(campaign.budgetMax)}`,
    budgetMin: Number(campaign.budgetMin),
    budgetMax: Number(campaign.budgetMax),
    reach: shortNumber(applicationCount),
    engagement: `${campaign.totalSlots ? Math.round((applicationCount / campaign.totalSlots) * 100) : 0}%`,
    progress,
    deadline: dateLabel(campaign.deadline),
    location: campaign.location,
    platforms: campaign.platforms,
    deliverables: campaign.deliverables,
    createdAt: campaign.createdAt,
  };
}

function buildApplications(applications: any[]) {
  return applications.map((app) => {
    const creatorProfile = app.creator?.creatorProfile;
    const campaign = app.campaign;
    return {
      id: app.id,
      creator: creatorProfile?.displayName || app.creator?.email?.split("@")[0] || "Creator",
      campaign: campaign?.title || "Campaign",
      price: money(app.proposedRate),
      proposal: app.message || "No proposal message submitted.",
      status: APP_STATUS_TO_UI[app.status as AppStatus],
      followers: creatorProfile?.followerRange || "Not provided",
      color: "bg-[#a3e4c7] text-[#4c7569]",
    };
  });
}

function buildAnalytics(campaigns: any[], applications: any[], escrows: any[], creatorCount: number) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const recentMonths = Array.from({ length: 6 }, (_, idx) => months[(currentMonth - 5 + idx + 12) % 12]);
  const performanceData = recentMonths.map((month, idx) => {
    const monthCampaigns = campaigns.filter((campaign) => monthKey(campaign.createdAt) === month);
    const monthApps = applications.filter((app) => monthKey(app.appliedAt) === month);
    const spend = escrows
      .filter((escrow) => monthKey(escrow.createdAt) === month)
      .reduce((sum, escrow) => sum + Number(escrow.amount || 0), 0);
    return {
      id: idx + 1,
      month,
      campaigns: monthCampaigns.length,
      applications: monthApps.length,
      spend,
    };
  });

  const categoryTotals = new Map<string, number>();
  for (const campaign of campaigns) {
    categoryTotals.set(campaign.category, (categoryTotals.get(campaign.category) || 0) + Number(campaign.budgetMax || 0));
  }
  const totalCategorySpend = Array.from(categoryTotals.values()).reduce((sum, value) => sum + value, 0);
  const budgetDistribution = Array.from(categoryTotals.entries()).map(([name, value], index) => ({
    id: index + 1,
    name,
    value: totalCategorySpend > 0 ? Math.round((value / totalCategorySpend) * 100) : 0,
  }));

  const topCategories = Array.from(categoryTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value: Number(value), max: Math.max(...categoryTotals.values(), 1) }));

  const totalSpend = escrows.reduce((sum, escrow) => sum + Number(escrow.amount || 0), 0);
  const acceptedApplications = applications.filter((app) => app.status === "ACCEPTED").length;

  return {
    stats: {
      activeCampaigns: campaigns.filter((campaign) => campaign.status === "ACTIVE").length,
      totalCampaigns: campaigns.length,
      totalCreators: creatorCount,
      totalSpend,
      totalApplications: applications.length,
      acceptedApplications,
      completionRate: applications.length ? Math.round((acceptedApplications / applications.length) * 100) : 0,
    },
    performanceData,
    budgetDistribution,
    topCategories,
    recentActivity: applications.slice(0, 6).map((app) => ({
      title: `${app.creator?.creatorProfile?.displayName || app.creator?.email?.split("@")[0] || "Creator"} applied to ${app.campaign?.title || "a campaign"}`,
      time: dateLabel(app.appliedAt),
      type: "Application",
      color: "bg-[#6b9186]/20 text-[#4c7569]",
    })),
  };
}

function buildApplicationConversations(userId: string, applications: any[]) {
  return applications.map((app) => {
    const creatorName = app.creator?.creatorProfile?.displayName || app.creator?.email?.split("@")[0] || "Creator";
    const brandName =
      app.campaign?.brand?.brandProfile?.companyName ||
      app.campaign?.brand?.organiserProfile?.orgName ||
      app.campaign?.brand?.email?.split("@")[0] ||
      "Campaign owner";
    const otherName = app.creatorId === userId ? brandName : creatorName;
    const messages = (app.messages || []).map((message: any) => ({
      id: message.id,
      senderId: message.senderId,
      sender: message.senderId === userId ? "You" : otherName,
      text: message.body,
      time: dateLabel(message.createdAt),
      isMine: message.senderId === userId,
      createdAt: message.createdAt,
      readAt: message.readAt,
    }));
    return {
      id: app.id,
      name: otherName,
      subtitle: app.campaign?.title || "Campaign conversation",
      avatarUrl: app.creatorId === userId ? avatarUrlForUser(app.campaign?.brand) : avatarUrlForUser(app.creator),
      direct: false,
      time: messages.at(-1)?.time || dateLabel(app.appliedAt),
      unread: (app.messages || []).filter((message: any) => message.senderId !== userId && !message.readAt).length,
      online: false,
      color: "bg-[#a3e4c7] text-[#4c7569]",
      messages,
    };
  });
}

function buildDirectConversations(userId: string, messages: any[]) {
  const grouped = new Map<string, any[]>();
  for (const message of messages) {
    const otherId = message.senderId === userId ? message.recipientId : message.senderId;
    if (!otherId) continue;
    grouped.set(otherId, [...(grouped.get(otherId) || []), message]);
  }

  return Array.from(grouped.entries()).map(([otherId, group]) => {
    const first = group[0];
    const otherUser = first.senderId === userId ? first.recipient : first.sender;
    const builtMessages = group.map((message) => ({
      id: message.id,
      senderId: message.senderId,
      sender: message.senderId === userId ? "You" : displayNameForUser(otherUser),
      text: message.body,
      time: dateLabel(message.createdAt),
      isMine: message.senderId === userId,
      createdAt: message.createdAt,
      readAt: message.readAt,
    }));

    return {
      id: directConversationId(otherId),
      direct: true,
      creatorId: otherUser?.role === "CREATOR" ? otherId : undefined,
      name: displayNameForUser(otherUser),
      subtitle: subtitleForUser(otherUser) || "Direct message",
      avatarUrl: avatarUrlForUser(otherUser),
      time: builtMessages.at(-1)?.time || "New",
      unread: group.filter((message) => message.senderId !== userId && !message.readAt).length,
      online: false,
      color: "bg-[#a3e4c7] text-[#4c7569]",
      messages: builtMessages,
    };
  });
}

function buildDirectConversationForUser(userId: string, otherUser: any, messages: any[] = []) {
  if (messages.length) return buildDirectConversations(userId, messages)[0];
  return {
    id: directConversationId(otherUser.id),
    direct: true,
    creatorId: otherUser.role === "CREATOR" ? otherUser.id : undefined,
    name: displayNameForUser(otherUser),
    subtitle: subtitleForUser(otherUser) || "Direct message",
    avatarUrl: avatarUrlForUser(otherUser),
    time: "New",
    unread: 0,
    online: false,
    color: "bg-[#a3e4c7] text-[#4c7569]",
    messages: [],
  };
}

function buildConversations(userId: string, applications: any[], directMessages: any[] = []) {
  return [
    ...buildDirectConversations(userId, directMessages),
    ...buildApplicationConversations(userId, applications),
  ].sort((a, b) => {
    const aDate = a.messages.at(-1)?.createdAt || "";
    const bDate = b.messages.at(-1)?.createdAt || "";
    return String(bDate).localeCompare(String(aDate));
  });
}

function buildNotifications(notifications: any[]) {
  return notifications.map((notification) => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    isRead: notification.isRead,
    time: dateLabel(notification.createdAt),
    createdAt: notification.createdAt,
  }));
}

export async function getDashboardSnapshot(userId: string) {
  const user = await getUserWithProfiles(userId);
  if (!user) throw new Error("User not found");

  const ownsCampaigns = user.role === "BRAND" || user.role === "ORGANISER";
  const campaigns = ownsCampaigns
    ? await prisma.campaign.findMany({
        where: { brandId: userId },
        orderBy: { createdAt: "desc" },
        include: { applications: true },
      })
    : await prisma.campaign.findMany({
        where: { applications: { some: { creatorId: userId } } },
        orderBy: { createdAt: "desc" },
        include: { applications: true },
      });

  const applications = ownsCampaigns
    ? await prisma.application.findMany({
        where: { campaign: { brandId: userId } },
        orderBy: { appliedAt: "desc" },
        include: {
          messages: { orderBy: { createdAt: "asc" } },
          campaign: { include: { brand: { include: { brandProfile: true, organiserProfile: true } } } },
          creator: { include: { creatorProfile: true } },
        },
      })
    : await prisma.application.findMany({
        where: { creatorId: userId },
        orderBy: { appliedAt: "desc" },
        include: {
          messages: { orderBy: { createdAt: "asc" } },
          campaign: { include: { brand: { include: { brandProfile: true, organiserProfile: true } } } },
          creator: { include: { creatorProfile: true } },
        },
      });

  const escrows = await prisma.escrow.findMany({
    where: ownsCampaigns ? { contract: { brandId: userId } } : { contract: { creatorId: userId } },
    orderBy: { createdAt: "desc" },
    include: {
      contract: {
        include: {
          application: { include: { campaign: true, creator: { include: { creatorProfile: true } } } },
        },
      },
    },
  });

  const creatorCount = ownsCampaigns
    ? await prisma.application.count({ where: { campaign: { brandId: userId }, status: "ACCEPTED" } })
    : 1;

  const directMessages = await prisma.message.findMany({
    where: {
      applicationId: null,
      OR: [{ senderId: userId }, { recipientId: userId }],
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { include: { creatorProfile: true, brandProfile: true, organiserProfile: true } },
      recipient: { include: { creatorProfile: true, brandProfile: true, organiserProfile: true } },
    },
  });

  const creators = await prisma.creatorProfile.findMany({
    take: 30,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { status: true, email: true } } },
  });

  const favoriteCreatorIds = ownsCampaigns
    ? new Set((await prisma.creatorFavorite.findMany({
        where: { userId },
        select: { creatorId: true },
      })).map((favorite) => favorite.creatorId))
    : new Set<string>();

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const appliedCampaignIds = new Set(applications.map((application) => application.campaignId));
  const availableCampaigns = ownsCampaigns
    ? []
    : await prisma.campaign.findMany({
        where: {
          status: "ACTIVE",
          brandId: { not: userId },
          id: { notIn: Array.from(appliedCampaignIds) },
        },
        orderBy: { createdAt: "desc" },
        take: 30,
        include: { applications: true },
      });

  return {
    user: buildUser(user),
    campaigns: campaigns.map(buildCampaign),
    availableCampaigns: availableCampaigns.map(buildCampaign),
    rawCampaigns: campaigns,
    applications: buildApplications(applications),
    conversations: buildConversations(userId, applications, directMessages),
    notifications: buildNotifications(notifications),
    payments: escrows.map((escrow) => ({
      id: escrow.id,
      creator: escrow.contract.application.creator.creatorProfile?.displayName || "Creator",
      campaign: escrow.contract.application.campaign.title,
      amount: money(escrow.amount),
      status: escrow.status.toLowerCase(),
      date: dateLabel(escrow.createdAt),
      color: "bg-[#a3e4c7] text-[#4c7569]",
    })),
    creators: creators.map((creator) => ({
      id: creator.userId,
      name: creator.displayName,
      niche: creator.niche,
      followers: creator.followerRange,
      engagement: creator.engagementRate != null ? `${creator.engagementRate}%` : "Not provided",
      location: [creator.city, creator.state, creator.country].filter(Boolean).join(", "),
      verified: creator.user.status === "VERIFIED",
      avatarUrl: creator.avatarUrl || "",
      liked: favoriteCreatorIds.has(creator.userId),
      avatarColor: "bg-[#a3e4c7] text-[#4c7569]",
    })),
    events: campaigns.filter((campaign) => user.role === "ORGANISER").map(buildCampaign),
    analytics: buildAnalytics(campaigns, applications, escrows, creatorCount),
  };
}

export async function addDashboardMessage(userId: string, applicationId: string, body: string) {
  const directUserId = directUserIdFromConversation(applicationId);
  if (directUserId) return addDirectDashboardMessage(userId, directUserId, body);

  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      OR: [{ creatorId: userId }, { campaign: { brandId: userId } }],
    },
    include: { campaign: true },
  });
  if (!application) throw new Error("Conversation not found");
  const recipientId = application.creatorId === userId ? application.campaign.brandId : application.creatorId;
  await prisma.$transaction(async (tx) => {
    await tx.message.create({ data: { applicationId, senderId: userId, body } });
    if (recipientId !== userId) {
      await tx.notification.create({
        data: {
          userId: recipientId,
          type: "message_received",
          title: "New message",
          body: `You received a message about ${application.campaign.title}.`,
        },
      });
    }
  });
  const reloaded = await prisma.application.findMany({
    where: {
      id: applicationId,
      OR: [{ creatorId: userId }, { campaign: { brandId: userId } }],
    },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      campaign: { include: { brand: { include: { brandProfile: true, organiserProfile: true } } } },
      creator: { include: { creatorProfile: true } },
    },
  });
  return buildConversations(userId, reloaded)[0];
}

export async function markDashboardConversationRead(userId: string, applicationId: string) {
  const directUserId = directUserIdFromConversation(applicationId);
  if (directUserId) return markDirectConversationRead(userId, directUserId);

  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      OR: [{ creatorId: userId }, { campaign: { brandId: userId } }],
    },
  });
  if (!application) throw new Error("Conversation not found");

  await prisma.message.updateMany({
    where: {
      applicationId,
      senderId: { not: userId },
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  const reloaded = await prisma.application.findMany({
    where: {
      id: applicationId,
      OR: [{ creatorId: userId }, { campaign: { brandId: userId } }],
    },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      campaign: { include: { brand: { include: { brandProfile: true, organiserProfile: true } } } },
      creator: { include: { creatorProfile: true } },
    },
  });
  return buildConversations(userId, reloaded)[0];
}

async function getDirectMessagesBetween(userId: string, otherUserId: string) {
  return prisma.message.findMany({
    where: {
      applicationId: null,
      OR: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId },
      ],
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { include: { creatorProfile: true, brandProfile: true, organiserProfile: true } },
      recipient: { include: { creatorProfile: true, brandProfile: true, organiserProfile: true } },
    },
  });
}

async function getDirectConversationTarget(userId: string, otherUserId: string) {
  if (userId === otherUserId) throw new Error("Cannot message yourself");
  const [requester, otherUser, existingMessages] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { creatorProfile: true, brandProfile: true, organiserProfile: true },
    }),
    prisma.user.findUnique({
      where: { id: otherUserId },
      include: { creatorProfile: true, brandProfile: true, organiserProfile: true },
    }),
    getDirectMessagesBetween(userId, otherUserId),
  ]);
  if (!requester || !otherUser) throw new Error("User not found");

  const creatorInThread = requester.role === "CREATOR" || otherUser.role === "CREATOR";
  if (!creatorInThread && existingMessages.length === 0) {
    throw new Error("Direct messages can only be started with creators");
  }

  return { otherUser, existingMessages };
}

export async function getDirectDashboardConversation(userId: string, creatorId: string) {
  const { otherUser, existingMessages } = await getDirectConversationTarget(userId, creatorId);
  if (otherUser.role !== "CREATOR" && existingMessages.length === 0) {
    throw new Error("Creator not found");
  }
  return buildDirectConversationForUser(userId, otherUser, existingMessages);
}

export async function addDirectDashboardMessage(userId: string, otherUserId: string, body: string) {
  const { otherUser } = await getDirectConversationTarget(userId, otherUserId);
  await prisma.$transaction(async (tx) => {
    await tx.message.create({
      data: {
        senderId: userId,
        recipientId: otherUserId,
        body,
      },
    });
    await tx.notification.create({
      data: {
        userId: otherUserId,
        type: "message_received",
        title: "New message",
        body: `You received a message from ${displayNameForUser(await tx.user.findUnique({
          where: { id: userId },
          include: { creatorProfile: true, brandProfile: true, organiserProfile: true },
        }))}.`,
      },
    });
  });
  const messages = await getDirectMessagesBetween(userId, otherUserId);
  return buildDirectConversationForUser(userId, otherUser, messages);
}

export async function markDirectConversationRead(userId: string, otherUserId: string) {
  const { otherUser } = await getDirectConversationTarget(userId, otherUserId);
  await prisma.message.updateMany({
    where: {
      applicationId: null,
      senderId: otherUserId,
      recipientId: userId,
      readAt: null,
    },
    data: { readAt: new Date() },
  });
  const messages = await getDirectMessagesBetween(userId, otherUserId);
  return buildDirectConversationForUser(userId, otherUser, messages);
}

export async function setCreatorFavorite(userId: string, creatorId: string, liked: boolean) {
  if (userId === creatorId) throw new Error("Cannot favorite yourself");
  const creator = await prisma.user.findFirst({
    where: { id: creatorId, role: "CREATOR", creatorProfile: { isNot: null } },
    select: { id: true },
  });
  if (!creator) throw new Error("Creator not found");

  if (liked) {
    await prisma.creatorFavorite.upsert({
      where: { userId_creatorId: { userId, creatorId } },
      create: { userId, creatorId },
      update: {},
    });
  } else {
    await prisma.creatorFavorite.deleteMany({ where: { userId, creatorId } });
  }

  return { creatorId, liked };
}

export async function createDashboardCampaign(userId: string, input: any) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Campaign owner not found");

  const campaign = await prisma.campaign.create({
    data: {
      brandId: userId,
      title: input.title,
      description: input.description,
      category: input.category,
      budgetMin: Number(input.budgetMin),
      budgetMax: Number(input.budgetMax),
      totalSlots: Number(input.totalSlots),
      location: input.location,
      platforms: input.platforms,
      deliverables: input.deliverables,
      deadline: new Date(input.deadline),
      status: input.status === "active" ? "ACTIVE" : "DRAFT",
    },
    include: { applications: true },
  });
  return buildCampaign(campaign);
}

export async function updateDashboardCampaign(userId: string, campaignId: string, input: any) {
  const data: Record<string, unknown> = {};
  if (input.status && UI_TO_STATUS[input.status]) data.status = UI_TO_STATUS[input.status];
  await prisma.campaign.updateMany({
    where: { id: campaignId, brandId: userId },
    data,
  });
  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, brandId: userId },
    include: { applications: true },
  });
  if (!campaign) throw new Error("Campaign not found");
  return buildCampaign(campaign);
}

export async function deleteDashboardCampaign(userId: string, campaignId: string) {
  await prisma.campaign.deleteMany({ where: { id: campaignId, brandId: userId } });
}

export async function updateDashboardApplication(userId: string, applicationId: string, status: string) {
  const appStatus = UI_TO_APP_STATUS[status];
  if (!appStatus) throw new Error("Invalid application status");

  const existing = await prisma.application.findFirst({
    where: { id: applicationId, campaign: { brandId: userId } },
    include: { campaign: true },
  });
  if (!existing) throw new Error("Application not found");

  if (appStatus === "ACCEPTED" && existing.status !== "ACCEPTED") {
    const acceptedCount = await prisma.application.count({
      where: { campaignId: existing.campaignId, status: "ACCEPTED" },
    });
    if (acceptedCount >= existing.campaign.totalSlots) throw new Error("No slots left");
  }

  await prisma.$transaction(async (tx) => {
    await tx.application.update({
      where: { id: applicationId },
      data: { status: appStatus },
    });

    const acceptedCount = await tx.application.count({
      where: { campaignId: existing.campaignId, status: "ACCEPTED" },
    });
    await tx.campaign.update({
      where: { id: existing.campaignId },
      data: { filledSlots: Math.min(acceptedCount, existing.campaign.totalSlots) },
    });

    if (existing.status !== appStatus) {
      await tx.notification.create({
        data: {
          userId: existing.creatorId,
          type: `application_${status}`,
          title: `Application ${status}`,
          body: `Your application for ${existing.campaign.title} was ${status}.`,
        },
      });
    }
  });

  const application = await prisma.application.findFirst({
    where: { id: applicationId, campaign: { brandId: userId } },
    include: { campaign: true, creator: { include: { creatorProfile: true } } },
  });
  if (!application) throw new Error("Application not found");
  return buildApplications([application])[0];
}
