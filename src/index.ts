import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import apiRoutes from "./routes";
import cors from "cors";
import { GoatAgentService } from "./services/GoatAgentService";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware to redirect all traffic to https without www
app.use((req: Request, res: Response, next) => {
  // Get host from headers which is more reliable than req.hostname
  const hostHeader = req.headers.host || '';
  const host = hostHeader.split(':')[0]; // Remove port if present
  
  // Skip for localhost and IP addresses
  if (host === 'localhost' || /^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
    return next();
  }
  
  // Determine if we need to redirect
  const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
  const hasWww = host.startsWith('www.');
  
  if (!isSecure || hasWww) {
    // Remove www if present
    const cleanHost = hasWww ? host.substring(4) : host;
    
    // Build the redirect URL (always https, no www)
    const redirectUrl = `https://${cleanHost}${req.originalUrl}`;
    
    // 301 is permanent redirect (good for SEO)
    return res.redirect(301, redirectUrl);
  }
  
  next();
});

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running");
});

app.use("/api", apiRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

(async () => {
  app.listen(port, async () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    try {
      const goatAgentService = GoatAgentService.getInstance();
      await goatAgentService.initializePlugins();
      console.log("🐐 GoatAgent plugins initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize GoatAgent plugins:", error);
    }
  });
})();
