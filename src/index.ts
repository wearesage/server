import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import apiRoutes from "./routes";
import cors from "cors";
import { GoatAgentService } from "./services/GoatAgentService";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

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

app.use(cors(corsOptions));
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
