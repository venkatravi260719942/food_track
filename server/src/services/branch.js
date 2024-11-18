import { Branch, CountryAndState, Organisation } from "../models/init.js";
import DatabaseError from "../models/error.js";

class BranchService {
  static async list() {
    try {
      return Branch.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await Branch.findUnique({ where: { branchId: id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async getLocationbasedonCountryId(organisationId) {
    try {
      return Branch.findMany({
        include: {
          locations: {},
        },
        where: {
          organisationId: parseInt(organisationId),
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async getBranchBasedOnOrganisationId(id) {
    try {
      const organisationId = parseInt(id);
      return await Branch.findMany({
        where: { organisationId: organisationId },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async getBranchBasedOnBranchId(id) {
    try {
      const branchId = parseInt(id);
      return await Branch.findMany({
        where: { branchId: branchId },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async create(data) {
    try {
      return await Branch.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await Branch.update({
        where: { branchId: id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await Branch.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default BranchService;
