import { type User, type InsertUser, type VocabularyEntry, type InsertVocabularyEntry, users, vocabularyEntries } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getEntriesByUserId(userId: string): Promise<VocabularyEntry[]>;
  getEntryById(id: string): Promise<VocabularyEntry | undefined>;
  createEntry(entry: InsertVocabularyEntry & { userId: string }): Promise<VocabularyEntry>;
  updateEntry(id: string, userId: string, entry: InsertVocabularyEntry): Promise<VocabularyEntry | undefined>;
  deleteEntry(id: string, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getEntriesByUserId(userId: string): Promise<VocabularyEntry[]> {
    return await db
      .select()
      .from(vocabularyEntries)
      .where(eq(vocabularyEntries.userId, userId))
      .orderBy(desc(vocabularyEntries.createdAt));
  }

  async getEntryById(id: string): Promise<VocabularyEntry | undefined> {
    const [entry] = await db
      .select()
      .from(vocabularyEntries)
      .where(eq(vocabularyEntries.id, id));
    return entry || undefined;
  }

  async createEntry(entry: InsertVocabularyEntry & { userId: string }): Promise<VocabularyEntry> {
    const [newEntry] = await db
      .insert(vocabularyEntries)
      .values(entry)
      .returning();
    return newEntry;
  }

  async updateEntry(id: string, userId: string, entry: InsertVocabularyEntry): Promise<VocabularyEntry | undefined> {
    const [updatedEntry] = await db
      .update(vocabularyEntries)
      .set({ ...entry, updatedAt: new Date() })
      .where(and(eq(vocabularyEntries.id, id), eq(vocabularyEntries.userId, userId)))
      .returning();
    return updatedEntry || undefined;
  }

  async deleteEntry(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(vocabularyEntries)
      .where(and(eq(vocabularyEntries.id, id), eq(vocabularyEntries.userId, userId)))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
