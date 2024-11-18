import { DiningOrder } from "../models/init.js";
import DatabaseError from "../models/error.js";
import status from "../utils/constant.js";

class DiningOrderService {
  static async list() {
    try {
      return DiningOrder.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async takeawaylist() {
    try {
      return DiningOrder.findMany({
        where: {
          orderType: "takeaway", // Adjust this based on how "takeaway" is represented in your database (e.g., ID or string).
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async getOrderDetails(id) {
    try {
      return await DiningOrder.findMany({
        where: { tableId: parseInt(id), orderStatus: status.Pending },
        include: {
          MenuItemDiningOrder: {
            include: {
              KOTItems: true,
            },
          },
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async takeawayorders(id) {
    try {
      return await DiningOrder.findMany({
        where: { orderId: parseInt(id), orderStatus: "Pending" },
        include: {
          MenuItemDiningOrder: {
            include: {
              KOTItems: true,
            },
          },
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async create(data, prisma) {
    try {
      return await prisma.DiningOrder.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await DiningOrder.update({
        where: {
          tableId: parseInt(id),
          orderStatus: status.Pending,
        },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async updateForBilling(id, data, prisma) {
    try {
      return await prisma.DiningOrder.update({
        where: {
          orderId: parseInt(id),
          orderStatus: status.Pending,
        },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await DiningOrder.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default DiningOrderService;
