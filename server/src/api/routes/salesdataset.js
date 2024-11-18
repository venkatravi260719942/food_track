import { Router } from "express";

import SalesDataSetService from "../../services/salesdataset.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/salesdataset.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: SalesDataSet
 *   description: API for managing SalesDataSet objects
 *
 * /sales-data-set:
 *   get:
 *     tags: [SalesDataSet]
 *     summary: Get all the SalesDataSet objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of SalesDataSet objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SalesDataSet'
 */
router.get("/distinct/:columnName", async (req, res, next) => {
  try {
    const columnName = req.params.columnName;
    const results = await SalesDataSetService.getDistinctMenuItems(columnName);
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
 * /sales-data-set:
 *   post:
 *     tags: [SalesDataSet]
 *     summary: Create a new SalesDataSet
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalesDataSet'
 *     responses:
 *       201:
 *         description: The created SalesDataSet object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesDataSet'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await SalesDataSetService.create(req.validatedBody);
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
 * /sales-data-set/{id}:
 *   get:
 *     tags: [SalesDataSet]
 *     summary: Get a SalesDataSet by id
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
 *         description: SalesDataSet object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesDataSet'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await SalesDataSetService.get(req.params.id);
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
 * /sales-data-set/{id}:
 *   put:
 *     tags: [SalesDataSet]
 *     summary: Update SalesDataSet with the specified id
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
 *             $ref: '#/components/schemas/SalesDataSet'
 *     responses:
 *       200:
 *         description: The updated SalesDataSet object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesDataSet'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await SalesDataSetService.update(
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
 * /sales-data-set/{id}:
 *   delete:
 *     tags: [SalesDataSet]
 *     summary: Delete SalesDataSet with the specified id
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
    const success = await SalesDataSetService.delete(req.params.id);
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
