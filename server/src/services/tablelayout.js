import { TableLayout } from "../models/init.js";
import DatabaseError from "../models/error.js";

class TableLayoutService {
  static async list() {
    try {
      return TableLayout.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await TableLayout.findMany({ where: { floorId: parseInt(id) } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await TableLayout.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await TableLayout.update({
        where: { tableId: parseInt(id) },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await TableLayout.delete({ where: { tableId: id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default TableLayoutService;
