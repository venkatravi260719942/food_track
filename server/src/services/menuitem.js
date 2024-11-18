import { MenuItem } from "../models/init.js";
import DatabaseError from "../models/error.js";

class MenuItemService {
  static async list() {
    try {
      return MenuItem.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async getBranchId(id) {
    try {
      return await MenuItem.findMany({ where: { branchId: parseInt(id) } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async getMenuItemBasedOnCategory(id, branchId) {
    try {
      return await MenuItem.findMany({
        where: {
          categoryId: id,
          branchId: parseInt(branchId),
          MenuItemInventory: {
            availableUnits: {
              not: {
                equals: 0, // Checks that availableUnits is not equal to 0
              },
            },
          },
        },
        include: {
          MenuItemInventory: true,
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async getItemId(id) {
    try {
      return await MenuItem.findUnique({ where: { itemId: id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await MenuItem.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await MenuItem.update({
        where: { itemId: id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await MenuItem.delete({ where: { itemId: id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default MenuItemService;
