import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import divesRouter from "./routes/dives";
import buddiesRouter from "./routes/buddies";
import locationsRouter from "./routes/locations";
import statsRouter from "./routes/stats";
import uploadRouter from "./routes/upload";
import diveSitesRouter from "./routes/dive-sites";

dotenv.config();

const app = express();

const ROOT = path.resolve(__dirname, "..");

const UPLOAD_DIR = path.join(
  ROOT,
  "public",
  "uploads"
);

console.log("📂 Static uploads:", UPLOAD_DIR);

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
    ],
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(UPLOAD_DIR)
);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "BlueLog API is running",
  });
});

app.use("/api/dives", divesRouter);
app.use("/api/buddies", buddiesRouter);
app.use("/api/locations", locationsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/dive-sites", diveSitesRouter);

export default app;