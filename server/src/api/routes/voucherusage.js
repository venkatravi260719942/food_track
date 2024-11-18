import { Router } from 'express';

import VoucherUsageService from '../../services/voucherusage.js';
import { requireUser } from '../middlewares/auth.js';
import { requireSchema, requireValidId } from '../middlewares/validate.js';
import schema from '../schemas/voucherusage.js';

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: VoucherUsage
 *   description: API for managing VoucherUsage objects
 *
 * /voucher-usage:
 *   get:
 *     tags: [VoucherUsage]
 *     summary: Get all the VoucherUsage objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of VoucherUsage objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VoucherUsage'
 */
router.get('', async (req, res, next) => {
  try {
    const results = await VoucherUsageService.list();
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
 * /voucher-usage:
*   post:
 *     tags: [VoucherUsage]
 *     summary: Create a new VoucherUsage
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VoucherUsage'
 *     responses:
 *       201:
 *         description: The created VoucherUsage object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoucherUsage'
 */
router.post('', requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await VoucherUsageService.create(req.validatedBody);
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
 * /voucher-usage/{id}:
 *   get:
 *     tags: [VoucherUsage]
 *     summary: Get a VoucherUsage by id
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
 *         description: VoucherUsage object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoucherUsage'
 */
router.get('/:id', requireValidId, async (req, res, next) => {
  try {
    const obj = await VoucherUsageService.get(req.params.id);
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
 * /voucher-usage/{id}:
 *   put:
 *     tags: [VoucherUsage]
 *     summary: Update VoucherUsage with the specified id
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
 *             $ref: '#/components/schemas/VoucherUsage'
 *     responses:
 *       200:
 *         description: The updated VoucherUsage object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoucherUsage'
 */
router.put('/:id', requireValidId, requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await VoucherUsageService.update(req.params.id, req.validatedBody);
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
 * /voucher-usage/{id}:
 *   delete:
 *     tags: [VoucherUsage]
 *     summary: Delete VoucherUsage with the specified id
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
    const success = await VoucherUsageService.delete(req.params.id);
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
