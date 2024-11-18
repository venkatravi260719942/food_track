export default {
  type: "object",
  properties: {
    productId: { type: "Int" },
    tenantId: { type: "string" },
    organisationId: { type: "integer" },
    name: { type: "string" },
    branchId: { type: "integer" },
    createdBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedBy: { type: "string" },
    updatedDate: { type: "string", format: "date-time" },
    forSale: { type: "boolean" },
    forPurchase: { type: "boolean" },
    salesPrice: { type: "integer" },
    costPrice: { type: "integer" },
    productImage: { type: "string" },

    description: { type: "string" },
    categoryId: { type: "integer" },
    isActive: { type: "boolean" },
    unitOfMeasure: { type: "integer" },
    thresholdLimit: { type: "integer" },
  },
  additionalProperties: false,
};
