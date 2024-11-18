export default {
  type: "object",
  properties: {
    tenantId: { type: "string" },
    dbName: { type: "string" },
    dbUsername: { type: "string" },
    dbPassword: { type: "string" },
    createdBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedBy: { type: "string" },
    updatedDate: { type: "string", format: "date-time" },
  },
  required: ["tenantId"],
  additionalProperties: false,
};
