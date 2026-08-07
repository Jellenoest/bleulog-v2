import { Router } from "express";
import {
  getAllDives,
  getDiveById,
  createDive,
  updateDive,
  deleteDive,
} from "../services/diveService";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const dives = await getAllDives();
    res.json(dives);
  } catch (error) {
    console.error("========== GET DIVES ERROR ==========");
    console.error(error);

    res.status(500).json({
      message: "Kon duiken niet ophalen.",
      error: String(error),
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const dive = await getDiveById(req.params.id);

    if (!dive) {
      return res.status(404).json({
        message: "Duik niet gevonden.",
      });
    }

    res.json(dive);
  } catch (error) {
    console.error("========== GET DIVE ERROR ==========");
    console.error(error);

    res.status(500).json({
      message: "Kon duik niet ophalen.",
      error: String(error),
    });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("");
    console.log("========== CREATE DIVE ==========");
    console.log(req.body);

    await createDive(req.body);

    console.log("✅ Duik succesvol opgeslagen.");

    res.status(201).json({
      message: "Duik opgeslagen.",
    });
  } catch (error) {
    console.error("");
    console.error("========== CREATE ERROR ==========");
    console.error(error);

    res.status(500).json({
      message: "Kon duik niet opslaan.",
      error: String(error),
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    console.log("");
    console.log("========== UPDATE DIVE ==========");
    console.log(req.body);

    await updateDive({
      ...req.body,
      id: req.params.id,
    });

    console.log("✅ Duik succesvol bijgewerkt.");

    res.json({
      message: "Duik bijgewerkt.",
    });
  } catch (error) {
    console.error("");
    console.error("========== UPDATE ERROR ==========");
    console.error(error);

    res.status(500).json({
      message: "Kon duik niet bijwerken.",
      error: String(error),
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    console.log("");
    console.log("========== DELETE DIVE ==========");
    console.log(req.params.id);

    await deleteDive(req.params.id);

    console.log("✅ Duik verwijderd.");

    res.json({
      message: "Duik verwijderd.",
    });
  } catch (error) {
    console.error("");
    console.error("========== DELETE ERROR ==========");
    console.error(error);

    res.status(500).json({
      message: "Kon duik niet verwijderen.",
      error: String(error),
    });
  }
});

export default router;