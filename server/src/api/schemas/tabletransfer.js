export default {
  type: 'object',
  properties: {
    transferId: { type: 'integer' },
    orderId: { type: 'integer' },
    fromTableId: { type: 'integer' },
    toTableId: { type: 'integer' },
    transferDate: { type: 'string', format: 'date-time' },
    reason: { type: 'string' },
  },
  required: [
  ],
  additionalProperties: false,
};
