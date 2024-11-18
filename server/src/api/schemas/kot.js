export default {
  type: 'object',
  properties: {
    kotId: { type: 'integer' },
    orderId: { type: 'integer' },
    kotNumber: { type: 'string' },
    status: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
  },
  required: [
  ],
  additionalProperties: false,
};
