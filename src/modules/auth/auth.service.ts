import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/client.js";
import { getEnv } from "../../config/env.js";

export type AuthErrorCode =
  | "AUTH_INVALID_INPUT"
  | "AUTH_USER_EXISTS"
  | "AUTH_USER_NOT_FOUND"
  | "AUTH_INVALID_CREDENTIALS"
  | "AUTH_SERVER_ERROR";

export class AuthServiceError extends Error {
  public readonly code: AuthErrorCode;
  constructor(code: AuthErrorCode) {
    super(code);
    this.code = code;
  }
}

export type RegisterUserInput = {
  role: string;
  email: string;
  password: string;
};

export type LoginUserInput = {
  email: string;
  password: string;
};

const PASSWORD_SALT_BYTES = 16;
const PBKDF2_ITERS = 200_000;
const PBKDF2_KEYLEN = 32;
const PBKDF2_DIGEST = "sha256";
const ACCESS_EXPIRES_IN_SEC = 60 * 60 * 8;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function normalizeRole(role: string) {
  const value = role.trim().toUpperCase();
  if (value === "EVENT" || value === "EVENT_ORGANISER" || value === "ORGANIZER") return "ORGANISER";
  if (["CREATOR", "BRAND", "ORGANISER", "ADMIN"].includes(value)) return value;
  throw new AuthServiceError("AUTH_INVALID_INPUT");
}

function derivePassword(password: string, saltHex: string): string {
  const salt = Buffer.from(saltHex, "hex");
  return crypto.pbkdf2Sync(password, salt, PBKDF2_ITERS, PBKDF2_KEYLEN, PBKDF2_DIGEST).toString("hex");
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(PASSWORD_SALT_BYTES).toString("hex");
  const hash = derivePassword(password, salt);
  return `pbkdf2:${PBKDF2_ITERS}:${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const [, iterRaw, salt, hash] = parts;
  const iterations = Number(iterRaw);
  if (!Number.isFinite(iterations) || iterations !== PBKDF2_ITERS) return false;
  const attempted = derivePassword(password, salt);
  const a = Buffer.from(attempted, "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function signAccessToken(user: { id: string; email: string; role: string }) {
  const env = getEnv();
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    env.JWT_REFRESH_SECRET,
    { algorithm: "HS256", expiresIn: ACCESS_EXPIRES_IN_SEC }
  );
}

export function verifyAccessToken(token: string): { id: string; email: string; role: string } {
  if (!isNonEmptyString(token)) throw new AuthServiceError("AUTH_INVALID_CREDENTIALS");
  try {
    const decoded = jwt.verify(token, getEnv().JWT_REFRESH_SECRET, { algorithms: ["HS256"] }) as jwt.JwtPayload;
    if (!decoded.sub || typeof decoded.email !== "string" || typeof decoded.role !== "string") {
      throw new AuthServiceError("AUTH_INVALID_CREDENTIALS");
    }
    return { id: String(decoded.sub), email: decoded.email, role: decoded.role };
  } catch (err) {
    if (err instanceof AuthServiceError) throw err;
    throw new AuthServiceError("AUTH_INVALID_CREDENTIALS");
  }
}

export async function registerUser(input: RegisterUserInput): Promise<{ user: { id: string; role: string; email: string } }> {
  if (!isNonEmptyString(input?.role) || !isNonEmptyString(input?.email) || !isNonEmptyString(input?.password)) {
    throw new AuthServiceError("AUTH_INVALID_INPUT");
  }

  const email = normalizeEmail(input.email);
  if (!email.includes("@") || input.password.length < 8) throw new AuthServiceError("AUTH_INVALID_INPUT");

  const role = normalizeRole(input.role) as any;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.passwordHash !== "onboarding-placeholder") {
    throw new AuthServiceError("AUTH_USER_EXISTS");
  }

  const user = existing
    ? await prisma.user.update({
        where: { email },
        data: { role, passwordHash: hashPassword(input.password) },
        select: { id: true, role: true, email: true },
      })
    : await prisma.user.create({
        data: { email, role, passwordHash: hashPassword(input.password) },
        select: { id: true, role: true, email: true },
      });

  return { user };
}

export async function loginUser(input: LoginUserInput): Promise<{ accessToken: string; expiresIn: number; user: { id: string; role: string; email: string } }> {
  if (!isNonEmptyString(input?.email) || !isNonEmptyString(input?.password)) {
    throw new AuthServiceError("AUTH_INVALID_INPUT");
  }

  const email = normalizeEmail(input.email);
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true, role: true, passwordHash: true } });
  if (!user) throw new AuthServiceError("AUTH_USER_NOT_FOUND");
  if (!verifyPassword(input.password, user.passwordHash)) throw new AuthServiceError("AUTH_INVALID_CREDENTIALS");

  const safeUser = { id: user.id, role: user.role, email: user.email };
  return { accessToken: signAccessToken(safeUser), expiresIn: ACCESS_EXPIRES_IN_SEC, user: safeUser };
}

export async function getCurrentUser(accessToken: string): Promise<{ user: { id: string; role: string; email: string } }> {
  const decoded = verifyAccessToken(accessToken);
  const user = await prisma.user.findUnique({ where: { id: decoded.id }, select: { id: true, role: true, email: true } });
  if (!user) throw new AuthServiceError("AUTH_USER_NOT_FOUND");
  return { user };
}
