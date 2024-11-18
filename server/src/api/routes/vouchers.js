import { Router } from 'express';

import VouchersService from '../../services/vouchers.js';
import { requireUser } from '../middlewares/auth.js';
import { requireSchema, requireValidId } from '../middlewares/validate.js';
import schema from '../schemas/vouchers.js';

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Vouchers
 *   description: API for managing Vouchers objects
 *
 * /vouchers:
 *   get:
 *     tags: [Vouchers]
 *     summary: Get all the Vouchers objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Vouchers objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vouchers'
 */
router.get('', async (req, res, next) => {
  try {
    const results = await VouchersService.list();
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
 * /vouchers:
*   post:
 *     tags: [Vouchers]
 *     summary: Create a new Vouchers
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vouchers'
 *     responses:
 *       201:
 *         description: The created Vouchers object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vouchers'
 */
router.post('', requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await VouchersService.create(req.validatedBody);
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
 * /vouchers/{id}:
 *   get:
 *     tags: [Vouchers]
 *     summary: Get a Vouchers by id
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
 *         description: Vouchers object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vouchers'
 */
router.get('/:id', requireValidId, async (req, res, next) => {
  try {
    const obj = await VouchersService.get(req.params.id);
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
 * /vouchers/{id}:
 *   put:
 *     tags: [Vouchers]
 *     summary: Update Vouchers with the specified id
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
 *             $ref: '#/components/schemas/Vouchers'
 *     responses:
 *       200:
 *         description: The updated Vouchers object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vouchers'
 */
router.put('/:id', requireValidId, requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await VouchersService.update(req.params.id, req.validatedBody);
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
 * /vouchers/{id}:
 *   delete:
 *     tags: [Vouchers]
 *     summary: Delete Vouchers with the specified id
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
    const success = await VouchersService.delete(req.params.id);
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
