import { Inventory, Organisation, Product } from "../models/init.js";
import DatabaseError from "../models/error.js";
import { stockCapacity } from "./constants.js";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class InventoryService {
  static async list() {
    try {
      return Inventory.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(branchId, productId) {
    try {
      const result = await Inventory.findUnique({
        where: {
          branchId: parseInt(branchId),
          productId: parseInt(productId),
        },
      });

      return result;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async Inventorybranch(branchId) {
    try {
      return await Inventory.findMany({
        where: {
          branchId: parseInt(branchId),
        },
        include: {
          Product: true,
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async getInventoryByStockLevel(branchId, stockLevel) {
    try {
      // Convert branchId to an integer
      const branchIdInt = parseInt(branchId);

      // Fetch inventory items including the related product details
      const inventoryItems = await prisma.inventory.findMany({
        where: {
          branchId: branchIdInt,
          ...(stockLevel === stockCapacity.OUT_OF_STOCK && {
            quantity: 0, // Out of stock
          }),
        },
        include: {
          Product: true, // Include the related product details
        },
      });

      // Filtering the items based on stock level using JavaScript operators
      const filteredItems = inventoryItems.filter((item) => {
        if (stockLevel === stockCapacity.LOW_STOCK) {
          return (
            item.quantity > item.Product.thresholdLimit / 2 && // Greater than half of thresholdLimit
            item.quantity < item.Product.thresholdLimit // Less than thresholdLimit
          );
        }
        if (stockLevel === stockCapacity.CRITICAL_STOCK) {
          return (
            item.quantity <= item.Product.thresholdLimit / 2 && // Less than or equal to half of thresholdLimit
            item.quantity > 0 // Not out of stock
          );
        }
        return true; // If not filtering for stock level, return all items
      });

      return filteredItems;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await Inventory.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(branchId, productId, data) {
    try {
      return await Inventory.update({
        where: {
          branchId: parseInt(branchId),
          productId: parseInt(productId),
        },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await Inventory.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default InventoryService;
