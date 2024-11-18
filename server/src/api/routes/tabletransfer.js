import { Router } from 'express';

import TableTransferService from '../../services/tabletransfer.js';
import { requireUser } from '../middlewares/auth.js';
import { requireSchema, requireValidId } from '../middlewares/validate.js';
import schema from '../schemas/tabletransfer.js';

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: TableTransfer
 *   description: API for managing TableTransfer objects
 *
 * /table-transfer:
 *   get:
 *     tags: [TableTransfer]
 *     summary: Get all the TableTransfer objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of TableTransfer objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TableTransfer'
 */
router.get('', async (req, res, next) => {
  try {
    const results = await TableTransferService.list();
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
 * /table-transfer:
*   post:
 *     tags: [TableTransfer]
 *     summary: Create a new TableTransfer
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TableTransfer'
 *     responses:
 *       201:
 *         description: The created TableTransfer object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TableTransfer'
 */
router.post('', requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await TableTransferService.create(req.validatedBody);
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
 * /table-transfer/{id}:
 *   get:
 *     tags: [TableTransfer]
 *     summary: Get a TableTransfer by id
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
 *         description: TableTransfer object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TableTransfer'
 */
router.get('/:id', requireValidId, async (req, res, next) => {
  try {
    const obj = await TableTransferService.get(req.params.id);
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
 * /table-transfer/{id}:
 *   put:
 *     tags: [TableTransfer]
 *     summary: Update TableTransfer with the specified id
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
 *             $ref: '#/components/schemas/TableTransfer'
 *     responses:
 *       200:
 *         description: The updated TableTransfer object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TableTransfer'
 */
router.put('/:id', requireValidId, requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await TableTransferService.update(req.params.id, req.validatedBody);
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
 * /table-transfer/{id}:
 *   delete:
 *     tags: [TableTransfer]
 *     summary: Delete TableTransfer with the specified id
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
    const success = await TableTransferService.delete(req.params.id);
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
