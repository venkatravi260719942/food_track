export default {
  type: 'object',
  properties: {
    receiptId: { type: 'integer' },
    paymentId: { type: 'integer' },
    receiptNumber: { type: 'string' },
    issuedDate: { type: 'string' },
    details: { type: 'string' },
  },
  required: [
  ],
  additionalProperties: false,
};
