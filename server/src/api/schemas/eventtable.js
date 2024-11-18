export default {
  type: "object",
  properties: {
    eventId: { type: "string" },
    eventName: { type: "string" },
    eventType: { type: "string" },
    typeId: { type: "string" },
    beforeValue: { type: "string" },
    aftervalue: { type: "string" },
    timestamp: { type: "string", format: "date-time" },
  },
  required: ["eventId"],
  additionalProperties: false,
};
