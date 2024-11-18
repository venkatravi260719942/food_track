export default {
  type: 'object',
  properties: {
    paymentId: { type: 'integer' },
    billId: { type: 'integer' },
    amount: { type: 'integer' },
    paymentDate: { type: 'string', format: 'date-time' },
    paymentMethod: { type: 'string' },
    paymentGateway: { type: 'string' },
    transactionId: { type: 'integer' },
    currencyCode: { type: 'integer' },
    tax: { type: 'integer' },
    tipAmount: { type: 'integer' },
    createdAt: { type: 'string', format: 'date-time' },
  },
  required: [
  ],
  additionalProperties: false,
};
