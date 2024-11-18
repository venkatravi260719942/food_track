export default {
  type: "object",
  properties: {
    floorId: { type: "integer" },
    branchId: { type: "integer" },
    floorName: { type: "string" },
    isActive: { type: "boolean" },
    createdBy: { type: "string" },
    updatedBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedDate: { type: "string", format: "date-time" },
  },
  required: [],
  additionalProperties: false,
};
