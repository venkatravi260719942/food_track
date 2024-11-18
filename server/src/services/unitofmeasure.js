import { UnitOfMeasure } from "../models/init.js";
import DatabaseError from "../models/error.js";

class UnitOfMeasureService {
  static async list() {
    try {
      return UnitOfMeasure.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await UnitOfMeasure.findUnique({ where: { id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await UnitOfMeasure.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await UnitOfMeasure.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await UnitOfMeasure.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default UnitOfMeasureService;
