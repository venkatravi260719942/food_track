export default {
  type: 'object',
  properties: {
    taxId: { type: 'string' },
    orderId: { type: 'integer' },
    taxAmount: { type: 'integer' },
  },
  required: [
  ],
  additionalProperties: false,
};
