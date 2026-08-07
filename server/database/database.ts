import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";

sqlite3.verbose();

const ROOT = path.resolve(__dirname, "..");

const DATA_DIR = path.join(ROOT, "data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, {
    recursive: true,
  });
}

const DATABASE_PATH = path.join(
  DATA_DIR,
  "bluelog.db"
);

console.log(
  "💾 Database:",
  DATABASE_PATH
);

const db = new sqlite3.Database(
  DATABASE_PATH,
  (error) => {
    if (error) {
      console.error(
        "❌ SQLite fout:",
        error
      );

      process.exit(1);
    }

    console.log(
      "✅ SQLite verbonden"
    );
  }
);

export default db;