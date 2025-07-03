import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const qrActivities = pgTable("qr_activities", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  type: text("type").notNull(), // "generate" or "decode"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQrActivitySchema = createInsertSchema(qrActivities).omit({
  id: true,
  createdAt: true,
});

export const generateQrSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export const decodeQrSchema = z.object({
  imageData: z.string().min(1, "Image data is required"),
});

export type InsertQrActivity = z.infer<typeof insertQrActivitySchema>;
export type QrActivity = typeof qrActivities.$inferSelect;
export type GenerateQrRequest = z.infer<typeof generateQrSchema>;
export type DecodeQrRequest = z.infer<typeof decodeQrSchema>;
