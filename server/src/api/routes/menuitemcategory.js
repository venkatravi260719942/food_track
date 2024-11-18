import { Router } from "express";

import MenuItemCategoryService from "../../services/menuitemcategory.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/menuitemcategory.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: MenuItemCategory
 *   description: API for managing MenuItemCategory objects
 *
 * /menu-item-category:
 *   get:
 *     tags: [MenuItemCategory]
 *     summary: Get all the MenuItemCategory objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of MenuItemCategory objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItemCategory'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await MenuItemCategoryService.list();
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
 * /menu-item-category:
 *   post:
 *     tags: [MenuItemCategory]
 *     summary: Create a new MenuItemCategory
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItemCategory'
 *     responses:
 *       201:
 *         description: The created MenuItemCategory object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItemCategory'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await MenuItemCategoryService.create(req.validatedBody);
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
 * /menu-item-category/{id}:
 *   get:
 *     tags: [MenuItemCategory]
 *     summary: Get a MenuItemCategory by id
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
 *         description: MenuItemCategory object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItemCategory'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await MenuItemCategoryService.getCategoryBasedOnBranch(
      req.params.id
    );
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
 * /menu-item-category/{id}:
 *   put:
 *     tags: [MenuItemCategory]
 *     summary: Update MenuItemCategory with the specified id
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
 *             $ref: '#/components/schemas/MenuItemCategory'
 *     responses:
 *       200:
 *         description: The updated MenuItemCategory object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItemCategory'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await MenuItemCategoryService.update(
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
 * /menu-item-category/{id}:
 *   delete:
 *     tags: [MenuItemCategory]
 *     summary: Delete MenuItemCategory with the specified id
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
    const success = await MenuItemCategoryService.delete(req.params.id);
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
