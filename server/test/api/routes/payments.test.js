import supertest from 'supertest';
import { jest } from '@jest/globals'; // eslint-disable-line

import app from '../../../src/app.js';
import PaymentsService from '../../../src/services/payments.js';
import UserService from '../../../src/services/user.js';

jest.mock('../../../src/services/payments.js');
jest.mock('../../../src/services/user.js');

UserService.authenticateWithToken = jest.fn().mockResolvedValue({ email: 'test@example.com' });

describe('/api/v1/payments/', () => {
  test('anonymous requests are blocked', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/payments');
    expect(res.status).toBe(401);
  });

  test('GET lists all the models', async () => {
    const data = [{ name: 'First' }, { name: 'Second' }];
    PaymentsService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get('/api/v1/payments')
      .set('Authorization', 'token abc');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(PaymentsService.list).toHaveBeenCalled();
  });

  test('POST creates a new Payments', async () => {
    const data = {
      paymentId: 42,
      billId: 42,
      amount: 42,
      paymentDate: '2001-01-01T00:00:00Z',
      paymentMethod: 'test',
      paymentGateway: 'test',
      transactionId: 42,
      currencyCode: 42,
      tax: 42,
      tipAmount: 42,
      createdAt: '2001-01-01T00:00:00Z',
    };

    PaymentsService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post('/api/v1/payments')
      .set('Authorization', 'token abc')
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(PaymentsService.create).toHaveBeenCalledWith(data);
  });

});

describe('/api/v1/payments/:id', () => {
  test('getting a single result succeeds for authorized user', async () => {
    const data = { email: 'test@example.com' };
    PaymentsService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/payments/1`)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(PaymentsService.get).toHaveBeenCalledWith(1);
  });

  test('getting a single result fails for anonymous user', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/payments/1');
    expect(res.status).toBe(401);
  });

  test('request for nonexistent object returns 404', async () => {
    const id = '1';
    PaymentsService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/payments/${id}`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(404);
    expect(PaymentsService.get).toHaveBeenCalled();
  });

  test('request with incorrectly-formatted ObjectId fails', async () => {
    PaymentsService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/payments/bogus`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(400);
    expect(PaymentsService.get).not.toHaveBeenCalled();
  });

  test('Payments update', async () => {
    const data = {
    };
    PaymentsService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/payments/1`)
      .send(data)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(PaymentsService.update).toHaveBeenCalledWith(1, data);
  });

  test('Payments deletion', async () => {
    PaymentsService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/payments/1`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(204);
    expect(PaymentsService.delete).toHaveBeenCalledWith(1);
  });
});
