import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  entries: many(vocabularyEntries),
}));

export const vocabularyEntries = pgTable("vocabulary_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  term: text("term").notNull(),
  definition: text("definition").notNull(),
  example: text("example").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const vocabularyEntriesRelations = relations(vocabularyEntries, ({ one }) => ({
  user: one(users, {
    fields: [vocabularyEntries.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertVocabularyEntrySchema = createInsertSchema(vocabularyEntries).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVocabularyEntry = z.infer<typeof insertVocabularyEntrySchema>;
export type VocabularyEntry = typeof vocabularyEntries.$inferSelect;
