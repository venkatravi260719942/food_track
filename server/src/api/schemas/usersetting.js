export default {
  type: "object",
  properties: {
    settingId: { type: "string" },
    inviteUser: { type: "boolean" },
    manageUser: { type: "boolean" },
    languageId: { type: "string" },
    roleId: { type: "string" },
    tenantId: { type: "string" },
    updatedBy: { type: "string" },
    updatedDate: { type: "string", format: "date-time" },
  },
  required: ["settingId"],
  additionalProperties: false,
};
