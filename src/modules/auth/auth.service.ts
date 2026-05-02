import crypto from "node:crypto";

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

type StoredUser = {
  id: string;
  role: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
};

const usersByEmail = new Map<string, StoredUser>();
const sessionsByToken = new Map<string, { userId: string; createdAt: Date }>();

const ACCESS_TOKEN_BYTES = 32;
const PASSWORD_SALT_BYTES = 16;
const PBKDF2_ITERS = 200_000;
const PBKDF2_KEYLEN = 32;
const PBKDF2_DIGEST = "sha256";
const ACCESS_EXPIRES_IN_SEC = 15 * 60;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function hashPassword(password: string, saltHex: string): string {
  const salt = Buffer.from(saltHex, "hex");
  const derived = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERS, PBKDF2_KEYLEN, PBKDF2_DIGEST);
  return derived.toString("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

function generateId(): string {
  return crypto.randomUUID();
}

function generateAccessToken(): string {
  return crypto.randomBytes(ACCESS_TOKEN_BYTES).toString("hex");
}

export async function registerUser(input: RegisterUserInput): Promise<{ user: { id: string; role: string; email: string } }> {
  if (!isNonEmptyString(input?.role) || !isNonEmptyString(input?.email) || !isNonEmptyString(input?.password)) {
    throw new AuthServiceError("AUTH_INVALID_INPUT");
  }

  const email = normalizeEmail(input.email);
  if (!email.includes("@")) throw new AuthServiceError("AUTH_INVALID_INPUT");
  if (input.password.length < 8) throw new AuthServiceError("AUTH_INVALID_INPUT");

  if (usersByEmail.has(email)) throw new AuthServiceError("AUTH_USER_EXISTS");

  const salt = crypto.randomBytes(PASSWORD_SALT_BYTES).toString("hex");
  const passwordHash = hashPassword(input.password, salt);
  const user: StoredUser = {
    id: generateId(),
    role: input.role.trim(),
    email,
    passwordHash,
    passwordSalt: salt,
    createdAt: new Date(),
  };
  usersByEmail.set(email, user);

  return { user: { id: user.id, role: user.role, email: user.email } };
}

export async function loginUser(input: LoginUserInput): Promise<{ accessToken: string; expiresIn: number }> {
  if (!isNonEmptyString(input?.email) || !isNonEmptyString(input?.password)) {
    throw new AuthServiceError("AUTH_INVALID_INPUT");
  }

  const email = normalizeEmail(input.email);
  const user = usersByEmail.get(email);
  if (!user) throw new AuthServiceError("AUTH_USER_NOT_FOUND");

  const attemptedHash = hashPassword(input.password, user.passwordSalt);
  if (!safeEqualHex(attemptedHash, user.passwordHash)) throw new AuthServiceError("AUTH_INVALID_CREDENTIALS");

  const accessToken = generateAccessToken();
  sessionsByToken.set(accessToken, { userId: user.id, createdAt: new Date() });
  return { accessToken, expiresIn: ACCESS_EXPIRES_IN_SEC };
}

export async function getCurrentUser(accessToken: string): Promise<{ user: { id: string; role: string; email: string } }> {
  if (!isNonEmptyString(accessToken)) throw new AuthServiceError("AUTH_INVALID_CREDENTIALS");

  const session = sessionsByToken.get(accessToken);
  if (!session) throw new AuthServiceError("AUTH_INVALID_CREDENTIALS");

  for (const u of usersByEmail.values()) {
    if (u.id === session.userId) return { user: { id: u.id, role: u.role, email: u.email } };
  }

  throw new AuthServiceError("AUTH_USER_NOT_FOUND");
}
