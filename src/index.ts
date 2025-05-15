import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import apiRoutes from "./routes";
import cors from "cors";
import { GoatAgentService } from "./services/GoatAgentService";
import graph from "./graph";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

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
  const { schema } = await graph.init();

  app.get('/api/graph/schema', (req, res) => {
    res.send(schema)
  })

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
