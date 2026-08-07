import db from "../database/database";
import { Dive } from "../types/dive";

function rowToDive(row: any): Dive {
  return {
    ...row,

    nightDive: Boolean(row.nightDive),
    driftDive: Boolean(row.driftDive),
    altitudeDive: Boolean(row.altitudeDive),

    averageDepth: row.averageDepth ?? 0,
    safetyStop: row.safetyStop ?? 0,

    current: row.current ?? "",

    airConsumption: row.airConsumption ?? 0,

    photos: row.photos ? JSON.parse(row.photos) : [],
  };
}

export function getAllDives(): Promise<Dive[]> {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM dives ORDER BY diveNumber DESC",
      [],
      (err, rows) => {
        if (err) return reject(err);

        resolve(rows.map(rowToDive));
      }
    );
  });
}

export function getDiveById(id: string): Promise<Dive | null> {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM dives WHERE id = ?",
      [id],
      (err, row) => {
        if (err) return reject(err);

        if (!row) {
          return resolve(null);
        }

        resolve(rowToDive(row));
      }
    );
  });
}

export function createDive(dive: Dive): Promise<void> {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT MAX(diveNumber) AS maxDiveNumber FROM dives",
      [],
      (err, row: any) => {
        if (err) {
          return reject(err);
        }

        const nextDiveNumber = (row?.maxDiveNumber ?? 0) + 1;

        db.run(
          `
          INSERT INTO dives (
            id,
            diveNumber,
            date,
            location,
            country,
            buddy,
            latitude,
            longitude,
            diveType,
            nightDive,
            driftDive,
            altitudeDive,
            maxDepth,
            averageDepth,
            duration,
            safetyStop,
            waterType,
            waterTemperature,
            visibility,
            current,
            weight,
            suit,
            cylinder,
            gas,
            startPressure,
            endPressure,
            airConsumption,
            notes,
            photos
          )
          VALUES (
            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
          )
          `,
          [
            dive.id,
            nextDiveNumber,

            dive.date,
            dive.location,
            dive.country,
            dive.buddy,

            dive.latitude,
            dive.longitude,

            dive.diveType,

            Number(dive.nightDive),
            Number(dive.driftDive),
            Number(dive.altitudeDive),

            dive.maxDepth,
            dive.averageDepth,

            dive.duration,
            dive.safetyStop,

            dive.waterType,
            dive.waterTemperature,
            dive.visibility,
            dive.current,

            dive.weight,
            dive.suit,
            dive.cylinder,
            dive.gas,

            dive.startPressure,
            dive.endPressure,

            dive.airConsumption,

            dive.notes,

            JSON.stringify(dive.photos),
          ],
          (err) => {
            if (err) {
              return reject(err);
            }

            resolve();
          }
        );
      }
    );
  });
}
export function updateDive(dive: Dive): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE dives SET
        diveNumber=?,
        date=?,
        location=?,
        country=?,
        buddy=?,

        latitude=?,
        longitude=?,

        diveType=?,

        nightDive=?,
        driftDive=?,
        altitudeDive=?,

        maxDepth=?,
        averageDepth=?,

        duration=?,
        safetyStop=?,

        waterType=?,
        waterTemperature=?,
        visibility=?,
        current=?,

        weight=?,
        suit=?,
        cylinder=?,
        gas=?,

        startPressure=?,
        endPressure=?,

        airConsumption=?,

        notes=?,
        photos=?,

        updatedAt=CURRENT_TIMESTAMP

      WHERE id=?
      `,
      [
        dive.diveNumber,

        dive.date,
        dive.location,
        dive.country,
        dive.buddy,

        dive.latitude,
        dive.longitude,

        dive.diveType,

        Number(dive.nightDive),
        Number(dive.driftDive),
        Number(dive.altitudeDive),

        dive.maxDepth,
        dive.averageDepth,

        dive.duration,
        dive.safetyStop,

        dive.waterType,
        dive.waterTemperature,
        dive.visibility,
        dive.current,

        dive.weight,
        dive.suit,
        dive.cylinder,
        dive.gas,

        dive.startPressure,
        dive.endPressure,

        dive.airConsumption,

        dive.notes,
        JSON.stringify(dive.photos),

        dive.id,
      ],
      (err) => {
  if (err) {
    console.error("=== SQLITE UPDATE ERROR ===");
    console.error(err);
    return reject(err);
  }

  resolve();
}
    );
  });
}

export function deleteDive(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM dives WHERE id = ?",
      [id],
      (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      }
    );
  });
}