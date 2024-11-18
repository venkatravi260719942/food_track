import { Router } from "express";

import KOTItemsService from "../../services/kotitems.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/kotitems.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: KOTItems
 *   description: API for managing KOTItems objects
 *
 * /kotitems:
 *   get:
 *     tags: [KOTItems]
 *     summary: Get all the KOTItems objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of KOTItems objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/KOTItems'
 */
router.get("", async (req, res, next) => {
  try {
    const results = await KOTItemsService.list();
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
 * /kotitems:
 *   post:
 *     tags: [KOTItems]
 *     summary: Create a new KOTItems
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KOTItems'
 *     responses:
 *       201:
 *         description: The created KOTItems object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KOTItems'
 */
router.post("", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await KOTItemsService.create(req.validatedBody);
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
 * /kotitems/{id}:
 *   get:
 *     tags: [KOTItems]
 *     summary: Get a KOTItems by id
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
 *         description: KOTItems object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KOTItems'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await KOTItemsService.get(req.params.id);
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
 * /kotitems/{id}:
 *   put:
 *     tags: [KOTItems]
 *     summary: Update KOTItems with the specified id
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
 *             $ref: '#/components/schemas/KOTItems'
 *     responses:
 *       200:
 *         description: The updated KOTItems object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KOTItems'
 */
router.put("/:id", async (req, res, next) => {
  try {
    const success = await KOTItemsService.update(req.params.id, req.body);
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

/** @swagger
 *
 * /kotitems/{id}:
 *   delete:
 *     tags: [KOTItems]
 *     summary: Delete KOTItems with the specified id
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
router.delete("/:id", async (req, res, next) => {
  try {
    const { status } = req.query;
    const success = await KOTItemsService.delete(req.params.id, status);
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
