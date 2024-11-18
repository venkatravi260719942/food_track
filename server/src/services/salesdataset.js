import { SalesDataSet } from "../models/init.js";
import DatabaseError from "../models/error.js";

class SalesDataSetService {
  static async list() {
    try {
      return SalesDataSet.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async getDistinctMenuItems(columnName) {
    try {
      const data = await SalesDataSet.findMany({
        distinct: [columnName],
        select: { [columnName]: true },
      });
      const responseArray = data.map((item) => item[columnName]);
      return responseArray;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await SalesDataSet.findUnique({ where: { id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await SalesDataSet.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await SalesDataSet.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await SalesDataSet.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default SalesDataSetService;
