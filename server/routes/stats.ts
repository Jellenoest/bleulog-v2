import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    totalDives: 0,
    totalDiveTime: 0,
    deepestDive: 0,
    averageDepth: 0,
    averageTemperature: 0,
    totalLocations: 0,
    lastFiveDives: []
  });
});

export default router;