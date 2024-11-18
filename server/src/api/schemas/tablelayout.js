export default {
  type: "object",
  properties: {
    floorId: { type: "integer" },
    tableName: { type: "string" },
    tableNumber: { type: "integer" },
    numberOfChairs: { type: "integer" },
    tableId: { type: "integer" },
    isOccupied: { type: "boolean" },
    createdBy: { type: "string" },
    updatedBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedDate: { type: "string", format: "date-time" },
  },
  required: [],
  additionalProperties: false,
};
