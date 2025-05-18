import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import apiRoutes from "./routes";
import cors from "cors";
import { GoatAgentService } from "./services/GoatAgentService";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Trust proxy headers (important for Heroku and other PaaS platforms)
app.set('trust proxy', true);

// // Middleware to redirect all traffic to https without www
// app.use((req: Request, res: Response, next) => {
//   // Get host from headers
//   const hostHeader = req.headers.host || '';
//   const host = hostHeader.split(':')[0]; // Remove port if present
  
//   // Debug information
//   console.log('Redirection middleware:');
//   console.log('- Original URL:', req.originalUrl);
//   console.log('- Host header:', hostHeader);
//   console.log('- Protocol:', req.protocol);
//   console.log('- X-Forwarded-Proto:', req.headers['x-forwarded-proto']);
//   console.log('- Secure:', req.secure);
  
//   // Skip for localhost, IP addresses, and Heroku app domains
//   if (
//     host === 'localhost' ||
//     /^(\d{1,3}\.){3}\d{1,3}$/.test(host) ||
//     host.endsWith('.herokuapp.com') // Skip for Heroku domains as they handle HTTPS already
//   ) {
//     console.log('- Skipping redirect for:', host);
//     return next();
//   }
  
//   // Determine if we need to redirect
//   const isSecure = req.secure || req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https';
//   const hasWww = host.startsWith('www.');
  
//   if (!isSecure || hasWww) {
//     // Remove www if present
//     const cleanHost = hasWww ? host.substring(4) : host;
    
//     // Build the redirect URL (always https, no www)
//     const redirectUrl = `https://${cleanHost}${req.originalUrl}`;
    
//     console.log('- Redirecting to:', redirectUrl);
    
//     // 301 is permanent redirect (good for SEO)
//     return res.redirect(301, redirectUrl);
//   }
  
//   console.log('- No redirect needed');
//   next();
// });

// Configure CORS with specific origins and options
const corsOptions = {
  origin: [
    'https://seethemusic.xyz',
    'https://www.seethemusic.xyz',
    'http://seethemusic.xyz',
    'http://www.seethemusic.xyz'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Apply CORS middleware with our custom options
app.use(cors(corsOptions));

// Enable CORS pre-flight across the board
app.options('*', cors());

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
