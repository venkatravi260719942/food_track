export default {
  type: "object",
  properties: {
    taxId: { type: "integer" },
    taxName: { type: "string" },
    taxRate: { type: "integer" },
    applicableFrom: { type: "string", format: "date-time" },
    applicableTo: { type: "string", format: "date-time" },
    countryId: { type: "integer" },
  },
  required: [],
  additionalProperties: false,
};
