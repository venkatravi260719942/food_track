import { Product } from "../models/init.js";
import DatabaseError from "../models/error.js";
import { Inventory } from "../models/init.js";

class ProductService {
  static async list() {
    try {
      return Product.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await Product.findUnique({ where: { productId: id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async getByOrganisationId(id) {
    try {
      return await Product.findMany({ where: { organisationId: id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  static async create(data) {
    try {
      return await Product.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await Product.update({
        where: { productId: parseInt(id) },

        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      // Step 1: Delete the related Inventory records first
      await Inventory.deleteMany({
        where: { productId: id }, // Ensure the Inventory items related to the product are deleted
      });

      // Step 2: Delete the product after removing associated Inventory records
      await Product.delete({
        where: { productId: id },
      });

      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async inventory(organisationId, branchId) {
    try {
      const branchCondition = branchId ? parseInt(branchId) : null;
      return await Product.findMany({
        where: {
          organisationId: parseInt(organisationId),
          OR: [{ branchId: branchCondition }, { branchId: null }],
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default ProductService;
