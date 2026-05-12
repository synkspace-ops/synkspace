import { z } from "zod";

const avatarUrlSchema = z.string()
  .max(1_000_000, "Profile picture is too large. Please upload a smaller image.")
  .refine((value) => {
    if (!value) return true;
    return value.startsWith("data:image/") || /^https?:\/\//i.test(value);
  }, "Profile picture must be an image upload or image URL.");

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(200).optional(),
  bio: z.string().max(2000).optional().nullable(),
  niche: z.string().max(200).optional(),
  state: z.string().max(100).optional(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  phone: z.string().max(32).optional().nullable(),
  socialHandle: z.string().max(200).optional(),
  youtube: z.string().max(300).optional().nullable(),
  linkedin: z.string().max(300).optional().nullable(),
  website: z.string().max(300).optional().nullable(),
  followerRange: z.enum(["1k-10k", "10k-50k", "50k-200k", "200k-1m", "1m+"]).optional(),
  engagementRate: z.number().min(0).max(100).optional().nullable(),
  rateReel: z.string().max(100).optional().nullable(),
  rateStory: z.string().max(100).optional().nullable(),
  rateEvent: z.string().max(100).optional().nullable(),
  avatarUrl: avatarUrlSchema.optional().nullable(),
  companyName: z.string().max(200).optional(),
  founderName: z.string().max(200).optional(),
  industry: z.string().max(200).optional(),
  orgName: z.string().max(200).optional(),
  contactName: z.string().max(200).optional(),
}).strict();

export const avatarSchema = z.object({
  key: z.string().min(1),
  contentType: z.string().min(1),
});

export const kycSchema = z.object({
  docKey: z.string().min(1),
  docType: z.enum(["AADHAAR", "PAN"]),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
