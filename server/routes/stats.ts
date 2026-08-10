import { Router } from "express";
import { getDashboardStats } from "../services/statsService";
import db from "../database/database";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const stats = await getDashboardStats();

    db.all(
      `
      SELECT
        id,
        diveNumber,
        date,
        location,
        country,
        maxDepth,
        duration
      FROM dives
      ORDER BY date DESC
      LIMIT 5
      `,
      [],
      (error, rows) => {
        if (error) {
          console.error(error);

          return res.status(500).json({
            message: "Kon dashboard niet laden.",
          });
        }

        res.json({
          ...stats,
          lastFiveDives: rows,
        });
      }
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kon statistieken niet ophalen.",
    });
  }
});

export default router;