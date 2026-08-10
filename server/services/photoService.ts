import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";

sqlite3.verbose();

/*
|--------------------------------------------------------------------------
| BlueLog opslagstructuur
|--------------------------------------------------------------------------
|
| server/
|   ...
|
| data/
|   bluelog.db
|
| uploads/
|   dives/
|       <dive-id>/
|
*/

const PROJECT_ROOT = path.resolve(__dirname, "../..");

const DATA_DIR = path.join(PROJECT_ROOT, "data");
const UPLOADS_DIR = path.join(PROJECT_ROOT, "uploads");
const DIVE_UPLOADS_DIR = path.join(UPLOADS_DIR, "dives");

for (const dir of [
  DATA_DIR,
  UPLOADS_DIR,
  DIVE_UPLOADS_DIR,
]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }
}

const DATABASE_PATH = path.join(
  DATA_DIR,
  "bluelog.db"
);

console.log("");
console.log("=================================");
console.log(" BlueLog Storage");
console.log("=================================");
console.log("Database :", DATABASE_PATH);
console.log("Uploads  :", DIVE_UPLOADS_DIR);
console.log("=================================");
console.log("");

const db = new sqlite3.Database(
  DATABASE_PATH,
  (error) => {
    if (error) {
      console.error("❌ SQLite fout");
      console.error(error);
      process.exit(1);
    }

    console.log("✅ SQLite verbonden");
  }
);

export {
  DATA_DIR,
  UPLOADS_DIR,
  DIVE_UPLOADS_DIR,
  DATABASE_PATH,
};

export default db;