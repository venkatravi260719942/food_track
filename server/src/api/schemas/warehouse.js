export default {
  type: "object",
  properties: {
    warehouseId: { type: "string" },
    organisationId: { type: "string" },
    tenantId: { type: "string" },
    name: { type: "string" },
    location: { type: "string" },
    createdBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedBy: { type: "string" },
    updatedDate: { type: "string", format: "date-time" },
  },
  required: ["warehouseId"],
  additionalProperties: false,
};
