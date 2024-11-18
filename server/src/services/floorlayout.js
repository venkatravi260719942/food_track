import { FloorLayout } from "../models/init.js";
import DatabaseError from "../models/error.js";

class FloorLayoutService {
  static async list(noOfChairs, branchId) {
    try {
      return await FloorLayout.findMany({
        where: {
          branchId: parseInt(branchId),
        },
        include: {
          TableLayout: {
            where: { numberOfChairs: parseInt(noOfChairs), isOccupied: false },
          },
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await FloorLayout.findMany({
        where: {
          branchId: parseInt(id),
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await FloorLayout.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await FloorLayout.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await FloorLayout.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default FloorLayoutService;
