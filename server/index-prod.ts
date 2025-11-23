import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";

export async function serveStatic(app: Express, _server: Server) {
  // Use fileURLToPath for reliable path resolution in bundled code
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static files, but skip API routes completely
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    express.static(distPath)(req, res, next);
  });

  // fall through to index.html for non-API routes only
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      // API routes should have been handled by routes.ts
      // If we reach here, the route doesn't exist
      return res.status(404).json({ message: "API route not found" });
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

(async () => {
  await runApp(serveStatic);
})();
