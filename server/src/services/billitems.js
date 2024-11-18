import { BillItems } from "../models/init.js";
import DatabaseError from "../models/error.js";

class BillItemsService {
  static async list() {
    try {
      return BillItems.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await BillItems.findUnique({ where: { id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async createBillItems({
    splitBillIds,
    amountPerSplit,
    transactionPrisma,
  }) {
    try {
      const createdBillItems = [];
      for (const id of splitBillIds) {
        const createdItem = await transactionPrisma.BillItems.create({
          data: {
            billId: id,
            amount: amountPerSplit,
          },
        });
        createdBillItems.push(createdItem);
      }
      return createdBillItems; // Return the created bill items
    } catch (err) {
      console.error("Error creating bill items:", err);
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await BillItems.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await BillItems.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async deleteBySplitBillIds(ids, prisma) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("No valid split bill IDs provided for deletion.");
      }
      await prisma.billItems.deleteMany({
        where: {
          billId: {
            in: ids,
          },
        },
      });
      return true; // Return true if the operation was successful
    } catch (err) {
      console.error("Error deleting bill items by split bill IDs:", err);
      throw new DatabaseError("Error deleting bill items: " + err.message);
    }
  }
}

export default BillItemsService;
