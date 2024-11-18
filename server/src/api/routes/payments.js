import { Router } from 'express';

import PaymentsService from '../../services/payments.js';
import { requireUser } from '../middlewares/auth.js';
import { requireSchema, requireValidId } from '../middlewares/validate.js';
import schema from '../schemas/payments.js';

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Payments
 *   description: API for managing Payments objects
 *
 * /payments:
 *   get:
 *     tags: [Payments]
 *     summary: Get all the Payments objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Payments objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payments'
 */
router.get('', async (req, res, next) => {
  try {
    const results = await PaymentsService.list();
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
 * /payments:
*   post:
 *     tags: [Payments]
 *     summary: Create a new Payments
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payments'
 *     responses:
 *       201:
 *         description: The created Payments object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payments'
 */
router.post('', requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await PaymentsService.create(req.validatedBody);
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
 * /payments/{id}:
 *   get:
 *     tags: [Payments]
 *     summary: Get a Payments by id
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
 *         description: Payments object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payments'
 */
router.get('/:id', requireValidId, async (req, res, next) => {
  try {
    const obj = await PaymentsService.get(req.params.id);
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
 * /payments/{id}:
 *   put:
 *     tags: [Payments]
 *     summary: Update Payments with the specified id
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
 *             $ref: '#/components/schemas/Payments'
 *     responses:
 *       200:
 *         description: The updated Payments object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payments'
 */
router.put('/:id', requireValidId, requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await PaymentsService.update(req.params.id, req.validatedBody);
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
 * /payments/{id}:
 *   delete:
 *     tags: [Payments]
 *     summary: Delete Payments with the specified id
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
    const success = await PaymentsService.delete(req.params.id);
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
