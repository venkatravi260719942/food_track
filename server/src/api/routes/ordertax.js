import { Router } from 'express';

import OrderTaxService from '../../services/ordertax.js';
import { requireUser } from '../middlewares/auth.js';
import { requireSchema, requireValidId } from '../middlewares/validate.js';
import schema from '../schemas/ordertax.js';

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: OrderTax
 *   description: API for managing OrderTax objects
 *
 * /order-tax:
 *   get:
 *     tags: [OrderTax]
 *     summary: Get all the OrderTax objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of OrderTax objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderTax'
 */
router.get('', async (req, res, next) => {
  try {
    const results = await OrderTaxService.list();
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
 * /order-tax:
*   post:
 *     tags: [OrderTax]
 *     summary: Create a new OrderTax
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderTax'
 *     responses:
 *       201:
 *         description: The created OrderTax object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderTax'
 */
router.post('', requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await OrderTaxService.create(req.validatedBody);
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
 * /order-tax/{id}:
 *   get:
 *     tags: [OrderTax]
 *     summary: Get a OrderTax by id
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
 *         description: OrderTax object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderTax'
 */
router.get('/:id', requireValidId, async (req, res, next) => {
  try {
    const obj = await OrderTaxService.get(req.params.id);
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
 * /order-tax/{id}:
 *   put:
 *     tags: [OrderTax]
 *     summary: Update OrderTax with the specified id
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
 *             $ref: '#/components/schemas/OrderTax'
 *     responses:
 *       200:
 *         description: The updated OrderTax object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderTax'
 */
router.put('/:id', requireValidId, requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await OrderTaxService.update(req.params.id, req.validatedBody);
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
 * /order-tax/{id}:
 *   delete:
 *     tags: [OrderTax]
 *     summary: Delete OrderTax with the specified id
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
    const success = await OrderTaxService.delete(req.params.id);
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
