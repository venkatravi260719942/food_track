import { Router } from 'express';

import KOTService from '../../services/kot.js';
import { requireUser } from '../middlewares/auth.js';
import { requireSchema, requireValidId } from '../middlewares/validate.js';
import schema from '../schemas/kot.js';

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: KOT
 *   description: API for managing KOT objects
 *
 * /kot:
 *   get:
 *     tags: [KOT]
 *     summary: Get all the KOT objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of KOT objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/KOT'
 */
router.get('', async (req, res, next) => {
  try {
    const results = await KOTService.list();
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
 * /kot:
*   post:
 *     tags: [KOT]
 *     summary: Create a new KOT
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KOT'
 *     responses:
 *       201:
 *         description: The created KOT object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KOT'
 */
router.post('', requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await KOTService.create(req.validatedBody);
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
 * /kot/{id}:
 *   get:
 *     tags: [KOT]
 *     summary: Get a KOT by id
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
 *         description: KOT object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KOT'
 */
router.get('/:id', requireValidId, async (req, res, next) => {
  try {
    const obj = await KOTService.get(req.params.id);
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
 * /kot/{id}:
 *   put:
 *     tags: [KOT]
 *     summary: Update KOT with the specified id
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
 *             $ref: '#/components/schemas/KOT'
 *     responses:
 *       200:
 *         description: The updated KOT object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KOT'
 */
router.put('/:id', requireValidId, requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await KOTService.update(req.params.id, req.validatedBody);
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
 * /kot/{id}:
 *   delete:
 *     tags: [KOT]
 *     summary: Delete KOT with the specified id
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
    const success = await KOTService.delete(req.params.id);
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
