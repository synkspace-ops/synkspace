import { prisma } from "../../db/client.js";
import type { AppStatus } from "@prisma/client";
import type { ApplyInput, UpdateStatusInput } from "./applications.schemas.js";

export async function apply(
  campaignId: string,
  creatorId: string,
  input: ApplyInput
) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  });
  if (!campaign) throw new Error("Campaign not found");
  if (campaign.status !== "ACTIVE") throw new Error("Campaign is not open for applications");
  if (campaign.filledSlots >= campaign.totalSlots) throw new Error("No slots left");

  const existing = await prisma.application.findUnique({
    where: {
      campaignId_creatorId: { campaignId, creatorId },
    },
  });
  if (existing) throw new Error("Already applied");

  const application = await prisma.$transaction(async (tx) => {
    const app = await tx.application.create({
      data: {
        campaignId,
        creatorId,
        proposedRate: input.proposedRate,
        message: input.message ?? null,
        status: "APPLIED",
      },
    });

    if (input.message?.trim()) {
      await tx.message.create({
        data: {
          applicationId: app.id,
          senderId: creatorId,
          body: input.message.trim(),
        },
      });
    }

    const brand = await tx.campaign.findUnique({
      where: { id: campaignId },
      select: { brandId: true },
    });
    if (brand) {
      await tx.notification.create({
        data: {
          userId: brand.brandId,
          type: "application_received",
          title: "New application",
          body: "A creator applied to your campaign.",
        },
      });
    }
    return app;
  });

  return application;
}

export async function listByCampaign(campaignId: string, brandId: string) {
  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, brandId },
  });
  if (!campaign) throw new Error("Campaign not found");
  return prisma.application.findMany({
    where: { campaignId },
    include: {
      creator: {
        select: {
          id: true,
          creatorProfile: true,
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  });
}

export async function updateStatus(
  campaignId: string,
  appId: string,
  brandId: string,
  input: UpdateStatusInput
) {
  const app = await prisma.application.findFirst({
    where: { id: appId, campaignId },
    include: { campaign: true },
  });
  if (!app || app.campaign.brandId !== brandId) throw new Error("Application not found");

  const status = input.status as AppStatus;
  if (status === "ACCEPTED" && app.status !== "ACCEPTED") {
    const acceptedCount = await prisma.application.count({
      where: { campaignId, status: "ACCEPTED" },
    });
    if (acceptedCount >= app.campaign.totalSlots) throw new Error("No slots left");
  }

  const notifType =
    status === "SHORTLISTED"
      ? "shortlisted"
      : status === "ACCEPTED"
        ? "accepted"
        : "rejected";
  await prisma.$transaction(async (tx) => {
    await tx.application.update({
      where: { id: appId },
      data: { status },
    });

    const acceptedCount = await tx.application.count({
      where: { campaignId, status: "ACCEPTED" },
    });
    await tx.campaign.update({
      where: { id: campaignId },
      data: { filledSlots: Math.min(acceptedCount, app.campaign.totalSlots) },
    });

    if (app.status !== status) {
      await tx.notification.create({
        data: {
          userId: app.creatorId,
          type: notifType,
          title: `Application ${status.toLowerCase()}`,
          body: `Your application for ${app.campaign.title} was ${status.toLowerCase()}.`,
        },
      });
    }
  });

  return prisma.application.findUnique({
    where: { id: appId },
    include: { creator: { select: { creatorProfile: true } } },
  });
}

export async function getMyApplication(campaignId: string, creatorId: string) {
  return prisma.application.findUnique({
    where: {
      campaignId_creatorId: { campaignId, creatorId },
    },
    include: { campaign: { select: { title: true, status: true } } },
  });
}

export async function listMyApplications(creatorId: string) {
  return prisma.application.findMany({
    where: { creatorId },
    include: {
      campaign: {
        select: {
          id: true,
          title: true,
          status: true,
          brand: { select: { brandProfile: true } },
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  });
}
