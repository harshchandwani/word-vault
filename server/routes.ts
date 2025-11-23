import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertVocabularyEntrySchema } from "@shared/schema";
import bcrypt from "bcrypt";
import { fromZodError } from "zod-validation-error";

const SALT_ROUNDS = 10;

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }

      const { username, password } = result.data;

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
      });

      req.session.userId = user.id;

      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const { username, password } = result.data;

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/entries", requireAuth, async (req, res) => {
    try {
      const entries = await storage.getEntriesByUserId(req.session.userId!);
      res.json(entries);
    } catch (error: any) {
      console.error("Get entries error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/entries", requireAuth, async (req, res) => {
    try {
      const result = insertVocabularyEntrySchema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }

      const entry = await storage.createEntry({
        ...result.data,
        userId: req.session.userId!,
      });

      res.status(201).json(entry);
    } catch (error: any) {
      console.error("Create entry error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/entries/:id", requireAuth, async (req, res) => {
    try {
      const result = insertVocabularyEntrySchema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }

      const entry = await storage.updateEntry(
        req.params.id,
        req.session.userId!,
        result.data
      );

      if (!entry) {
        return res.status(404).json({ message: "Entry not found or unauthorized" });
      }

      res.json(entry);
    } catch (error: any) {
      console.error("Update entry error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/entries/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteEntry(req.params.id, req.session.userId!);

      if (!success) {
        return res.status(404).json({ message: "Entry not found or unauthorized" });
      }

      res.json({ message: "Entry deleted successfully" });
    } catch (error: any) {
      console.error("Delete entry error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
