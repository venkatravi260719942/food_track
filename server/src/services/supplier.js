import { Supplier } from "../models/init.js";
import DatabaseError from "../models/error.js";

class SupplierService {
  static async list(id) {
    try {
      return Supplier.findMany({ where: { organisationId: parseInt(id) } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await Supplier.findUnique({ where: { supplierId: id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await Supplier.create({
        data,
      });
    } catch (err) {
      console.log(err);
      throw new DatabaseError(err);
    }
  }

  static async update(supplierId, data) {
    supplierId = parseInt(supplierId);
    try {
      return await Supplier.update({
        where: { supplierId: supplierId },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await Supplier.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default SupplierService;
