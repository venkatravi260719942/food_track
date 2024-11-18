import { Router } from "express";

import TableLayoutService from "../../services/tablelayout.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/tablelayout.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: TableLayout
 *   description: API for managing TableLayout objects
 *
 * /table-layout:
 *   get:
 *     tags: [TableLayout]
 *     summary: Get all the TableLayout objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of TableLayout objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TableLayout'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await TableLayoutService.list();
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
 * /table-layout:
 *   post:
 *     tags: [TableLayout]
 *     summary: Create a new TableLayout
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TableLayout'
 *     responses:
 *       201:
 *         description: The created TableLayout object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TableLayout'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await TableLayoutService.create(req.body);
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
 * /table-layout/{id}:
 *   get:
 *     tags: [TableLayout]
 *     summary: Get a TableLayout by id
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
 *         description: TableLayout object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TableLayout'
 */
router.get("/:id", async (req, res, next) => {
  try {
    const obj = await TableLayoutService.get(req.params.id);
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
 * /table-layout/{id}:
 *   put:
 *     tags: [TableLayout]
 *     summary: Update TableLayout with the specified id
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
 *             $ref: '#/components/schemas/TableLayout'
 *     responses:
 *       200:
 *         description: The updated TableLayout object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TableLayout'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await TableLayoutService.update(
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
 * /table-layout/{id}:
 *   delete:
 *     tags: [TableLayout]
 *     summary: Delete TableLayout with the specified id
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
    const success = await TableLayoutService.delete(req.params.id);
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
