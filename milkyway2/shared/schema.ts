import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const validators = pgTable("validators", {
  id: serial("id").primaryKey(),
  stash: text("stash").notNull().unique(),
  type: text("type").notNull(), // "good", "neutral", "bad"
  description: text("description").notNull(),
  commission: integer("commission").default(0),
  uptime: integer("uptime").default(0),
  slashed: boolean("slashed").default(false),
  eventsCount: integer("events_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const validatorEvents = pgTable("validator_events", {
  id: serial("id").primaryKey(),
  validatorId: integer("validator_id").references(() => validators.id),
  block: integer("block").notNull(),
  event: text("event").notNull(),
  data: jsonb("data"),
  timestamp: timestamp("timestamp").defaultNow(),
  hash: text("hash"),
});

export const incidentReports = pgTable("incident_reports", {
  id: serial("id").primaryKey(),
  validatorStash: text("validator_stash").notNull(),
  incidentType: text("incident_type").notNull(),
  description: text("description"),
  nullifierHash: text("nullifier_hash").notNull().unique(),
  proof: jsonb("proof"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const referenda = pgTable("referenda", {
  id: serial("id").primaryKey(),
  referendumId: integer("referendum_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  track: text("track"),
  status: text("status").notNull(),
  support: integer("support").default(0),
  timeLeft: text("time_left"),
  totalVotes: text("total_votes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertValidatorSchema = createInsertSchema(validators).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertValidatorEventSchema = createInsertSchema(validatorEvents).omit({
  id: true,
  timestamp: true,
});

export const insertIncidentReportSchema = createInsertSchema(incidentReports).omit({
  id: true,
  createdAt: true,
  isVerified: true,
});

export const insertReferendumSchema = createInsertSchema(referenda).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Encrypted messaging tables
export const encryptedMessages = pgTable("encrypted_messages", {
  id: serial("id").primaryKey(),
  ciphertext: text("ciphertext").notNull(),
  signature: text("signature").notNull(),
  senderAddress: varchar("sender_address", { length: 255 }).notNull(),
  blockNumber: bigint("block_number", { mode: "number" }),
  transactionHash: varchar("transaction_hash", { length: 255 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  isUnlocked: boolean("is_unlocked").default(false),
  groupKeyId: varchar("group_key_id", { length: 255 }).notNull(),
});

export const validatorKeys = pgTable("validator_keys", {
  id: serial("id").primaryKey(),
  validatorAddress: varchar("validator_address", { length: 255 }).notNull(),
  groupKeyId: varchar("group_key_id", { length: 255 }).notNull(),
  encryptedSymmetricKey: text("encrypted_symmetric_key").notNull(),
  publicSigningKey: text("public_signing_key").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEncryptedMessageSchema = createInsertSchema(encryptedMessages).omit({
  id: true,
  timestamp: true,
});

export const insertValidatorKeySchema = createInsertSchema(validatorKeys).omit({
  id: true,
  createdAt: true,
});

// Types
export type Validator = typeof validators.$inferSelect;
export type ValidatorEvent = typeof validatorEvents.$inferSelect;
export type IncidentReport = typeof incidentReports.$inferSelect;
export type Referendum = typeof referenda.$inferSelect;
export type EncryptedMessage = typeof encryptedMessages.$inferSelect;
export type ValidatorKey = typeof validatorKeys.$inferSelect;

export type InsertValidator = z.infer<typeof insertValidatorSchema>;
export type InsertValidatorEvent = z.infer<typeof insertValidatorEventSchema>;
export type InsertIncidentReport = z.infer<typeof insertIncidentReportSchema>;
export type InsertReferendum = z.infer<typeof insertReferendumSchema>;
export type InsertEncryptedMessage = z.infer<typeof insertEncryptedMessageSchema>;
export type InsertValidatorKey = z.infer<typeof insertValidatorKeySchema>;
