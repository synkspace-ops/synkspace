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

function buildConversations(userId: string, applications: any[]) {
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
      sender: message.senderId === userId ? "You" : otherName,
      text: message.body,
      time: dateLabel(message.createdAt),
      isMine: message.senderId === userId,
    }));
    return {
      id: app.id,
      name: otherName,
      time: messages.at(-1)?.time || dateLabel(app.appliedAt),
      unread: (app.messages || []).filter((message: any) => message.senderId !== userId && !message.readAt).length,
      online: false,
      color: "bg-[#a3e4c7] text-[#4c7569]",
      messages,
    };
  });
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

  const creators = await prisma.creatorProfile.findMany({
    take: 30,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { status: true, email: true } } },
  });

  return {
    user: buildUser(user),
    campaigns: campaigns.map(buildCampaign),
    rawCampaigns: campaigns,
    applications: buildApplications(applications),
    conversations: buildConversations(userId, applications),
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
      avatarColor: "bg-[#a3e4c7] text-[#4c7569]",
    })),
    events: campaigns.filter((campaign) => user.role === "ORGANISER").map(buildCampaign),
    analytics: buildAnalytics(campaigns, applications, escrows, creatorCount),
  };
}

export async function addDashboardMessage(userId: string, applicationId: string, body: string) {
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      OR: [{ creatorId: userId }, { campaign: { brandId: userId } }],
    },
  });
  if (!application) throw new Error("Conversation not found");
  await prisma.message.create({ data: { applicationId, senderId: userId, body } });
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
  await prisma.application.updateMany({
    where: { id: applicationId, campaign: { brandId: userId } },
    data: { status: appStatus },
  });
  const application = await prisma.application.findFirst({
    where: { id: applicationId, campaign: { brandId: userId } },
    include: { campaign: true, creator: { include: { creatorProfile: true } } },
  });
  if (!application) throw new Error("Application not found");
  return buildApplications([application])[0];
}
