import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

const router = Router();

const ROOT = path.resolve(__dirname, "..");

const UPLOAD_DIR = path.join(
  ROOT,
  "public",
  "uploads"
);

fs.mkdirSync(UPLOAD_DIR, {
  recursive: true,
});

console.log(
  "📷 Upload map:",
  UPLOAD_DIR
);

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, UPLOAD_DIR);
  },

  filename(_req, file, cb) {
    cb(
      null,
      `${uuid()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 15 * 1024 * 1024,
  },

  fileFilter(_req, file, cb) {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      allowed.includes(file.mimetype)
    ) {
      cb(null, true);
      return;
    }

    cb(
      new Error(
        "Alleen JPG, PNG en WEBP zijn toegestaan."
      )
    );
  },
});

router.post(
  "/",
  upload.array("photos", 20),
  (req, res) => {
    const files =
      (req.files as Express.Multer.File[]) ??
      [];

    res.json({
      success: true,

      photos: files.map((file) => ({
        filename: file.filename,
        originalName:
          file.originalname,
        path: `/uploads/${file.filename}`,
        size: file.size,
      })),
    });
  }
);

export default router;