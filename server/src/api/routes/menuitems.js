import { Router } from "express";

import MenuItemService from "../../services/menuitem.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/menuitem.js";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import MenuItemInventoryService from "../../services/menuiteminventory.js";

const router = Router();
const prisma = new PrismaClient();
router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: MenuItem
 *   description: API for managing MenuItem objects
 *
 * /menu-item:
 *   get:
 *     tags: [MenuItem]
 *     summary: Get all the MenuItem objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of MenuItem objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await MenuItemService.list();
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
 * /menu-item:
 *   post:
 *     tags: [MenuItem]
 *     summary: Create a new MenuItem
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItem'
 *     responses:
 *       201:
 *         description: The created MenuItem object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 */

router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const referencedTableId = uuidv4();

    const data = {
      menuItemInventoryId: referencedTableId,
      availableUnits: 0,
      createdBy: req.validatedBody.createdBy,
      createdDate: req.validatedBody.createdDate,
      updatedBy: req.validatedBody.createdBy,
      updatedDate: req.validatedBody.updatedDate,
    };

    const obj = await MenuItemInventoryService.create(data);
    if (obj) {
      const resobj = await MenuItemService.create({
        ...req.validatedBody,
        menuItemInventoryId: referencedTableId,
      });
      res.status(201).json(resobj);
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
 * /menu-item/{id}:
 *   get:
 *     tags: [MenuItem]
 *     summary: Get a MenuItem by id
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
 *         description: MenuItem object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 */

router.get("/branchId/:id", async (req, res, next) => {
  try {
    const obj = await MenuItemService.getBranchId(req.params.id);
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

router.get("/:id/:branchId", async (req, res, next) => {
  try {
    const obj = await MenuItemService.getMenuItemBasedOnCategory(
      req.params.id,
      req.params.branchId
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

//endpoint to get Id based data
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const obj = await MenuItemService.getItemId(id);
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
 * /menu-item/{id}:
 *   put:
 *     tags: [MenuItem]
 *     summary: Update MenuItem with the specified id
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
 *             $ref: '#/components/schemas/MenuItem'
 *     responses:
 *       200:
 *         description: The updated MenuItem object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 */
router.put("/:id", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await MenuItemService.update(req.params.id, req.validatedBody);
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
});

/** @swagger
 *
 * /menu-item/{id}:
 *   delete:
 *     tags: [MenuItem]
 *     summary: Delete MenuItem with the specified id
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
router.delete("/:id", async (req, res, next) => {
  try {
    const success = await MenuItemService.delete(req.params.id);
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
