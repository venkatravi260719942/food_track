export default {
  type: "object",
  properties: {
    unitId: { type: "Int" },
    units: { type: "string" },
    createdBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedBy: { type: "string" },
    updatedDate: { type: "string", format: "date-time" },
  },
  required: ["unitId"],
  additionalProperties: false,
};
