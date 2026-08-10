import db from "../database/database";

export interface DashboardStats {
  totalDives: number;
  totalDiveTime: number;
  deepestDive: number;
  averageDepth: number;
  averageTemperature: number;
  totalLocations: number;
}

export function getDashboardStats(): Promise<DashboardStats> {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT
        COUNT(*) AS totalDives,
        COALESCE(SUM(duration),0) AS totalDiveTime,
        COALESCE(MAX(maxDepth),0) AS deepestDive,
        COALESCE(AVG(maxDepth),0) AS averageDepth,
        COALESCE(AVG(waterTemperature),0) AS averageTemperature,
        COUNT(DISTINCT location) AS totalLocations
      FROM dives
      `,
      [],
      (error, row: any) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          totalDives: Number(row.totalDives),
          totalDiveTime: Number(row.totalDiveTime),
          deepestDive: Number(row.deepestDive),
          averageDepth: Number(row.averageDepth),
          averageTemperature: Number(row.averageTemperature),
          totalLocations: Number(row.totalLocations),
        });
      }
    );
  });
}