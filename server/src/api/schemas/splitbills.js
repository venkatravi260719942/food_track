export default {
  type: 'object',
  properties: {
    originalBillId: { type: 'integer' },
    splitBillId: { type: 'integer' },
    splitBillType: { type: 'string' },
  },
  required: [
  ],
  additionalProperties: false,
};
