import { Router } from "express";
import InventoryService from "../../services/inventory.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/inventory.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Inventory
 *   description: API for managing Inventory objects
 *
 * /inventory:
 *   get:
 *     tags: [Inventory]
 *     summary: Get all the Inventory objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Inventory objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inventory'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await InventoryService.list();
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
 * /inventory:
 *   post:
 *     tags: [Inventory]
 *     summary: Create a new Inventory
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       201:
 *         description: The created Inventory object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await InventoryService.create(req.validatedBody);
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
 * /inventory/{id}:
 *   get:
 *     tags: [Inventory]
 *     summary: Get a Inventory by id
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
 *         description: Inventory object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 */
router.get("/:branchId/:productId", async (req, res, next) => {
  try {
    const obj = await InventoryService.get(
      req.params.branchId,
      req.params.productId
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
// router.get("/:branchId", async (req, res, next) => {
//   try {
//     const obj = await InventoryService.Inventorybranch(req.params.branchId);
//     if (obj) {
//       res.json(obj);
//     } else {
//       res.status(404).json({ error: "Resource not found" });
//     }
//   } catch (error) {
//     console.log(error);
//     if (error.isClientError()) {
//       res.status(400).json({ error });
//     } else {
//       next(error);
//     }
//   }
// });
router.get("/:branchId", async (req, res, next) => {
  try {
    const { branchId } = req.params; // Get branchId from the URL parameters
    const { stockLevel } = req.query;

    let obj;

    // Check if stockLevel is provided
    if (stockLevel) {
      obj = await InventoryService.getInventoryByStockLevel(
        branchId,
        stockLevel
      );
    } else {
      obj = await InventoryService.Inventorybranch(branchId);
    }

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
 * /inventory/{id}:
 *   put:
 *     tags: [Inventory]
 *     summary: Update Inventory with the specified id
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
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       200:
 *         description: The updated Inventory object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 */
router.put(
  "/:branchId/:productId",
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await InventoryService.update(
        req.params.branchId,
        req.params.productId,
        req.body
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
 * /inventory/{id}:
 *   delete:
 *     tags: [Inventory]
 *     summary: Delete Inventory with the specified id
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
    const success = await InventoryService.delete(req.params.id);
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
