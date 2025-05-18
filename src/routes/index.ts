import { Router, type Request, type Response } from "express";
import agentRoutes from "./agent";
import authRoutes from "./auth";
// import neo4jRoutes from "./neo4j";
import sessionRoutes from "./session";
const router = Router();


router.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is working" });
});

router.get("/status", (req: Request, res: Response) => {
  res.json({
    status: "online",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// router.use("/neo4j", neo4jRoutes);
router.use("/agent", agentRoutes);
router.use("/auth", authRoutes);
router.use("/session", sessionRoutes);

export default router;
