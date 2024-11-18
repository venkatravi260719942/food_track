export default {
  type: "object",
  properties: {
    categoryId: { type: "integer" },
    catergoryName: { type: "string" },
    createdBy: { type: "string" },
    updatedBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedDate: { type: "string", format: "date-time" },
  },
  required: [],
  additionalProperties: false,
};
