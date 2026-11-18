import express from "express";
import { createHmac, timingSafeEqual, createHash } from "node:crypto";
import { inArray, sql } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { siteSettings } from "../../db/schema.ts";

const ADMIN_USERNAMES = ["admin1", "admin@gmail.com"];
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const SETTING_KEYS = ["rates", "history", "storeInfo"] as const;
type SettingKey = (typeof SETTING_KEYS)[number];

function getAdminPassword(): string | undefined {
  const pw = process.env.ADMIN_PASSWORD;
  return pw && pw.length > 0 ? pw : undefined;
}

function signingKey(password: string): Buffer {
  // Derived from the admin password so changing the password logs out every device.
  return createHash("sha256").update(`aurumrates-session:${password}`).digest();
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

function createToken(password: string): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS })).toString("base64url");
  const sig = createHmac("sha256", signingKey(password)).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function isValidToken(token: string | undefined): boolean {
  const password = getAdminPassword();
  if (!password || !token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", signingKey(password)).update(payload).digest("base64url");
  if (!safeEqual(sig, expected)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

function bearer(req: express.Request): string | undefined {
  const h = req.headers.authorization;
  return h?.startsWith("Bearer ") ? h.slice(7) : undefined;
}

function isValidSetting(key: SettingKey, value: unknown): boolean {
  if (key === "history") {
    return Array.isArray(value) && value.length <= 5000 && value.every((v) => v && typeof v === "object");
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  if (key === "rates") {
    const r = value as Record<string, unknown>;
    return ["gold24k", "gold22k", "gold18k", "silver"].every((k) => typeof r[k] === "number" && (r[k] as number) > 0);
  }
  return true;
}

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Public: current site data for every visitor
app.get("/api/site-data", async (_req, res) => {
  try {
    const rows = await db.select().from(siteSettings).where(inArray(siteSettings.key, [...SETTING_KEYS]));
    const data: Record<string, unknown> = { rates: null, history: null, storeInfo: null };
    for (const row of rows) data[row.key] = row.value;
    res.json(data);
  } catch (err) {
    console.error("Failed to load site data", err);
    res.status(500).json({ error: "Failed to load site data" });
  }
});

app.post("/api/login", (req, res) => {
  const password = getAdminPassword();
  if (!password) {
    res.status(503).json({ error: "Admin login is not configured yet. Set ADMIN_PASSWORD in Netlify." });
    return;
  }
  const username = String(req.body?.username ?? "").trim().toLowerCase();
  const pass = String(req.body?.password ?? "");
  if (!ADMIN_USERNAMES.includes(username) || !safeEqual(pass, password)) {
    res.status(401).json({ error: "Invalid username or password." });
    return;
  }
  res.json({ token: createToken(password) });
});

app.get("/api/session", (req, res) => {
  res.json({ valid: isValidToken(bearer(req)) });
});

// Admin only: save any of rates / history / storeInfo
app.put("/api/site-data", async (req, res) => {
  if (!isValidToken(bearer(req))) {
    res.status(401).json({ error: "Your session has expired. Please sign in again." });
    return;
  }
  const body = (req.body ?? {}) as Record<string, unknown>;
  const updates = SETTING_KEYS.filter((k) => body[k] !== undefined);
  if (updates.length === 0) {
    res.status(400).json({ error: "Nothing to save." });
    return;
  }
  for (const key of updates) {
    if (!isValidSetting(key, body[key])) {
      res.status(400).json({ error: `Invalid ${key} data.` });
      return;
    }
  }
  try {
    await db
      .insert(siteSettings)
      .values(updates.map((key) => ({ key, value: body[key] })))
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: sql`excluded.value`, updatedAt: sql`now()` },
      });
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to save site data", err);
    res.status(500).json({ error: "Failed to save changes." });
  }
});

export const config = {
  path: "/api/*",
};

export default app;
