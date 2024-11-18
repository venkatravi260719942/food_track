import { Router } from "express";

import UserSettingService from "../../services/usersetting.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/usersetting.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: UserSetting
 *   description: API for managing UserSetting objects
 *
 * /user-setting:
 *   get:
 *     tags: [UserSetting]
 *     summary: Get all the UserSetting objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of UserSetting objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserSetting'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await UserSettingService.list();
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
 * /user-setting:
 *   post:
 *     tags: [UserSetting]
 *     summary: Create a new UserSetting
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSetting'
 *     responses:
 *       201:
 *         description: The created UserSetting object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSetting'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await UserSettingService.create(req.validatedBody);
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
 * /user-setting/{id}:
 *   get:
 *     tags: [UserSetting]
 *     summary: Get a UserSetting by id
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
 *         description: UserSetting object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSetting'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await UserSettingService.get(req.params.id);
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
 * /user-setting/{id}:
 *   put:
 *     tags: [UserSetting]
 *     summary: Update UserSetting with the specified id
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
 *             $ref: '#/components/schemas/UserSetting'
 *     responses:
 *       200:
 *         description: The updated UserSetting object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSetting'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await UserSettingService.update(
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
 * /user-setting/{id}:
 *   delete:
 *     tags: [UserSetting]
 *     summary: Delete UserSetting with the specified id
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
    const success = await UserSettingService.delete(req.params.id);
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
