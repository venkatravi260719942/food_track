import { Router } from "express";

import MenuItemDiningOrderService from "../../services/menuitemdiningorder.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/menuitemdiningorder.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: MenuItemDiningOrder
 *   description: API for managing MenuItemDiningOrder objects
 *
 * /menu-item-dining-order:
 *   get:
 *     tags: [MenuItemDiningOrder]
 *     summary: Get all the MenuItemDiningOrder objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of MenuItemDiningOrder objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItemDiningOrder'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await MenuItemDiningOrderService.list();
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
 * /menu-item-dining-order:
 *   post:
 *     tags: [MenuItemDiningOrder]
 *     summary: Create a new MenuItemDiningOrder
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItemDiningOrder'
 *     responses:
 *       201:
 *         description: The created MenuItemDiningOrder object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItemDiningOrder'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await MenuItemDiningOrderService.create(req.validatedBody);
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
 * /menu-item-dining-order/{id}:
 *   get:
 *     tags: [MenuItemDiningOrder]
 *     summary: Get a MenuItemDiningOrder by id
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
 *         description: MenuItemDiningOrder object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItemDiningOrder'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await MenuItemDiningOrderService.get(req.params.id);
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
 * /menu-item-dining-order/{id}:
 *   put:
 *     tags: [MenuItemDiningOrder]
 *     summary: Update MenuItemDiningOrder with the specified id
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
 *             $ref: '#/components/schemas/MenuItemDiningOrder'
 *     responses:
 *       200:
 *         description: The updated MenuItemDiningOrder object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItemDiningOrder'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await MenuItemDiningOrderService.update(
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
 * /menu-item-dining-order/{id}:
 *   delete:
 *     tags: [MenuItemDiningOrder]
 *     summary: Delete MenuItemDiningOrder with the specified id
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
    const success = await MenuItemDiningOrderService.delete(req.params.id);
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
