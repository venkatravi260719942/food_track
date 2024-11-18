export default {
  type: "object",
  properties: {
    customerId: { type: "String" },
    customerName: { type: "string" },
    contactNumber: { type: "number" },
    createdBy: { type: "string" },
    updatedBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedDate: { type: "string", format: "date-time" },
  },
  required: [],
  additionalProperties: false,
};
