import { Router } from "express";

import ProductService from "../../services/product.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/product.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Product
 *   description: API for managing Product objects
 *
 * /product:
 *   get:
 *     tags: [Product]
 *     summary: Get all the Product objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Product objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await ProductService.list();

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
 * /product:
 *   post:
 *     tags: [Product]
 *     summary: Create a new Product
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The created Product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await ProductService.create(req.validatedBody);
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
 * /product/{id}:
 *   get:
 *     tags: [Product]
 *     summary: Get a Product by id
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
 *         description: Product object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await ProductService.get(req.params.id);
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
router.get("/organisationId/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await ProductService.getByOrganisationId(req.params.id);
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
 * /product/{id}:
 *   put:
 *     tags: [Product]
 *     summary: Update Product with the specified id
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
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The updated Product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.put("/:id", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await ProductService.update(req.params.id, req.validatedBody);
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
 * /product/{id}:
 *   delete:
 *     tags: [Product]
 *     summary: Delete Product with the specified id
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
    const success = await ProductService.delete(req.params.id);
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
import aws from "aws-sdk";
import multer from "multer";
import multers3 from "multer-s3";

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
    bucket: "tranxify",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.originalname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname); // Use a unique key for the file
    },
  }),
});

router.post(
  "/upload-product-image",
  upload.single("file"),
  function (req, res, next) {
    const key = req.file.key;
    const imageUrl = `https://${process.env.AWS_BUCKETNAME}.${process.env.AWS_ENDPOINT}/${key}`;
    res.send({
      msg: "Successfully uploaded file!",
      fileName: key,
      imageUrl: imageUrl,
    });
  }
);
router.get("/:organisationId/:branchId", async (req, res, next) => {
  try {
    const results = await ProductService.inventory(
      req.params.organisationId,
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
export default router;
