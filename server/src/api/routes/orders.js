import { Router } from "express";

import OrdersService from "../../services/orders.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/orders.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Orders
 *   description: API for managing Orders objects
 *
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get all the Orders objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Orders objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Orders'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await OrdersService.list();
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
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new Orders
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Orders'
 *     responses:
 *       201:
 *         description: The created Orders object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orders'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await OrdersService.create(req.validatedBody);
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
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get a Orders by id
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
 *         description: Orders object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orders'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await OrdersService.get(req.params.id);
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
 * /orders/{id}:
 *   put:
 *     tags: [Orders]
 *     summary: Update Orders with the specified id
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
 *             $ref: '#/components/schemas/Orders'
 *     responses:
 *       200:
 *         description: The updated Orders object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orders'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await OrdersService.update(req.params.id, req.validatedBody);
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
 * /orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Delete Orders with the specified id
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
    const success = await OrdersService.delete(req.params.id);
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
