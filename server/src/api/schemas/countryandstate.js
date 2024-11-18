export default {
  type: "object",
  properties: {
    countryId: { type: "integer" },
    countriesStateName: { type: "string" },
    isParent: { type: "boolean" },
    parentId: { type: "integer" },
    isActive: { type: "boolean" },
  },
  required: ["countryId"],
  additionalProperties: false,
};
