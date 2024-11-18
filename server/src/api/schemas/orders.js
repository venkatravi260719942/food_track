export default {
  type: "object",
  properties: {
    orderId: { type: "integer" },
    items: { type: "string" },
    supplierId: { type: "integer" },
    orderStatus: { type: "boolean" },
    orderedBy: { type: "string" },
    orderedDate: { type: "string", format: "date-time" },
    expectedDeliveryDate: { type: "string", format: "date-time" },
    branchId: { type: "integer" },
  },
  required: [],
  additionalProperties: false,
};
