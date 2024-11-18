import { SplitBills } from "../models/init.js";
import DatabaseError from "../models/error.js";

class SplitBillsService {
  static async list() {
    try {
      return SplitBills.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await SplitBills.findMany({
        where: { originalBillId: parseInt(id) },
        include: {
          BillItems: true,
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async findByOriginalBillId(id, prisma) {
    try {
      return await prisma.SplitBills.findMany({
        where: { originalBillId: parseInt(id) },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data, prisma) {
    try {
      const result = await prisma.SplitBills.create({ data });
      return result;
    } catch (err) {
      console.error("Error creating split bills:", err);
      throw new Error("Error creating split bills: " + err.message);
    }
  }

  static async update(id, data) {
    try {
      return await SplitBills.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await SplitBills.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async deleteByBillId(id, prisma) {
    try {
      await prisma.SplitBills.deleteMany({
        where: {
          originalBillId: parseInt(id),
        },
      });
      return true; // Return true if the operation was successful
    } catch (err) {
      console.error("Error deleting bill items by split bill IDs:", err);
      throw new DatabaseError("Error deleting bill items: " + err.message);
    }
  }
}

export default SplitBillsService;
