import db from "./database";
import { importDiveSites } from "../seed/importDiveSites";
import { createBuddyTable } from "./createBuddyTable";

export async function initializeDatabase(): Promise<void> {

  await new Promise<void>((resolve, reject) => {

    db.serialize(() => {

      db.run(
        `
CREATE TABLE IF NOT EXISTS dives (

  id TEXT PRIMARY KEY,

  diveNumber INTEGER NOT NULL,

  date TEXT NOT NULL,
  location TEXT NOT NULL,
  country TEXT NOT NULL,
  buddy TEXT NOT NULL,

  latitude REAL NOT NULL,
  longitude REAL NOT NULL,

  diveType TEXT NOT NULL,

  nightDive INTEGER NOT NULL,
  driftDive INTEGER NOT NULL,
  altitudeDive INTEGER NOT NULL,

  maxDepth REAL NOT NULL,
  averageDepth REAL NOT NULL,

  duration INTEGER NOT NULL,
  safetyStop INTEGER NOT NULL,

  waterType TEXT NOT NULL,
  waterTemperature REAL NOT NULL,
  visibility REAL NOT NULL,
  current TEXT NOT NULL,

  weight REAL NOT NULL,
  suit TEXT NOT NULL,
  cylinder TEXT NOT NULL,
  gas TEXT NOT NULL,

  startPressure INTEGER NOT NULL,
  endPressure INTEGER NOT NULL,

  airConsumption REAL NOT NULL,

  notes TEXT NOT NULL,

  photos TEXT NOT NULL,

  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP

);
        `,
        (error) => {

          if (error) {
            reject(error);
            return;
          }

          db.run(
            `
CREATE TABLE IF NOT EXISTS dive_sites (

  id TEXT PRIMARY KEY,

  code TEXT UNIQUE NOT NULL,

  name TEXT NOT NULL,

  country TEXT NOT NULL,
  countryCode TEXT NOT NULL,

  region TEXT NOT NULL,

  latitude REAL NOT NULL,
  longitude REAL NOT NULL,

  waterType TEXT NOT NULL,

  entryType TEXT NOT NULL,

  difficulty TEXT NOT NULL,

  maxDepth REAL NOT NULL,

  description TEXT NOT NULL,

  createdAt TEXT DEFAULT CURRENT_TIMESTAMP

);
            `,
            async (error) => {

              if (error) {
                reject(error);
                return;
              }

              console.log("✅ Database geïnitialiseerd");
              console.log("🌍 Tabel dive_sites gereed");

              resolve();

            }
          );

        }
      );

    });

  });

  await new Promise<void>((resolve) => {

    db.get(
      "SELECT COUNT(*) AS total FROM dives",
      (_error, row: any) => {

        console.log(`🤿 ${row.total} duiken gevonden`);

        resolve();

      }
    );

  });

  await importDiveSites();

  await createBuddyTable();

}