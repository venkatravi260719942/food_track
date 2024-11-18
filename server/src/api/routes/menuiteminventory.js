import { Router } from "express";

import MenuItemInventoryService from "../../services/menuiteminventory.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/menuiteminventory.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: MenuItemInventory
 *   description: API for managing MenuItemInventory objects
 *
 * /menu-item-inventory:
 *   get:
 *     tags: [MenuItemInventory]
 *     summary: Get all the MenuItemInventory objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of MenuItemInventory objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItemInventory'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await MenuItemInventoryService.list();
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
 * /menu-item-inventory:
 *   post:
 *     tags: [MenuItemInventory]
 *     summary: Create a new MenuItemInventory
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItemInventory'
 *     responses:
 *       201:
 *         description: The created MenuItemInventory object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItemInventory'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await MenuItemInventoryService.create(req.validatedBody);
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
 * /menu-item-inventory/{id}:
 *   get:
 *     tags: [MenuItemInventory]
 *     summary: Get a MenuItemInventory by id
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
 *         description: MenuItemInventory object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItemInventory'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await MenuItemInventoryService.get(req.params.id);
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
 * /menu-item-inventory/{id}:
 *   put:
 *     tags: [MenuItemInventory]
 *     summary: Update MenuItemInventory with the specified id
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
 *             $ref: '#/components/schemas/MenuItemInventory'
 *     responses:
 *       200:
 *         description: The updated MenuItemInventory object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItemInventory'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await MenuItemInventoryService.update(
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
 * /menu-item-inventory/{id}:
 *   delete:
 *     tags: [MenuItemInventory]
 *     summary: Delete MenuItemInventory with the specified id
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
    const success = await MenuItemInventoryService.delete(req.params.id);
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
