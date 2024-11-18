export default {
  type: "object",
  properties: {
    branchId: { type: "integer" },
    organisationId: { type: "integer" },
    address: { type: "string" },
    contactNumber: { type: "integer" },
    branchName: { type: "string" },
    isActive: { type: "boolean" },
    createdBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedBy: { type: "string" },
    updatedDate: { type: "string", format: "date-time" },
    branchOwnerName: { type: "string" },
    noOfEmployees: { type: "integer" },
    countryId: { type: "integer" },
    email: { type: "string" },
    notes: { type: "string" },
    branchImage: { type: "string" },
  },
  additionalProperties: false,
};
