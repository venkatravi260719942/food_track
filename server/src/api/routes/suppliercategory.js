import { Router } from "express";

import SupplierCategoryService from "../../services/suppliercategory.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/suppliercategory.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: SupplierCategory
 *   description: API for managing SupplierCategory objects
 *
 * /supplier-category:
 *   get:
 *     tags: [SupplierCategory]
 *     summary: Get all the SupplierCategory objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of SupplierCategory objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SupplierCategory'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await SupplierCategoryService.list();
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
 * /supplier-category:
 *   post:
 *     tags: [SupplierCategory]
 *     summary: Create a new SupplierCategory
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SupplierCategory'
 *     responses:
 *       201:
 *         description: The created SupplierCategory object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierCategory'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await SupplierCategoryService.create(req.validatedBody);
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
 * /supplier-category/{id}:
 *   get:
 *     tags: [SupplierCategory]
 *     summary: Get a SupplierCategory by id
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
 *         description: SupplierCategory object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierCategory'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await SupplierCategoryService.get(req.params.id);
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
 * /supplier-category/{id}:
 *   put:
 *     tags: [SupplierCategory]
 *     summary: Update SupplierCategory with the specified id
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
 *             $ref: '#/components/schemas/SupplierCategory'
 *     responses:
 *       200:
 *         description: The updated SupplierCategory object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierCategory'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await SupplierCategoryService.update(
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
 * /supplier-category/{id}:
 *   delete:
 *     tags: [SupplierCategory]
 *     summary: Delete SupplierCategory with the specified id
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
    const success = await SupplierCategoryService.delete(req.params.id);
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
