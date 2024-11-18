import { Router } from "express";

import BillsService from "../../services/bills.js";
import SplitBillsService from "../../services/splitbills.js";
import BillItemsService from "../../services/billitems.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/bills.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Bills
 *   description: API for managing Bills objects
 *
 * /bills:
 *   get:
 *     tags: [Bills]
 *     summary: Get all the Bills objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Bills objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bills'
 */
router.get("", async (req, res, next) => {
  try {
    const results = await BillsService.list();
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
 * /bills:
 *   post:
 *     tags: [Bills]
 *     summary: Create a new Bills
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bills'
 *     responses:
 *       201:
 *         description: The created Bills object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bills'
 */
router.post("", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await BillsService.create(req.validatedBody);
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
 * /bills/{id}:
 *   get:
 *     tags: [Bills]
 *     summary: Get a Bills by id
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
 *         description: Bills object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bills'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await BillsService.get(req.params.id);
    if (obj) {
      res.json(obj);
    } else {
      res.status(404).json({ error: "Resource not found" });
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
 * /bills/{id}:
 *   put:
 *     tags: [Bills]
 *     summary: Update Bills with the specified id
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
 *             $ref: '#/components/schemas/Bills'
 *     responses:
 *       200:
 *         description: The updated Bills object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bills'
 */

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { bill } = req.body;
  const { splitType, numberOfSplits } = bill;

  try {
    // Start a Prisma transaction
    const result = await prisma.$transaction(async (transactionPrisma) => {
      // 1. Update the bill with the provided data
      const updatedBill = await BillsService.updateForSplitBillEqually(
        id,
        bill,
        transactionPrisma
      );
      if (!updatedBill) {
        throw new Error("Bill not found");
      }

      // Get the total amount from the updated bill
      const totalAmount = updatedBill.totalAmount; // Adjusted to correctly access totalAmount

      // 2. Create split bills entries and capture their IDs
      const splitBillIds = [];
      for (let i = 0; i < numberOfSplits; i++) {
        const data = {
          originalBillId: updatedBill.billId,
          splitBillType: splitType, // Use splitType from bill
        };
        const splitBill = await SplitBillsService.create(
          data,
          transactionPrisma
        );
        splitBillIds.push(splitBill.id);
      }

      // 3. Create the bill items entries, equally dividing the amount
      const amountPerSplit = totalAmount / numberOfSplits;

      const createdBillItems = await BillItemsService.createBillItems({
        splitBillIds,
        amountPerSplit,
        transactionPrisma,
      });

      // Return the total amount and created bill items
      return { createdBillItems };
    });

    // If transaction succeeds, return the total amount of the updated bill
    res.status(200).json(result);
  } catch (error) {
    console.error("Error processing bill:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the bill." });
  }
});

/** @swagger
 *
 * /bills/{id}:
 *   delete:
 *     tags: [Bills]
 *     summary: Delete Bills with the specified id
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

router.delete("/:billId", async (req, res) => {
  const { billId } = req.params;

  try {
    // Start a Prisma transaction to ensure all deletions happen atomically
    await prisma.$transaction(async (transactionPrisma) => {
      // 1. Find all related split bills for the given original bill
      const splitBills = await SplitBillsService.findByOriginalBillId(
        billId,
        transactionPrisma
      );

      if (!splitBills || splitBills.length === 0) {
        throw new Error("No split bills found for the provided bill ID.");
      }

      const splitBillIds = splitBills.map((splitBill) => splitBill.id);

      // 2. Delete all related bill items for each split bill
      await BillItemsService.deleteBySplitBillIds(
        splitBillIds,
        transactionPrisma
      );
      // 3. Delete all the split bills for the given bill
      await SplitBillsService.deleteByBillId(billId, transactionPrisma);
      // 4. Finally, delete the original bill
      await BillsService.updateForRevertSplit(billId, transactionPrisma);
    });

    // If everything succeeds, return a success response
    res
      .status(200)
      .json({ message: "Bill and associated records deleted successfully." });
  } catch (error) {
    console.error("Error deleting bill:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the bill." });
  }
});

export default router;
