import { Router } from "express";

import EventTableService from "../../services/eventtable.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/eventtable.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: EventTable
 *   description: API for managing EventTable objects
 *
 * /event-table:
 *   get:
 *     tags: [EventTable]
 *     summary: Get all the EventTable objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of EventTable objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventTable'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await EventTableService.list();
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
 * /event-table:
 *   post:
 *     tags: [EventTable]
 *     summary: Create a new EventTable
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventTable'
 *     responses:
 *       201:
 *         description: The created EventTable object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventTable'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await EventTableService.create(req.validatedBody);
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
 * /event-table/{id}:
 *   get:
 *     tags: [EventTable]
 *     summary: Get a EventTable by id
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
 *         description: EventTable object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventTable'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await EventTableService.get(req.params.id);
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
 * /event-table/{id}:
 *   put:
 *     tags: [EventTable]
 *     summary: Update EventTable with the specified id
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
 *             $ref: '#/components/schemas/EventTable'
 *     responses:
 *       200:
 *         description: The updated EventTable object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventTable'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await EventTableService.update(
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
 * /event-table/{id}:
 *   delete:
 *     tags: [EventTable]
 *     summary: Delete EventTable with the specified id
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
    const success = await EventTableService.delete(req.params.id);
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
