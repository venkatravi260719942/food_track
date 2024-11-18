import { CountryAndState } from "../models/init.js";
import DatabaseError from "../models/error.js";

class CountryAndStateService {
  static async list() {
    try {
      return CountryAndState.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async get(id) {
    try {
      return await CountryAndState.findUnique({ where: { id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await CountryAndState.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await CountryAndState.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await CountryAndState.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async getOnlyCountries() {
    try {
      const results = await CountryAndState.findMany({
        select: {
          countriesStateName: true,
          countryId: true,
        },
        where: {
          isParent: true,
          isActive: true,
        },
      });
      return results;
    } catch (error) {
      throw new Error("Failed to fetch countries: " + error.message);
    }
  }

  static async getStatesByCountryId(countryId) {
    try {
      const results = await CountryAndState.findMany({
        select: {
          countriesStateName: true,
        },
        where: {
          parentId: parseInt(countryId),
          isActive: true,
          isParent: false,
        },
      });
      return results;
    } catch (error) {
      throw new Error("Failed to fetch states: " + error.message);
    }
  }
}

export default CountryAndStateService;
