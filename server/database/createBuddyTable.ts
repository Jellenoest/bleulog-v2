import db from "./database";

export function createBuddyTable(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
CREATE TABLE IF NOT EXISTS buddies (

  id TEXT PRIMARY KEY,

  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,

  nickName TEXT NOT NULL,
  birthDate TEXT NOT NULL,

  phone TEXT NOT NULL,
  email TEXT NOT NULL,

  certificationAgency TEXT NOT NULL,
  certificationLevel TEXT NOT NULL,

  nitrox INTEGER NOT NULL DEFAULT 0,

  totalDives INTEGER NOT NULL DEFAULT 0,

  notes TEXT NOT NULL,

  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP

);
      `,
      (error) => {
        if (error) {
          reject(error);
          return;
        }

        console.log("👥 Tabel buddies gereed");

        resolve();
      }
    );
  });
}