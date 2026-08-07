import { DiveSite } from "../types/DiveSite";
import { randomUUID } from "crypto";

export const diveSites: DiveSite[] = [

  // ===========================
  // NEDERLAND
  // ===========================

  {
    id: randomUUID(),
    code: "NL-ZLD-001",
    name: "Zeelandbrug",
    country: "Nederland",
    countryCode: "NL",
    region: "Zeeland",
    latitude: 51.6407,
    longitude: 3.9013,
    waterType: "Zout",
    entryType: "Kant",
    difficulty: "Gemiddeld",
    maxDepth: 35,
    description: "Misschien wel de bekendste duikstek van Nederland."
  },

  {
    id: randomUUID(),
    code: "NL-ZLD-002",
    name: "Den Osse Haven",
    country: "Nederland",
    countryCode: "NL",
    region: "Zeeland",
    latitude: 51.7467,
    longitude: 3.8516,
    waterType: "Zout",
    entryType: "Kant",
    difficulty: "Beginner",
    maxDepth: 30,
    description: "Veel gebruikt voor opleidingen en recreatieve duiken."
  },

  {
    id: randomUUID(),
    code: "NL-ZLD-003",
    name: "Dreischor Gemaal",
    country: "Nederland",
    countryCode: "NL",
    region: "Zeeland",
    latitude: 51.6945,
    longitude: 3.9785,
    waterType: "Zout",
    entryType: "Kant",
    difficulty: "Gemiddeld",
    maxDepth: 30,
    description: "Bekende stek met veel onderwaterleven."
  },

  {
    id: randomUUID(),
    code: "NL-VKP-001",
    name: "Vinkeveense Plassen - Zandeiland 4",
    country: "Nederland",
    countryCode: "NL",
    region: "Utrecht",
    latitude: 52.2496,
    longitude: 4.9567,
    waterType: "Zoet",
    entryType: "Kant",
    difficulty: "Beginner",
    maxDepth: 22,
    description: "Populaire zoetwaterduikstek."
  },

  {
    id: randomUUID(),
    code: "NL-VKP-002",
    name: "Vinkeveense Plassen - Zandeiland 9",
    country: "Nederland",
    countryCode: "NL",
    region: "Utrecht",
    latitude: 52.2452,
    longitude: 4.9648,
    waterType: "Zoet",
    entryType: "Kant",
    difficulty: "Beginner",
    maxDepth: 18,
    description: "Veel gebruikt voor trainingen."
  },

  // ===========================
  // CURAÇAO
  // ===========================

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
    description: "Alice in Wonderland rif."
  }

];