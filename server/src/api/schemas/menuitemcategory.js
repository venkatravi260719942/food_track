export default {
  type: "object",
  properties: {
    categoryId: { type: "string" },
    category: { type: "string" },
    branchId: { type: "integer" },
    createdBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedBy: { type: "string" },
    updatedDate: { type: "string", format: "date-time" },
  },
  required: [],
  additionalProperties: false,
};
