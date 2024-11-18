export default {
  type: "object",
  properties: {
    diningOrderId: { type: "integer" },
    menuItemId: { type: "string" },
    quantity: { type: "integer" },
    orderId: { type: "integer" },
    comments: { type: "string" },
    createdBy: { type: "string" },
    updatedBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedDate: { type: "string", format: "date-time" },
    Comments: { type: "string" },
  },
  required: [],
  additionalProperties: false,
};
