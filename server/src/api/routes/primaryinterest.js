import { Router } from "express";

import PrimaryInterestService from "../../services/primaryinterest.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/primaryinterest.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: PrimaryInterest
 *   description: API for managing PrimaryInterest objects
 *
 * /primary-interest:
 *   get:
 *     tags: [PrimaryInterest]
 *     summary: Get all the PrimaryInterest objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of PrimaryInterest objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PrimaryInterest'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await PrimaryInterestService.list();
    res.json(results);
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /primary-interest:
 *   post:
 *     tags: [PrimaryInterest]
 *     summary: Create a new PrimaryInterest
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrimaryInterest'
 *     responses:
 *       201:
 *         description: The created PrimaryInterest object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrimaryInterest'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await PrimaryInterestService.create(req.validatedBody);
    res.status(201).json(obj);
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /primary-interest/{id}:
 *   get:
 *     tags: [PrimaryInterest]
 *     summary: Get a PrimaryInterest by id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PrimaryInterest object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrimaryInterest'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await PrimaryInterestService.get(req.params.id);
    if (obj) {
      res.json(obj);
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /primary-interest/{id}:
 *   put:
 *     tags: [PrimaryInterest]
 *     summary: Update PrimaryInterest with the specified id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrimaryInterest'
 *     responses:
 *       200:
 *         description: The updated PrimaryInterest object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrimaryInterest'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await PrimaryInterestService.update(
        req.params.id,
        req.validatedBody
      );
      if (obj) {
        res.status(200).json(obj);
      } else {
        res.status(404).json({ error: "Resource not found" });
      }
    } catch (error) {
      if (error.isClientError()) {
        res.status(400).json({ error });
      } else {
        next(error);
      }
    }
  }
);

/** @swagger
 *
 * /primary-interest/{id}:
 *   delete:
 *     tags: [PrimaryInterest]
 *     summary: Delete PrimaryInterest with the specified id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *        description: OK, object deleted
 */
router.delete("/:id", requireValidId, async (req, res, next) => {
  try {
    const success = await PrimaryInterestService.delete(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Not found, nothing deleted" });
    }
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

export default router;
