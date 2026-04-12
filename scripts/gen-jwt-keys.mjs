/**
 * Prints RS256 PEM pair for JWT_PRIVATE_KEY / JWT_PUBLIC_KEY in .env form.
 * Run: node scripts/gen-jwt-keys.mjs
 */
import { generateKeyPairSync } from "node:crypto";

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

const esc = (pem) => JSON.stringify(pem);
console.log("Paste into .env (keep quotes):\n");
console.log(`JWT_PRIVATE_KEY=${esc(privateKey)}`);
console.log(`JWT_PUBLIC_KEY=${esc(publicKey)}`);
