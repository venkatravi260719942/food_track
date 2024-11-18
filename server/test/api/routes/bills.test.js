import supertest from 'supertest';
import { jest } from '@jest/globals'; // eslint-disable-line

import app from '../../../src/app.js';
import BillsService from '../../../src/services/bills.js';
import UserService from '../../../src/services/user.js';

jest.mock('../../../src/services/bills.js');
jest.mock('../../../src/services/user.js');

UserService.authenticateWithToken = jest.fn().mockResolvedValue({ email: 'test@example.com' });

describe('/api/v1/bills/', () => {
  test('anonymous requests are blocked', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/bills');
    expect(res.status).toBe(401);
  });

  test('GET lists all the models', async () => {
    const data = [{ name: 'First' }, { name: 'Second' }];
    BillsService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get('/api/v1/bills')
      .set('Authorization', 'token abc');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(BillsService.list).toHaveBeenCalled();
  });

  test('POST creates a new Bills', async () => {
    const data = {
      billId: 3.141592,
      orderId: 42,
      totalAmount: 42,
      voucherId: 42,
      discountAmount: 42,
      finalAmount: 42,
      splitBillType: 'test',
      paymentStatus: 'test',
      paymentMethod: 'test',
      splitType: 'test',
      createdAt: '2001-01-01T00:00:00Z',
    };

    BillsService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post('/api/v1/bills')
      .set('Authorization', 'token abc')
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(BillsService.create).toHaveBeenCalledWith(data);
  });

});

describe('/api/v1/bills/:id', () => {
  test('getting a single result succeeds for authorized user', async () => {
    const data = { email: 'test@example.com' };
    BillsService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/bills/1`)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(BillsService.get).toHaveBeenCalledWith(1);
  });

  test('getting a single result fails for anonymous user', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/bills/1');
    expect(res.status).toBe(401);
  });

  test('request for nonexistent object returns 404', async () => {
    const id = '1';
    BillsService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/bills/${id}`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(404);
    expect(BillsService.get).toHaveBeenCalled();
  });

  test('request with incorrectly-formatted ObjectId fails', async () => {
    BillsService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/bills/bogus`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(400);
    expect(BillsService.get).not.toHaveBeenCalled();
  });

  test('Bills update', async () => {
    const data = {
    };
    BillsService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/bills/1`)
      .send(data)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(BillsService.update).toHaveBeenCalledWith(1, data);
  });

  test('Bills deletion', async () => {
    BillsService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/bills/1`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(204);
    expect(BillsService.delete).toHaveBeenCalledWith(1);
  });
});
