import { BankDetails } from "../models/init.js";
import DatabaseError from "../models/error.js";

class BankDetailsService {
  static async list() {
    try {
      return BankDetails.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(supplierId) {
    supplierId = parseInt(supplierId);
    try {
      return await BankDetails.findUnique({
        where: { supplierId: supplierId },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await BankDetails.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(supplierId, data) {
    supplierId = parseInt(supplierId);
    try {
      return await BankDetails.update({
        where: { supplierId: supplierId },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await BankDetail.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default BankDetailsService;
