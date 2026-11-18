import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

// Shared site settings (rates, rate history, store info) stored as JSON documents,
// keyed by name, so every visitor and device sees the same data.
export const siteSettings = pgTable("site_settings", {
  key: text().primaryKey(),
  value: jsonb().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
