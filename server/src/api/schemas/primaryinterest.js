export default {
  type: "object",
  properties: {
    primaryInterestId: { type: "string" },
    primaryInterest: { type: "string" },
    createdBy: { type: "string" },
    createdDate: { type: "string", format: "date-time" },
    updatedBy: { type: "string" },
    updatedDate: { type: "string", format: "date-time" },
  },
  required: ["primaryInterestId"],
  additionalProperties: false,
};
