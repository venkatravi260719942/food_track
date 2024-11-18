import { Bills, MenuItemDiningOrder } from "../models/init.js";
import DatabaseError from "../models/error.js";
import status from "../utils/constant.js";

class BillsService {
  static async list() {
    try {
      return Bills.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await Bills.findUnique({
        where: {
          orderId: parseInt(id),
          MenuItemDiningOrder: {
            some: {
              KOTItems: {
                some: {
                  status: "Served", // Only return MenuItemDiningOrder where at least one KOTItem has 'Served' status
                },
              },
            },
          },
        },
        include: {
          MenuItemDiningOrder: {
            include: {
              KOTItems: true, // Include KOTItems for the filtered MenuItemDiningOrder
            },
          },
          DiningOrder: true, // Include related DiningOrder data
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data, prisma) {
    try {
      return await prisma.Bills.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await Bills.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async updateForSplitBillEqually(id, bill, prisma) {
    try {
      return await prisma.Bills.update({
        where: { orderId: parseInt(id) },
        data: bill,
      });
    } catch (err) {
      console.error("Error updating bill:", err);
      throw new Error("Error updating bill: " + err.message); // Use a standard error type
    }
  }

  static async updateForRevertSplit(id, prisma) {
    const data = {
      numberOfSplits: null,
      splitType: "",
    };
    try {
      return await prisma.Bills.update({
        where: { billId: parseInt(id) },
        data: data,
      });
    } catch (err) {
      console.error("Error updating bill:", err);
      throw new Error("Error updating bill: " + err.message); // Use a standard error type
    }
  }

  static async delete(id) {
    try {
      await Bills.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default BillsService;
