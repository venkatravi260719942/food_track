export default {
  type: 'object',
  properties: {
    voucherId: { type: 'integer' },
    code: { type: 'string' },
    description: { type: 'string' },
    discountType: { type: 'string' },
    discountValue: { type: 'integer' },
    expiryDate: { type: 'string', format: 'date-time' },
    isActive: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
  },
  required: [
  ],
  additionalProperties: false,
};
