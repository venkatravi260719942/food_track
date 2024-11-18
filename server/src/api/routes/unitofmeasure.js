import { Router } from "express";

import UnitOfMeasureService from "../../services/unitofmeasure.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/unitofmeasure.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: UnitOfMeasure
 *   description: API for managing UnitOfMeasure objects
 *
 * /unit-of-measure:
 *   get:
 *     tags: [UnitOfMeasure]
 *     summary: Get all the UnitOfMeasure objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of UnitOfMeasure objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UnitOfMeasure'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await UnitOfMeasureService.list();
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
 * /unit-of-measure:
 *   post:
 *     tags: [UnitOfMeasure]
 *     summary: Create a new UnitOfMeasure
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnitOfMeasure'
 *     responses:
 *       201:
 *         description: The created UnitOfMeasure object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasure'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await UnitOfMeasureService.create(req.validatedBody);
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
 * /unit-of-measure/{id}:
 *   get:
 *     tags: [UnitOfMeasure]
 *     summary: Get a UnitOfMeasure by id
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
 *         description: UnitOfMeasure object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasure'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await UnitOfMeasureService.get(req.params.id);
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
 * /unit-of-measure/{id}:
 *   put:
 *     tags: [UnitOfMeasure]
 *     summary: Update UnitOfMeasure with the specified id
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
 *             $ref: '#/components/schemas/UnitOfMeasure'
 *     responses:
 *       200:
 *         description: The updated UnitOfMeasure object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasure'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await UnitOfMeasureService.update(
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
 * /unit-of-measure/{id}:
 *   delete:
 *     tags: [UnitOfMeasure]
 *     summary: Delete UnitOfMeasure with the specified id
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
    const success = await UnitOfMeasureService.delete(req.params.id);
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
