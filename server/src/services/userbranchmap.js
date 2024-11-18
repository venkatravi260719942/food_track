import { UserBranchMap } from "../models/init.js";
import DatabaseError from "../models/error.js";
import branch from "../api/schemas/branch.js";

class UserBranchMapService {
  static async list() {
    try {
      return UserBranchMap.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async noOfChefs(branchId) {
    try {
      return UserBranchMap.findMany({
        where: {
          branchId: parseInt(branchId),
          roleId: 2,
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async getAcceptedEmail() {
    try {
      return UserBranchMap.findMany({
        where: { isAccepted: true, isActive: true },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await UserBranchMap.findUnique({ where: { id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await UserBranchMap.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await UserBranchMap.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await UserBranchMap.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async put(email, roleId, branchId) {
    try {
      return await UserBranchMap.update({
        where: { email: email },
        data: {
          roleId: roleId,
          branchId: branchId,
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async deactivateUser(email) {
    try {
      return await UserBranchMap.update({
        where: { email: email },
        data: {
          isActive: false,
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async getUsersWithRoles(email) {
    try {
      return UserBranchMap.findUnique({
        where: {
          email: email,
          User: {
            email: email,
          },
        },
        include: {
          User: true,
          Role: true,
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default UserBranchMapService;
