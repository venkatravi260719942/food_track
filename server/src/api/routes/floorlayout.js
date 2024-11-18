import { Router } from "express";

import FloorLayoutService from "../../services/floorlayout.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/floorlayout.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: FloorLayout
 *   description: API for managing FloorLayout objects
 *
 * /floor-layout:
 *   get:
 *     tags: [FloorLayout]
 *     summary: Get all the FloorLayout objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of FloorLayout objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FloorLayout'
 */
router.get("/", async (req, res, next) => {
  try {
    const { noOfChairs, branchId, floorId } = req.query;
    const results = await FloorLayoutService.list(noOfChairs, branchId);
    const tableLayouts = results.flatMap((floor) => floor.TableLayout);

    res.json(tableLayouts);
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
 * /floor-layout:
 *   post:
 *     tags: [FloorLayout]
 *     summary: Create a new FloorLayout
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FloorLayout'
 *     responses:
 *       201:
 *         description: The created FloorLayout object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FloorLayout'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await FloorLayoutService.create(req.validatedBody);
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
 * /floor-layout/{id}:
 *   get:
 *     tags: [FloorLayout]
 *     summary: Get a FloorLayout by id
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
 *         description: FloorLayout object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FloorLayout'
 */
router.get("/:id", async (req, res, next) => {
  try {
    const obj = await FloorLayoutService.get(req.params.id);
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
 * /floor-layout/{id}:
 *   put:
 *     tags: [FloorLayout]
 *     summary: Update FloorLayout with the specified id
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
 *             $ref: '#/components/schemas/FloorLayout'
 *     responses:
 *       200:
 *         description: The updated FloorLayout object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FloorLayout'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await FloorLayoutService.update(
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
 * /floor-layout/{id}:
 *   delete:
 *     tags: [FloorLayout]
 *     summary: Delete FloorLayout with the specified id
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
    const success = await FloorLayoutService.delete(req.params.id);
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
