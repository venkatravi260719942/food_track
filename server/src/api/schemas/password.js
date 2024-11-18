export default {
  type: "object",
  properties: {
    passwordId: { type: "string" },
    restPasswordToken: { type: "string" },
  },
  required: ["passwordId"],
  additionalProperties: false,
};
