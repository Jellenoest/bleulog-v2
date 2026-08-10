import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const OUTPUT = path.join(
  __dirname,
  "..",
  "data",
  "dive-sites.json"
);

const diveSites = [
  {
    id: randomUUID(),
    code: "CW-001",
    name: "Tugboat",
    country: "Curaçao",
    countryCode: "CW",
    region: "Caracasbaai",
    latitude: 12.0729,
    longitude: -68.8614,
    waterType: "Zout",
    entryType: "Kant",
    difficulty: "Beginner",
    maxDepth: 18,
    description: "Beroemde sleepboot vol koraal."
  },
  {
    id: randomUUID(),
    code: "CW-002",
    name: "Playa Kalki",
    country: "Curaçao",
    countryCode: "CW",
    region: "Westpunt",
    latitude: 12.3702,
    longitude: -69.1578,
    waterType: "Zout",
    entryType: "Kant",
    difficulty: "Beginner",
    maxDepth: 35,
    description: "Alice in Wonderland."
  },
  {
    id: randomUUID(),
    code: "CW-003",
    name: "Porto Mari",
    country: "Curaçao",
    countryCode: "CW",
    region: "Bandabou",
    latitude: 12.2348,
    longitude: -69.0908,
    waterType: "Zout",
    entryType: "Kant",
    difficulty: "Beginner",
    maxDepth: 30,
    description: "Dubbel rif met veel schildpadden."
  }
];

fs.writeFileSync(
  OUTPUT,
  JSON.stringify(diveSites, null, 2),
  "utf8"
);

console.log(`✅ ${diveSites.length} duikstekken opgeslagen.`);
