import { Organisation } from "../models/init.js";
import DatabaseError from "../models/error.js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class OrganisationService {
  static async list() {
    try {
      return Organisation.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await Organisation.findUnique({ where: { id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await Organisation.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await Organisation.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await Organisation.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async checkOrganisationFields({ email, contactNumber, companyName }) {
    const existingEmail = await prisma.organisation.findFirst({
      where: {
        email: email,
      },
    });
    const existingContactNumber = await prisma.organisation.findFirst({
      where: {
        contactNumber: contactNumber,
      },
    });
    const existingCompanyName = await prisma.organisation.findFirst({
      where: {
        companyName: companyName,
      },
    });
    const errors = {};
    if (existingEmail) {
      errors.email = "Email already exists";
    }
    if (existingContactNumber) {
      errors.contactNumber = "Contact number already exists";
    }
    if (existingCompanyName) {
      errors.companyName = "Company name already exists";
    }
    return errors;
  }
}

export default OrganisationService;
