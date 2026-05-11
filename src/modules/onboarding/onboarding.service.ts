import { prisma } from "../../db/client.js";
import type { Prisma } from "@prisma/client";

export type OnboardingRole = "creator" | "brand" | "event";

export type OnboardingCompleteInput = {
  userId?: unknown;
  sessionId?: unknown;
  role: OnboardingRole;
  data: {
    step1?: unknown;
    step2?: unknown;
    step3?: unknown;
    step4?: unknown;
    step5?: unknown;
  };
};

export type OnboardingErrorCode =
  | "ONBOARDING_INVALID_INPUT"
  | "ONBOARDING_INCOMPLETE"
  | "ONBOARDING_DB_ERROR"
  | "ONBOARDING_SERVER_ERROR";

export class OnboardingServiceError extends Error {
  public readonly code: OnboardingErrorCode;
  constructor(code: OnboardingErrorCode) {
    super(code);
    this.code = code;
  }
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isRole(v: unknown): v is OnboardingRole {
  if (typeof v !== "string") return false;
  const s = v.toLowerCase();
  return s === "creator" || s === "brand" || s === "event";
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isMeaningfulString(v: unknown): v is string {
  return isNonEmptyString(v) && v.trim().toLowerCase() !== "pending";
}

function getObj(v: unknown): Record<string, unknown> | undefined {
  return isPlainObject(v) ? v : undefined;
}

function pickFirstString(objs: Array<Record<string, unknown> | undefined>, keys: string[]): string | undefined {
  for (const obj of objs) {
    if (!obj) continue;
    for (const key of keys) {
      const v = obj[key];
      if (isMeaningfulString(v)) return v.trim();
    }
  }
  return undefined;
}

function pickFirstNumber(objs: Array<Record<string, unknown> | undefined>, keys: string[]): number | undefined {
  for (const obj of objs) {
    if (!obj) continue;
    for (const key of keys) {
      const v = obj[key];
      if (typeof v === "number" && Number.isFinite(v)) return v;
      if (isNonEmptyString(v)) {
        const n = Number(v);
        if (Number.isFinite(n)) return n;
      }
    }
  }
  return undefined;
}

function getArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String).filter((item) => item.trim().length > 0) : [];
}

function fallbackFromEmail(email: string | undefined, fallback: string): string {
  const localPart = email?.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  return localPart || fallback;
}

function pickAgreements(step: Record<string, unknown> | undefined): Prisma.InputJsonObject | undefined {
  const agreements = getObj(step?.agreements);
  return agreements ? (agreements as Prisma.InputJsonObject) : undefined;
}

function prismaRole(role: OnboardingRole): "CREATOR" | "BRAND" | "ORGANISER" {
  return role === "creator" ? "CREATOR" : role === "brand" ? "BRAND" : "ORGANISER";
}

function requiredStepsFor(role: OnboardingRole): string[] {
  return role === "brand" ? ["step2", "step3", "step4", "step5"] : ["step1", "step2", "step3", "step4"];
}

function mergeStepData(existing: unknown, stepKey: string, stepData: unknown): Record<string, unknown> {
  const base = getObj(existing) || {};
  return {
    ...base,
    [stepKey]: getObj(stepData) || {},
  };
}

function mergeOnboardingData(savedData: unknown, incomingData: unknown): Record<string, unknown> {
  return {
    ...(getObj(savedData) || {}),
    ...(getObj(incomingData) || {}),
  };
}

function getEmailFromData(role: OnboardingRole, data: Record<string, unknown>, sessionId?: string): string {
  const step1 = getObj(data.step1);
  const step2 = getObj(data.step2);
  const step3 = getObj(data.step3);
  const step4 = getObj(data.step4);
  const step5 = getObj(data.step5);
  const email = pickFirstString([step1, step2, step3, step4, step5], ["email", "workEmail"]);
  if (email) return email.toLowerCase();
  if (sessionId) return `${role}-${sessionId}@onboarding.local`.toLowerCase();
  return `${role}-${Date.now()}@onboarding.local`;
}

async function resolveOnboardingUser(
  role: OnboardingRole,
  data: Record<string, unknown>,
  userId?: string | null,
  sessionId?: string,
) {
  if (userId) {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (existing) return existing;
  }

  if (sessionId) {
    const progress = await prisma.onboardingProgress.findUnique({
      where: { sessionId },
      include: { user: true },
    });
    if (progress?.user) return progress.user;
  }

  const email = getEmailFromData(role, data, sessionId);
  return prisma.user.upsert({
    where: { email },
    create: {
      email,
      passwordHash: "onboarding-placeholder",
      role: prismaRole(role),
    },
    update: {
      role: prismaRole(role),
    },
  });
}

async function saveProgress(
  sessionId: string | undefined,
  userId: string,
  role: OnboardingRole,
  data: Record<string, unknown>,
  lastCompletedStep?: string,
  completed = false,
) {
  if (!sessionId) return;
  await prisma.onboardingProgress.upsert({
    where: { sessionId },
    create: {
      sessionId,
      user: { connect: { id: userId } },
      role: prismaRole(role),
      data: data as Prisma.InputJsonObject,
      lastCompletedStep,
      completed,
    },
    update: {
      user: { connect: { id: userId } },
      role: prismaRole(role),
      data: data as Prisma.InputJsonObject,
      lastCompletedStep,
      completed,
    },
  });
}

async function verifyCompletedOnboarding(userId: string, role: OnboardingRole, data: Record<string, unknown>) {
  const missingSteps = requiredStepsFor(role).filter((step) => !getObj(data[step]));
  if (missingSteps.length > 0) {
    throw new OnboardingServiceError("ONBOARDING_INCOMPLETE");
  }

  if (role === "creator") {
    const profile = await prisma.creatorProfile.findUnique({ where: { userId } });
    if (!profile?.displayName || !profile?.niche || !profile?.socialHandle || !profile?.agreements) {
      throw new OnboardingServiceError("ONBOARDING_INCOMPLETE");
    }
    return;
  }

  if (role === "brand") {
    const profile = await prisma.brandProfile.findUnique({ where: { userId } });
    if (!profile?.companyName || !profile?.founderName || !profile?.industry || !profile?.agreements) {
      throw new OnboardingServiceError("ONBOARDING_INCOMPLETE");
    }
    return;
  }

  const profile = await prisma.organiserProfile.findUnique({ where: { userId } });
  if (!profile?.orgName || !profile?.contactName || !profile?.state || !profile?.agreements) {
    throw new OnboardingServiceError("ONBOARDING_INCOMPLETE");
  }
}

export async function completeOnboardingDb(userId: string, role: OnboardingRole, data: Record<string, unknown>): Promise<{ saved: true, user?: any }> {
  const step1 = getObj(data.step1);
  const step2 = getObj(data.step2);
  const step3 = getObj(data.step3);
  const step4 = getObj(data.step4);
  const step5 = getObj(data.step5);

  try {
    const userRec = await prisma.user.findUnique({ where: { id: userId } });
    const userEmail = userRec?.email;

    if (role === "creator") {
      const displayName = pickFirstString([step1, step4], ["displayName", "fullName", "name", "username"]) || fallbackFromEmail(userEmail, "Creator");
      const username = pickFirstString([step1], ["username"]);
      const niche = pickFirstString([step3, step1], ["niche", "primaryNiche", "category"]) || "Not provided";
      const state = pickFirstString([step1, step4], ["state", "region", "locationState"]) || "Not provided";
      const socialHandle = pickFirstString([step2, step1], ["youtube", "linkedin", "socialHandle", "instagram", "instagramHandle", "handle", "igHandle"]) || "Not provided";
      const followerRange = pickFirstString([step2, step3, step1], ["followerRange", "followers", "audienceSize"]) || "Not provided";
      const engagementRate = pickFirstNumber([step2, step3], ["engagementRate", "engRate"]);

      const country = pickFirstString([step1], ["country"]);
      const city = pickFirstString([step1], ["city"]);
      const phone = pickFirstString([step1], ["phone"]);

      const youtube = pickFirstString([step2], ["youtube"]);
      const linkedin = pickFirstString([step2], ["linkedin"]);
      const website = pickFirstString([step2], ["website"]);
      const genderDist = pickFirstNumber([step2], ["genderDist"]);
      const selectedAge = pickFirstString([step2], ["selectedAge"]);

      const categories = getArray(step3?.selectedCategories);
      
      const prefs = getObj(step3?.preferences) || {};
      const openToBarter = Boolean(prefs.barter);
      const openToLongTerm = Boolean(prefs.longTerm);
      const openToTravel = Boolean(prefs.travel);
      
      const rateReel = pickFirstString([step3], ["rateReel"]);
      const rateStory = pickFirstString([step3], ["rateStory"]);
      const rateEvent = pickFirstString([step3], ["rateEvent"]);
      const agreements = pickAgreements(step4);

      const updatedProfile = await prisma.creatorProfile.upsert({
        where: { userId },
        create: {
          user: { connect: { id: userId } },
          displayName,
          username,
          niche,
          state,
          socialHandle,
          followerRange,
          engagementRate: engagementRate ?? null,
          country, city, phone,
          youtube, linkedin, website, genderDist, selectedAge,
          categories, openToBarter, openToLongTerm, openToTravel,
          rateReel, rateStory, rateEvent,
          agreements,
        },
        update: {
          displayName,
          username,
          niche,
          state,
          socialHandle,
          followerRange,
          engagementRate: engagementRate ?? undefined,
          country, city, phone,
          youtube, linkedin, website, genderDist, selectedAge,
          categories, openToBarter, openToLongTerm, openToTravel,
          rateReel, rateStory, rateEvent,
          agreements,
        },
      });

      return { 
        saved: true, 
        user: {
          id: userId,
          role: "creator",
          name: displayName,
          email: userRec?.email,
          createdAt: updatedProfile.createdAt
        } 
      };
    }

    if (role === "brand") {
      const companyName = pickFirstString([step1, step2, step4, step5], ["companyName", "brandName", "orgName", "name"]) || fallbackFromEmail(userEmail, "Brand");
      const founderName = pickFirstString([step4, step1, step2, step5], ["founderName", "contactName", "fullName", "name"]) || companyName;
      const industry = pickFirstString([step2, step3, step1], ["industry", "category", "niche"]) || "Not provided";
      const phone = pickFirstString([step4, step1, step2, step5], ["phone", "phoneNumber", "mobile"]) || "Not provided";

      const website = pickFirstString([step2], ["website"]);
      const companySize = pickFirstString([step2], ["companySize"]);
      const location = pickFirstString([step2], ["location"]);
      
      const targetTypes = getArray(step3?.selectedTypes);
      const primaryObjective = pickFirstString([step3], ["selectedObjective"]);
      const targetAudiences = getArray(step3?.selectedAudience);
      const audienceOther = pickFirstString([step3], ["audienceOtherText"]);
      const primaryAgeGroup = pickFirstString([step3], ["selectedAgeGroup"]);
      const nicheInterests = pickFirstString([step3], ["selectedInterest"]);

      const jobTitle = pickFirstString([step4], ["jobTitle"]);
      const workEmail = pickFirstString([step4], ["workEmail"]);
      const phoneCode = pickFirstString([step4], ["phoneCode"]);
      const linkedin = pickFirstString([step4], ["linkedin"]);
      const logo = pickFirstString([step2], ["logo"]);
      const agreements = pickAgreements(step5);

      const updatedProfile = await prisma.brandProfile.upsert({
        where: { userId },
        create: {
          user: { connect: { id: userId } },
          companyName,
          founderName,
          industry,
          phone,
          avatarUrl: logo,
          website,
          companySize,
          location,
          targetTypes,
          primaryObjective,
          targetAudiences,
          audienceOther,
          primaryAgeGroup,
          nicheInterests,
          jobTitle,
          workEmail,
          phoneCode,
          linkedin,
          agreements,
        },
        update: {
          companyName,
          founderName,
          industry,
          phone,
          avatarUrl: logo,
          website,
          companySize,
          location,
          targetTypes,
          primaryObjective,
          targetAudiences,
          audienceOther,
          primaryAgeGroup,
          nicheInterests,
          jobTitle,
          workEmail,
          phoneCode,
          linkedin,
          agreements,
        },
      });

      return { 
        saved: true, 
        user: {
          id: userId,
          role: "brand",
          name: founderName,
          companyName: companyName,
          avatarUrl: updatedProfile.avatarUrl,
          email: userRec?.email,
          createdAt: updatedProfile.createdAt
        } 
      };
    }

    // role === "event"
    const orgName = pickFirstString([step1, step2, step3, step4], ["orgName", "company", "companyName", "organization", "organisation"]) || fallbackFromEmail(userEmail, "Event Organizer");
    const contactName = pickFirstString([step3, step1, step4], ["contactName", "fullName", "name"]) || orgName;
    const state = pickFirstString([step1, step4], ["state", "region", "locationState"]) || "Not provided";
    const phone = pickFirstString([step1, step2, step3, step4], ["phone", "phoneNumber", "mobile"]) || "Not provided";
    const phoneCode = pickFirstString([step1, step2, step3, step4], ["phoneCode"]);
    const phoneCountry = pickFirstString([step1, step2, step3, step4], ["phoneCountry"]);

    const country = pickFirstString([step1], ["country"]);
    const city = pickFirstString([step1], ["city"]);
    const eventType = pickFirstString([step1], ["eventType"]);
    const selectedReqs = getArray(step2?.selectedReqs);
    const selectedGoal = pickFirstString([step2], ["selectedGoal"]);
    const footfall = pickFirstString([step2], ["footfall"]);
    const budget = pickFirstString([step2], ["budget"]);
    const jobTitle = pickFirstString([step3], ["jobTitle"]);
    const workEmail = pickFirstString([step3], ["workEmail"]);
    const website = pickFirstString([step3], ["website"]);
    const instagram = pickFirstString([step3], ["instagram", "instagramHandle"]);
    const agreements = pickAgreements(step4);

    const updatedProfile = await prisma.organiserProfile.upsert({
      where: { userId },
      create: {
        user: { connect: { id: userId } },
        orgName,
        contactName,
        state,
        phone,
        phoneCode,
        phoneCountry,
        country,
        city,
        eventType,
        selectedReqs,
        selectedGoal,
        footfall,
        budget,
        jobTitle,
        workEmail,
        website,
        instagram,
        agreements,
      },
      update: {
        orgName,
        contactName,
        state,
        phone,
        phoneCode,
        phoneCountry,
        country,
        city,
        eventType,
        selectedReqs,
        selectedGoal,
        footfall,
        budget,
        jobTitle,
        workEmail,
        website,
        instagram,
        agreements,
      },
    });

    return { 
      saved: true, 
      user: {
        id: userId,
        role: "event",
        name: contactName,
        companyName: orgName,
        email: userRec?.email,
        createdAt: updatedProfile.createdAt
      } 
    };
  } catch (err) {
    if (err instanceof OnboardingServiceError) throw err;
    throw new OnboardingServiceError("ONBOARDING_DB_ERROR");
  }
}

export async function saveOnboardingStep(input: any): Promise<{ saved: true; user?: any; data: Record<string, unknown> }> {
  if (!isPlainObject(input)) throw new OnboardingServiceError("ONBOARDING_INVALID_INPUT");
  if (!isRole(input.role)) throw new OnboardingServiceError("ONBOARDING_INVALID_INPUT");
  if (!isNonEmptyString(input.step)) throw new OnboardingServiceError("ONBOARDING_INVALID_INPUT");

  const normalizedRole = (input.role as string).toLowerCase() as OnboardingRole;
  const step = input.step.trim();
  if (!requiredStepsFor(normalizedRole).includes(step)) throw new OnboardingServiceError("ONBOARDING_INVALID_INPUT");

  const sessionId = isNonEmptyString(input.sessionId) ? input.sessionId.trim() : undefined;
  const incomingStepData = getObj(input.data) || {};
  let savedData: unknown;

  if (sessionId) {
    const existing = await prisma.onboardingProgress.findUnique({ where: { sessionId } });
    savedData = existing?.data;
  }

  const mergedData = mergeStepData(savedData, step, incomingStepData);
  const user = await resolveOnboardingUser(
    normalizedRole,
    mergedData,
    typeof input.userId === "string" ? input.userId.trim() : null,
    sessionId,
  );

  await saveProgress(sessionId, user.id, normalizedRole, mergedData, step, false);
  const result = await completeOnboardingDb(user.id, normalizedRole, mergedData);

  return {
    saved: true,
    user: result.user,
    data: mergedData,
  };
}

export async function completeOnboardingFromRequest(input: any): Promise<{ saved: true, user?: any }> {
  if (!isPlainObject(input)) throw new OnboardingServiceError("ONBOARDING_INVALID_INPUT");
  if (!isRole(input.role)) throw new OnboardingServiceError("ONBOARDING_INVALID_INPUT");

  let userId = typeof input.userId === "string" ? input.userId.trim() : null;
  const sessionId = isNonEmptyString(input.sessionId) ? input.sessionId.trim() : undefined;
  const normalizedRole = (input.role as string).toLowerCase() as OnboardingRole;
  const data = isPlainObject(input.data) ? input.data : {};
  const progress = sessionId ? await prisma.onboardingProgress.findUnique({ where: { sessionId } }) : null;
  const mergedData = mergeOnboardingData(progress?.data, data);
  const step1 = getObj(data.step1);
  const step2 = getObj(data.step2);
  const step3 = getObj(data.step3);
  const step4 = getObj(data.step4);
  const step5 = getObj(data.step5);

  const user = await resolveOnboardingUser(normalizedRole, mergedData, userId, sessionId);
  userId = user.id;

  const result = await completeOnboardingDb(userId, normalizedRole, mergedData);
  await verifyCompletedOnboarding(userId, normalizedRole, mergedData);
  await saveProgress(sessionId, userId, normalizedRole, mergedData, requiredStepsFor(normalizedRole).at(-1), true);
  return result;
}

// Used by routes (do not change routes).
export async function completeOnboarding(input: unknown): Promise<{ saved: true, user?: any }> {
  return completeOnboardingFromRequest(input);
}

