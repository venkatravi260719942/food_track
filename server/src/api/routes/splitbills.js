import { Router } from "express";

import SplitBillsService from "../../services/splitbills.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/splitbills.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: SplitBills
 *   description: API for managing SplitBills objects
 *
 * /split-bills:
 *   get:
 *     tags: [SplitBills]
 *     summary: Get all the SplitBills objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of SplitBills objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SplitBills'
 */
router.get("", async (req, res, next) => {
  try {
    const results = await SplitBillsService.list();
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
 * /split-bills:
 *   post:
 *     tags: [SplitBills]
 *     summary: Create a new SplitBills
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SplitBills'
 *     responses:
 *       201:
 *         description: The created SplitBills object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SplitBills'
 */
router.post("", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await SplitBillsService.create(req.validatedBody);
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
 * /split-bills/{id}:
 *   get:
 *     tags: [SplitBills]
 *     summary: Get a SplitBills by id
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
 *         description: SplitBills object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SplitBills'
 */
router.get("/:id", async (req, res, next) => {
  try {
    const obj = await SplitBillsService.get(req.params.id);
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
 * /split-bills/{id}:
 *   put:
 *     tags: [SplitBills]
 *     summary: Update SplitBills with the specified id
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
 *             $ref: '#/components/schemas/SplitBills'
 *     responses:
 *       200:
 *         description: The updated SplitBills object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SplitBills'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await SplitBillsService.update(
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
 * /split-bills/{id}:
 *   delete:
 *     tags: [SplitBills]
 *     summary: Delete SplitBills with the specified id
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
    const success = await SplitBillsService.delete(req.params.id);
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
