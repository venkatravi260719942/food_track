import { Router } from 'express';

import ReceiptsService from '../../services/receipts.js';
import { requireUser } from '../middlewares/auth.js';
import { requireSchema, requireValidId } from '../middlewares/validate.js';
import schema from '../schemas/receipts.js';

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Receipts
 *   description: API for managing Receipts objects
 *
 * /receipts:
 *   get:
 *     tags: [Receipts]
 *     summary: Get all the Receipts objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Receipts objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Receipts'
 */
router.get('', async (req, res, next) => {
  try {
    const results = await ReceiptsService.list();
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
 * /receipts:
*   post:
 *     tags: [Receipts]
 *     summary: Create a new Receipts
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Receipts'
 *     responses:
 *       201:
 *         description: The created Receipts object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receipts'
 */
router.post('', requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await ReceiptsService.create(req.validatedBody);
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
 * /receipts/{id}:
 *   get:
 *     tags: [Receipts]
 *     summary: Get a Receipts by id
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
 *         description: Receipts object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receipts'
 */
router.get('/:id', requireValidId, async (req, res, next) => {
  try {
    const obj = await ReceiptsService.get(req.params.id);
    if (obj) {
      res.json(obj);
    } else {
      res.status(404).json({ error: 'Resource not found' });
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
 * /receipts/{id}:
 *   put:
 *     tags: [Receipts]
 *     summary: Update Receipts with the specified id
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
 *             $ref: '#/components/schemas/Receipts'
 *     responses:
 *       200:
 *         description: The updated Receipts object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receipts'
 */
router.put('/:id', requireValidId, requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await ReceiptsService.update(req.params.id, req.validatedBody);
    if (obj) {
      res.status(200).json(obj);
    } else {
      res.status(404).json({ error: 'Resource not found' });
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
 * /receipts/{id}:
 *   delete:
 *     tags: [Receipts]
 *     summary: Delete Receipts with the specified id
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
router.delete('/:id', requireValidId, async (req, res, next) => {
  try {
    const success = await ReceiptsService.delete(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Not found, nothing deleted' });
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
