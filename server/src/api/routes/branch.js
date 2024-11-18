import { Router } from "express";

import BranchService from "../../services/branch.js";
import { requireUser } from "../middlewares/auth.js";
import { PrismaClient } from "@prisma/client";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/branch.js";

const prisma = new PrismaClient();
const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Branch
 *   description: API for managing Branch objects
 *
 * /branch:
 *   get:
 *     tags: [Branch]
 *     summary: Get all the Branch objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Branch objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Branch'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await BranchService.list();
    res.json(results);
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});
router.get("/branchlocation/:branchId", async (req, res, next) => {
  try {
    const results = await BranchService.getLocationbasedonCountryId(
      req.params.branchId
    );
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
 * /branch:
 *   post:
 *     tags: [Branch]
 *     summary: Create a new Branch
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Branch'
 *     responses:
 *       201:
 *         description: The created Branch object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await BranchService.create(req.validatedBody);
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
 * /branch/{id}:
 *   get:
 *     tags: [Branch]
 *     summary: Get a Branch by id
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
 *         description: Branch object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 */
router.get("/organisationId/:id", async (req, res, next) => {
  try {
    const obj = await BranchService.getBranchBasedOnOrganisationId(
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

router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await BranchService.get(req.params.id);
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
 * /branch/{id}:
 *   put:
 *     tags: [Branch]
 *     summary: Update Branch with the specified id
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
 *             $ref: '#/components/schemas/Branch'
 *     responses:
 *       200:
 *         description: The updated Branch object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      // const id = parseInt();
      const obj = await BranchService.update(req.params.id, req.validatedBody);
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
 * /branch/{id}:
 *   delete:
 *     tags: [Branch]
 *     summary: Delete Branch with the specified id
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
    const success = await BranchService.delete(req.params.id);
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

//profile picture update
import aws from "aws-sdk";
import multer from "multer";
import multers3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
dotenv.config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESSKEYID,
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  signatureVersion: "v4",
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
});

const upload = multer({
  storage: multers3({
    s3: s3,
    bucket: process.env.AWS_BUCKETNAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.originalname });
    },
    key: function (req, file, cb) {
      const ext = file.originalname.split(".").pop(); // Get the file extension
      const key = `${uuidv4()}.${ext}`; // Generate a UUID-based key with the original extension
      cb(null, key);
    },
  }),
});

router.post("/upload-image", upload.single("file"), function (req, res) {
  const key = req.file.key;
  const imageUrl = `https://${process.env.AWS_BUCKETNAME}.${process.env.AWS_ENDPOINT}/${key}`;
  res.send({
    msg: "Successfully uploaded file!",
    fileName: key,
    imageUrl: imageUrl,
  });
});

export default router;
