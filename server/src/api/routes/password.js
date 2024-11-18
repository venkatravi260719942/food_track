import { Router } from "express";

import PasswordService from "../../services/password.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/password.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Password
 *   description: API for managing Password objects
 *
 * /password:
 *   get:
 *     tags: [Password]
 *     summary: Get all the Password objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Password objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Password'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await PasswordService.list();
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
 * /password:
 *   post:
 *     tags: [Password]
 *     summary: Create a new Password
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Password'
 *     responses:
 *       201:
 *         description: The created Password object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Password'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await PasswordService.create(req.validatedBody);
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
 * /password/{id}:
 *   get:
 *     tags: [Password]
 *     summary: Get a Password by id
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
 *         description: Password object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Password'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await PasswordService.get(req.params.id);
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
 * /password/{id}:
 *   put:
 *     tags: [Password]
 *     summary: Update Password with the specified id
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
 *             $ref: '#/components/schemas/Password'
 *     responses:
 *       200:
 *         description: The updated Password object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Password'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await PasswordService.update(
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
 * /password/{id}:
 *   delete:
 *     tags: [Password]
 *     summary: Delete Password with the specified id
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
    const success = await PasswordService.delete(req.params.id);
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
