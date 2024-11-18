import { Router } from "express";

import TaxService from "../../services/tax.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/tax.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Tax
 *   description: API for managing Tax objects
 *
 * /tax:
 *   get:
 *     tags: [Tax]
 *     summary: Get all the Tax objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Tax objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tax'
 */
router.get("", async (req, res, next) => {
  try {
    const results = await TaxService.list();
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
 * /tax:
 *   post:
 *     tags: [Tax]
 *     summary: Create a new Tax
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tax'
 *     responses:
 *       201:
 *         description: The created Tax object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tax'
 */
router.post("", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await TaxService.create(req.validatedBody);
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
 * /tax/{id}:
 *   get:
 *     tags: [Tax]
 *     summary: Get a Tax by id
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
 *         description: Tax object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tax'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await TaxService.get(req.params.id);
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
 * /tax/{id}:
 *   put:
 *     tags: [Tax]
 *     summary: Update Tax with the specified id
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
 *             $ref: '#/components/schemas/Tax'
 *     responses:
 *       200:
 *         description: The updated Tax object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tax'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await TaxService.update(req.params.id, req.validatedBody);
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
 * /tax/{id}:
 *   delete:
 *     tags: [Tax]
 *     summary: Delete Tax with the specified id
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
    const success = await TaxService.delete(req.params.id);
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
