import crypto from "node:crypto";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const PASSWORD_SALT_BYTES = 16;
const PBKDF2_ITERS = 200_000;
const PBKDF2_KEYLEN = 32;
const PBKDF2_DIGEST = "sha256";

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function derivePassword(password, saltHex) {
  const salt = Buffer.from(saltHex, "hex");
  return crypto.pbkdf2Sync(password, salt, PBKDF2_ITERS, PBKDF2_KEYLEN, PBKDF2_DIGEST).toString("hex");
}

function hashPassword(password) {
  const salt = crypto.randomBytes(PASSWORD_SALT_BYTES).toString("hex");
  const hash = derivePassword(password, salt);
  return `pbkdf2:${PBKDF2_ITERS}:${salt}:${hash}`;
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

const email = requiredEnv("ADMIN_EMAIL").toLowerCase();
const password = requiredEnv("ADMIN_PASSWORD");

if (!email.includes("@")) {
  throw new Error("ADMIN_EMAIL must be a valid email address");
}
if (password.length < 8) {
  throw new Error("ADMIN_PASSWORD must be at least 8 characters");
}

const passwordHash = hashPassword(password);

if (process.argv.includes("--sql")) {
  const id = `admin_${crypto.randomUUID()}`;
  console.log(`
INSERT INTO "User" ("id", "email", "passwordHash", "role", "status", "emailVerified", "createdAt", "updatedAt")
VALUES (${sqlString(id)}, ${sqlString(email)}, ${sqlString(passwordHash)}, 'ADMIN'::"Role", 'VERIFIED'::"Status", true, NOW(), NOW())
ON CONFLICT ("email") DO UPDATE SET
  "passwordHash" = EXCLUDED."passwordHash",
  "role" = 'ADMIN'::"Role",
  "status" = 'VERIFIED'::"Status",
  "emailVerified" = true,
  "updatedAt" = NOW();
`);
} else {
  const prisma = new PrismaClient();

  try {
    await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        role: "ADMIN",
        status: "VERIFIED",
        emailVerified: true,
      },
      create: {
        email,
        passwordHash,
        role: "ADMIN",
        status: "VERIFIED",
        emailVerified: true,
      },
    });

    console.log(`Admin account ready: ${email}`);
  } finally {
    await prisma.$disconnect();
  }
}
