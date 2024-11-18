import { Router, request } from "express";

import SupplierService from "../../services/supplier.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/supplier.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Supplier
 *   description: API for managing Supplier objects
 *
 * /supplier:
 *   get:
 *     tags: [Supplier]
 *     summary: Get all the Supplier objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Supplier objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 */
router.get("/:organisationId", async (req, res, next) => {
  try {
    const results = await SupplierService.list(req.params.organisationId);

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
 * /supplier:
 *   post:
 *     tags: [Supplier]
 *     summary: Create a new Supplier
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: The created Supplier object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 */
// router.post("", async (req, res, next) => {
//   console.log(req.body);
//   try {
//     const obj = await SupplierService.create(req.body);
//     res.status(201).json(obj);
//   } catch (error) {
//     if (error.isClientError()) {
//       res.status(400).json({ error });
//     } else {
//       next(error);
//     }
//   }
// });
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await SupplierService.create(req.validatedBody);
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
 * /supplier/{id}:
 *   get:
 *     tags: [Supplier]
 *     summary: Get a Supplier by id
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
 *         description: Supplier object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 */
router.get("/supplierId/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await SupplierService.get(req.params.id);
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
 * /supplier/{id}:
 *   put:
 *     tags: [Supplier]
 *     summary: Update Supplier with the specified id
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
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: The updated Supplier object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 */
router.put("/:supplierId", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await SupplierService.update(
      req.params.supplierId,
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
});

/** @swagger
 *
 * /supplier/{id}:
 *   delete:
 *     tags: [Supplier]
 *     summary: Delete Supplier with the specified id
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
    const success = await SupplierService.delete(req.params.id);
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
