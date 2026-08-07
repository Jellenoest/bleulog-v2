import { Router } from "express";
import db from "../database/database";

const router = Router();

/**
 * Alle duikstekken ophalen
 */
router.get("/", (_req, res) => {
  db.all(
    `
    SELECT *
    FROM dive_sites
    ORDER BY country, name
    `,
    [],
    (error, rows) => {
      if (error) {
        console.error(error);

        return res.status(500).json({
          message: "Kon duikstekken niet ophalen.",
        });
      }

      res.json(rows);
    }
  );
});

/**
 * Zoeken op naam
 * /api/dive-sites/search?q=zee
 */
router.get("/search", (req, res) => {
  const q = String(req.query.q ?? "").trim();

  db.all(
    `
    SELECT *
    FROM dive_sites
    WHERE
      LOWER(name) LIKE LOWER(?)
    ORDER BY
      country,
      name
    LIMIT 25
    `,
    [`%${q}%`],
    (error, rows) => {
      if (error) {
        console.error(error);

        return res.status(500).json({
          message: "Zoeken mislukt.",
        });
      }

      res.json(rows);
    }
  );
});
console.log("✅ dive-sites router geladen");
export default router;