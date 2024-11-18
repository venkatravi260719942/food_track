export default {
  type: "object",
  properties: {
    menuItemInventoryId: { type: "string" },
    availableUnits: { type: "integer" },
    createdBy: { type: "string" },
    updatedBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedDate: { type: "string", format: "date-time" },
  },
  required: [],
  additionalProperties: false,
};
