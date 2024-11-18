import supertest from 'supertest';
import { jest } from '@jest/globals'; // eslint-disable-line

import app from '../../../src/app.js';
import BillItemsService from '../../../src/services/billitems.js';
import UserService from '../../../src/services/user.js';

jest.mock('../../../src/services/billitems.js');
jest.mock('../../../src/services/user.js');

UserService.authenticateWithToken = jest.fn().mockResolvedValue({ email: 'test@example.com' });

describe('/api/v1/bill-items/', () => {
  test('anonymous requests are blocked', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/bill-items');
    expect(res.status).toBe(401);
  });

  test('GET lists all the models', async () => {
    const data = [{ name: 'First' }, { name: 'Second' }];
    BillItemsService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get('/api/v1/bill-items')
      .set('Authorization', 'token abc');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(BillItemsService.list).toHaveBeenCalled();
  });

  test('POST creates a new BillItems', async () => {
    const data = {
      billId: 42,
      orderItemId: 42,
      amount: 42,
    };

    BillItemsService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post('/api/v1/bill-items')
      .set('Authorization', 'token abc')
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(BillItemsService.create).toHaveBeenCalledWith(data);
  });

});

describe('/api/v1/bill-items/:id', () => {
  test('getting a single result succeeds for authorized user', async () => {
    const data = { email: 'test@example.com' };
    BillItemsService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/bill-items/1`)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(BillItemsService.get).toHaveBeenCalledWith(1);
  });

  test('getting a single result fails for anonymous user', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/bill-items/1');
    expect(res.status).toBe(401);
  });

  test('request for nonexistent object returns 404', async () => {
    const id = '1';
    BillItemsService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/bill-items/${id}`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(404);
    expect(BillItemsService.get).toHaveBeenCalled();
  });

  test('request with incorrectly-formatted ObjectId fails', async () => {
    BillItemsService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/bill-items/bogus`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(400);
    expect(BillItemsService.get).not.toHaveBeenCalled();
  });

  test('BillItems update', async () => {
    const data = {
    };
    BillItemsService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/bill-items/1`)
      .send(data)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(BillItemsService.update).toHaveBeenCalledWith(1, data);
  });

  test('BillItems deletion', async () => {
    BillItemsService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/bill-items/1`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(204);
    expect(BillItemsService.delete).toHaveBeenCalledWith(1);
  });
});
