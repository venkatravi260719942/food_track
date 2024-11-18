import { DiningOrder, MenuItemDiningOrder } from "../models/init.js";
import DatabaseError from "../models/error.js";

class MenuItemDiningOrderService {
  static async list() {
    try {
      return MenuItemDiningOrder.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await MenuItemDiningOrder.findMany({
        where: {
          orderId: parseInt(id),
        },
        include: {
          MenuItem: true, // Assuming 'menuItem' is the related model
          DiningOrder: true,
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data, prisma) {
    try {
      return await prisma.MenuItemDiningOrder.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await MenuItemDiningOrder.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await MenuItemDiningOrder.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default MenuItemDiningOrderService;
