export default {
  type: 'object',
  properties: {
    orderId: { type: 'string' },
    voucherId: { type: 'integer' },
    discountAmount: { type: 'integer' },
    appliedAt: { type: 'string', format: 'date-time' },
  },
  required: [
  ],
  additionalProperties: false,
};
