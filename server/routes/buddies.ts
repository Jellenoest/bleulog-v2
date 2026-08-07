import { Router } from "express";
import db from "../database/database";
import { randomUUID } from "crypto";

const router = Router();

/**
 * Alle buddy's ophalen
 */
router.get("/", (_req, res) => {
  db.all(
    `
    SELECT *
    FROM buddies
    ORDER BY firstName, lastName
    `,
    [],
    (error, rows) => {
      if (error) {
        console.error(error);

        return res.status(500).json({
          message: "Buddy's konden niet worden opgehaald.",
        });
      }

      res.json(rows);
    }
  );
});

/**
 * Nieuwe buddy toevoegen
 */
router.post("/", (req, res) => {
  const buddy = {
    id: randomUUID(),

    firstName: req.body.firstName ?? "",
    lastName: req.body.lastName ?? "",

    nickName: req.body.nickName ?? "",
    birthDate: req.body.birthDate ?? "",

    phone: req.body.phone ?? "",
    email: req.body.email ?? "",

    certificationAgency:
      req.body.certificationAgency ?? "",

    certificationLevel:
      req.body.certificationLevel ?? "",

    nitrox: req.body.nitrox ? 1 : 0,

    totalDives:
      Number(req.body.totalDives ?? 0),

    notes: req.body.notes ?? "",
  };

  db.run(
    `
    INSERT INTO buddies (

      id,

      firstName,
      lastName,

      nickName,
      birthDate,

      phone,
      email,

      certificationAgency,
      certificationLevel,

      nitrox,
      totalDives,

      notes

    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      buddy.id,

      buddy.firstName,
      buddy.lastName,

      buddy.nickName,
      buddy.birthDate,

      buddy.phone,
      buddy.email,

      buddy.certificationAgency,
      buddy.certificationLevel,

      buddy.nitrox,
      buddy.totalDives,

      buddy.notes,
    ],
    function (error) {
      if (error) {
        console.error(error);

        return res.status(500).json({
          message: "Buddy kon niet worden opgeslagen.",
        });
      }

      res.status(201).json(buddy);
    }
  );
});

/**
 * Buddy bijwerken
 */
router.put("/:id", (req, res) => {
  db.run(
    `
    UPDATE buddies
    SET

      firstName = ?,
      lastName = ?,

      nickName = ?,
      birthDate = ?,

      phone = ?,
      email = ?,

      certificationAgency = ?,
      certificationLevel = ?,

      nitrox = ?,
      totalDives = ?,

      notes = ?

    WHERE id = ?
    `,
    [
      req.body.firstName ?? "",
      req.body.lastName ?? "",

      req.body.nickName ?? "",
      req.body.birthDate ?? "",

      req.body.phone ?? "",
      req.body.email ?? "",

      req.body.certificationAgency ?? "",
      req.body.certificationLevel ?? "",

      req.body.nitrox ? 1 : 0,

      Number(req.body.totalDives ?? 0),

      req.body.notes ?? "",

      req.params.id,
    ],
    function (error) {
      if (error) {
        console.error(error);

        return res.status(500).json({
          message: "Buddy kon niet worden bijgewerkt.",
        });
      }

      db.get(
        `
        SELECT *
        FROM buddies
        WHERE id = ?
        `,
        [req.params.id],
        (error, row) => {
          if (error) {
            return res.status(500).json({
              message:
                "Buddy kon niet worden opgehaald.",
            });
          }

          res.json(row);
        }
      );
    }
  );
});

/**
 * Buddy verwijderen
 */
router.delete("/:id", (req, res) => {
  db.run(
    `
    DELETE FROM buddies
    WHERE id = ?
    `,
    [req.params.id],
    function (error) {
      if (error) {
        console.error(error);

        return res.status(500).json({
          message:
            "Buddy kon niet worden verwijderd.",
        });
      }

      res.status(204).end();
    }
  );
});

export default router;