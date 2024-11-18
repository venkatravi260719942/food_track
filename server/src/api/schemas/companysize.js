export default {
  type: "object",
  properties: {
    companySizeId: { type: "integer" },
    companySize: { type: "string" },
    createdBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
  },
  required: ["companySizeId"],
  additionalProperties: false,
};
