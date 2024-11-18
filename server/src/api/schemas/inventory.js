export default {
  type: "object",
  properties: {
    inventoryId: { type: "integer" },
    productId: { type: "integer" },
    branchId: { type: "integer" },
    quantity: { type: "integer" },
    createdBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedBy: { type: "string" },
    updatedDate: { type: "string", format: "date-time" },
  },
  additionalProperties: false,
};
