export default {
  type: "object",
  properties: {
    billId: { type: "integer" },
    orderId: { type: "integer" },
    totalAmount: { type: "integer" },
    voucherId: { type: "integer" },
    discountAmount: { type: "integer" },
    finalAmount: { type: "integer" },
    numberOfSplits: { type: "integer" },
    paymentStatus: { type: "string" },
    paymentMethod: { type: "string" },
    splitType: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
  },
  required: [],
  additionalProperties: false,
};
