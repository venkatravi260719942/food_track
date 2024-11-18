import { Router } from "express";

import CountryAndStateService from "../../services/countryandstate.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/countryandstate.js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = Router();

/** @swagger
 *
 * tags:
 *   name: CountryAndState
 *   description: API for managing CountryAndState objects
 *
 * /country-and-state:
 *   get:
 *     tags: [CountryAndState]
 *     summary: Get all the CountryAndState objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of CountryAndState objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CountryAndState'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await CountryAndStateService.list();
    res.json(results);
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

//to get only the country
router.get("/only-country", async (req, res, next) => {
  try {
    const results = await CountryAndStateService.getOnlyCountries();
    res.json(results);
  } catch (error) {
    console.error("Error details:", error);
    if (error instanceof Error && error.name === "ClientError") {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

router.get("/states/:countryId", async (req, res, next) => {
  const { countryId } = req.params;
  try {
    const results = await CountryAndStateService.getStatesByCountryId(
      countryId
    );
    res.json(results);
  } catch (error) {
    console.error("Error details:", error);
    if (error instanceof Error && error.name === "ClientError") {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /country-and-state:
 *   post:
 *     tags: [CountryAndState]
 *     summary: Create a new CountryAndState
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CountryAndState'
 *     responses:
 *       201:
 *         description: The created CountryAndState object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CountryAndState'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await CountryAndStateService.create(req.validatedBody);
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
 * /country-and-state/{id}:
 *   get:
 *     tags: [CountryAndState]
 *     summary: Get a CountryAndState by id
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
 *         description: CountryAndState object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CountryAndState'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await CountryAndStateService.get(req.params.id);
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
 * /country-and-state/{id}:
 *   put:
 *     tags: [CountryAndState]
 *     summary: Update CountryAndState with the specified id
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
 *             $ref: '#/components/schemas/CountryAndState'
 *     responses:
 *       200:
 *         description: The updated CountryAndState object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CountryAndState'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await CountryAndStateService.update(
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
 * /country-and-state/{id}:
 *   delete:
 *     tags: [CountryAndState]
 *     summary: Delete CountryAndState with the specified id
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
    const success = await CountryAndStateService.delete(req.params.id);
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
