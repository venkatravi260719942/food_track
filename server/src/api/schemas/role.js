export default {
  type: "object",
  properties: {
    roleId: { type: "string" },
    roleName: { type: "string" },
    organisationId: { type: "string" },
    createdBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedBy: { type: "string" },
    updatedDate: { type: "string", format: "date-time" },
  },
  required: ["roleId"],
  additionalProperties: false,
};
