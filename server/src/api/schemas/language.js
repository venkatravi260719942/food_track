export default {
  type: "object",
  properties: {
    languageId: { type: "integer" },
    languageName: { type: "string" },
    createdBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedBy: { type: "string" },
    updatedDate: { type: "string", format: "date-time" },
  },
  required: ["languageId"],
  additionalProperties: false,
};
