import { Router } from "express";

import DiningOrderService from "../../services/diningorder.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/diningorder.js";
import MenuItemDiningOrderService from "../../services/menuitemdiningorder.js";
import KOTItemsService from "../../services/kotitems.js";

import { PrismaClient } from "@prisma/client";
import KOTService from "../../services/kot.js";
import BillsService from "../../services/bills.js";

const prisma = new PrismaClient();
const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: DiningOrder
 *   description: API for managing DiningOrder objects
 *
 * /dining-order:
 *   get:
 *     tags: [DiningOrder]
 *     summary: Get all the DiningOrder objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of DiningOrder objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DiningOrder'
 */

router.get("/", async (req, res, next) => {
  try {
    const results = await DiningOrderService.takeawaylist();
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
 * /dining-order:
 *   post:
 *     tags: [DiningOrder]
 *     summary: Create a new DiningOrder
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiningOrder'
 *     responses:
 *       201:
 *         description: The created DiningOrder object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiningOrder'
 */
router.post("/", async (req, res, next) => {
  const { menu_item, ...orderWithoutMenuItem } = req.body;

  try {
    // Start a Prisma transaction
    const result = await prisma.$transaction(async (transactionPrisma) => {
      let diningOrder;

      // Create the dining order inside the transaction if orderId is not provided
      if (!req.body.orderId) {
        const { orderId, menu_item_comments, ...newOrderData } =
          orderWithoutMenuItem;
        diningOrder = await DiningOrderService.create(
          newOrderData,
          transactionPrisma // Pass the transaction-bound Prisma client
        );

        if (!diningOrder) {
          throw new Error("Failed to create dining order");
        }
      } else {
        diningOrder = { orderId: req.body.orderId }; // Use existing orderId
      }

      // Create a KOT (Kitchen Order Ticket)
      const kot = await KOTService.create(
        {
          orderId: diningOrder.orderId,
          status: req.body.orderStatus,
          createdAt: req.body.createdDate,
        },
        transactionPrisma
      );

      if (!kot) {
        throw new Error("Failed to create KOT");
      }

      // Prepare the menu items for the dining order
      const menuItems = menu_item; // Use the destructured variable

      // Iterate over each menu item
      for (const [menuItemId, quantity] of Object.entries(menuItems)) {
        // Find the comment that matches the current menuItemId
        const matchingComment = req.body.menu_item_comments.find(
          (comment) => comment.itemId === menuItemId
        );

        // Create the MenuItemDiningOrder
        const menuItemDiningOrder = await MenuItemDiningOrderService.create(
          {
            orderId: diningOrder.orderId,
            menuItemId: menuItemId,
            quantity: quantity,
            createdBy: req.body.createdBy,
            updatedBy: req.body.updatedBy,
            createdDate: req.body.createdDate,
            updatedDate: req.body.updatedDate,
            comments: matchingComment ? matchingComment.comment : "",
          },
          transactionPrisma
        );

        // Post the data to KOTitemsService.create with the created menuItemOrderId
        await KOTItemsService.create(
          {
            orderItemId: menuItemDiningOrder.menuItemOrderId, // Use the created menuItemOrderId
            kotId: kot.kotId,
            status: req.body.orderStatus,
            quantity: quantity,
          },
          transactionPrisma
        );
      }

      // Return the created dining order after all operations succeed
      return diningOrder;
    });

    // If transaction succeeds, return the created order ID or existing one
    res.status(201).json(result.orderId);
  } catch (error) {
    console.error("Error processing order:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the order." });
  }
});

/** @swagger
 *
 * /dining-order/{id}:
 *   get:
 *     tags: [DiningOrder]
 *     summary: Get a DiningOrder by id
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
 *         description: DiningOrder object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiningOrder'
 */
router.get("/:id", async (req, res, next) => {
  try {
    const obj = await DiningOrderService.takeawayorders(req.params.id);
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
router.get("/tableId/:id", async (req, res, next) => {
  try {
    const obj = await DiningOrderService.getOrderDetails(req.params.id);
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

router.get("/tableId/:id", async (req, res, next) => {
  try {
    const obj = await DiningOrderService.getOrderDetails(req.params.id);
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
 * /dining-order/{id}:
 *   put:
 *     tags: [DiningOrder]
 *     summary: Update DiningOrder with the specified id
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
 *             $ref: '#/components/schemas/DiningOrder'
 *     responses:
 *       200:
 *         description: The updated DiningOrder object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiningOrder'
 */
router.put("/:id", async (req, res, next) => {
  try {
    const obj = await DiningOrderService.update(req.params.id, req.body);
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

router.put("/orderId/:id", async (req, res, next) => {
  try {
    const { orderStatus, bill } = req.body;

    // Start a transaction
    const result = await prisma.$transaction(async (transactionPrisma) => {
      // Update Dining Order
      const updatedOrder = await DiningOrderService.updateForBilling(
        req.params.id,
        {
          orderStatus: orderStatus,
          totalPrice: bill.totalAmount,
        },
        transactionPrisma
      );

      // Create Bill
      const newBill = await BillsService.create(bill, transactionPrisma);

      // Return the updated order object and bill
      return { updatedOrder, newBill };
    });

    // If successful, send a 200 response with the result
    res.status(200).json(result);
  } catch (error) {
    console.error("Transaction error:", error);
    // If any error occurs during the transaction, return a 500 response
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
});

/** @swagger
 *
 * /dining-order/{id}:
 *   delete:
 *     tags: [DiningOrder]
 *     summary: Delete DiningOrder with the specified id
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
    const success = await DiningOrderService.delete(req.params.id);
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

export default router;
