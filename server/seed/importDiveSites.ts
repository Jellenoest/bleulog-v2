import db from "../database/database";
import { diveSites } from "./dive-sites";

export async function importDiveSites(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("DELETE FROM dive_sites");

      const statement = db.prepare(`
        INSERT INTO dive_sites (
          id,
          code,
          name,
          country,
          countryCode,
          region,
          latitude,
          longitude,
          waterType,
          entryType,
          difficulty,
          maxDepth,
          description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const site of diveSites) {
        statement.run(
          site.id,
          site.code,
          site.name,
          site.country,
          site.countryCode,
          site.region,
          site.latitude,
          site.longitude,
          site.waterType,
          site.entryType,
          site.difficulty,
          site.maxDepth,
          site.description
        );
      }

      statement.finalize((error) => {
        if (error) {
          reject(error);
          return;
        }

        console.log(
          `🌍 ${diveSites.length} duikstekken geïmporteerd`
        );

        resolve();
      });
    });
  });
}