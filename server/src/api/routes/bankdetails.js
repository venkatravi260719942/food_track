import { Router } from "express";

import BankDetailsService from "../../services/bankdetails.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/bankdetails.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: BankDetails
 *   description: API for managing BankDetails objects
 *
 * /bank-details:
 *   get:
 *     tags: [BankDetails]
 *     summary: Get all the BankDetails objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of BankDetails objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BankDetails'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await BankDetailsService.list();
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
 * /bank-details:
 *   post:
 *     tags: [BankDetails]
 *     summary: Create a new BankDetails
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BankDetails'
 *     responses:
 *       201:
 *         description: The created BankDetails object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankDetails'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await BankDetailsService.create(req.validatedBody);
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
 * /bank-details/{id}:
 *   get:
 *     tags: [BankDetails]
 *     summary: Get a BankDetails by id
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
 *         description: BankDetails object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankDetails'
 */
router.get("/:supplierId", async (req, res, next) => {
  try {
    const obj = await BankDetailsService.get(req.params.supplierId);
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
 * /bank-details/{id}:
 *   put:
 *     tags: [BankDetails]
 *     summary: Update BankDetails with the specified id
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
 *             $ref: '#/components/schemas/BankDetails'
 *     responses:
 *       200:
 *         description: The updated BankDetails object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankDetails'
 */
router.put(
  "/:supplierId",

  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await BankDetailsService.update(
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
  }
);

/** @swagger
 *
 * /bank-details/{id}:
 *   delete:
 *     tags: [BankDetails]
 *     summary: Delete BankDetails with the specified id
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
    const success = await BankDetailsService.delete(req.params.id);
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
