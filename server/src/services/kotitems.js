import { KOTItems } from "../models/init.js";
import DatabaseError from "../models/error.js";

class KOTItemsService {
  static async list() {
    try {
      return KOTItems.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await KOTItems.findUnique({ where: { id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data, prisma) {
    try {
      return await prisma.KOTItems.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      await KOTItems.update({ data, where: { id: parseInt(id) } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id, status) {
    try {
      const data = {
        status: status,
      };
      await KOTItems.update({ data, where: { id: parseInt(id) } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default KOTItemsService;
