import { Router } from "express";

import CompanySizeService from "../../services/companysize.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/companysize.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: CompanySize
 *   description: API for managing CompanySize objects
 *
 * /company-size:
 *   get:
 *     tags: [CompanySize]
 *     summary: Get all the CompanySize objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of CompanySize objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CompanySize'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await CompanySizeService.list();
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
 * /company-size:
 *   post:
 *     tags: [CompanySize]
 *     summary: Create a new CompanySize
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanySize'
 *     responses:
 *       201:
 *         description: The created CompanySize object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanySize'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await CompanySizeService.create(req.validatedBody);
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
 * /company-size/{id}:
 *   get:
 *     tags: [CompanySize]
 *     summary: Get a CompanySize by id
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
 *         description: CompanySize object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanySize'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await CompanySizeService.get(req.params.id);
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
 * /company-size/{id}:
 *   put:
 *     tags: [CompanySize]
 *     summary: Update CompanySize with the specified id
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
 *             $ref: '#/components/schemas/CompanySize'
 *     responses:
 *       200:
 *         description: The updated CompanySize object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanySize'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await CompanySizeService.update(
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
 * /company-size/{id}:
 *   delete:
 *     tags: [CompanySize]
 *     summary: Delete CompanySize with the specified id
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
    const success = await CompanySizeService.delete(req.params.id);
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
