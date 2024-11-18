import supertest from 'supertest';
import { jest } from '@jest/globals'; // eslint-disable-line

import app from '../../../src/app.js';
import OrderTaxService from '../../../src/services/ordertax.js';
import UserService from '../../../src/services/user.js';

jest.mock('../../../src/services/ordertax.js');
jest.mock('../../../src/services/user.js');

UserService.authenticateWithToken = jest.fn().mockResolvedValue({ email: 'test@example.com' });

describe('/api/v1/order-tax/', () => {
  test('anonymous requests are blocked', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/order-tax');
    expect(res.status).toBe(401);
  });

  test('GET lists all the models', async () => {
    const data = [{ name: 'First' }, { name: 'Second' }];
    OrderTaxService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get('/api/v1/order-tax')
      .set('Authorization', 'token abc');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(OrderTaxService.list).toHaveBeenCalled();
  });

  test('POST creates a new OrderTax', async () => {
    const data = {
      taxId: 'test',
      orderId: 42,
      taxAmount: 42,
    };

    OrderTaxService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post('/api/v1/order-tax')
      .set('Authorization', 'token abc')
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(OrderTaxService.create).toHaveBeenCalledWith(data);
  });

});

describe('/api/v1/order-tax/:id', () => {
  test('getting a single result succeeds for authorized user', async () => {
    const data = { email: 'test@example.com' };
    OrderTaxService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/order-tax/1`)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(OrderTaxService.get).toHaveBeenCalledWith(1);
  });

  test('getting a single result fails for anonymous user', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/order-tax/1');
    expect(res.status).toBe(401);
  });

  test('request for nonexistent object returns 404', async () => {
    const id = '1';
    OrderTaxService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/order-tax/${id}`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(404);
    expect(OrderTaxService.get).toHaveBeenCalled();
  });

  test('request with incorrectly-formatted ObjectId fails', async () => {
    OrderTaxService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/order-tax/bogus`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(400);
    expect(OrderTaxService.get).not.toHaveBeenCalled();
  });

  test('OrderTax update', async () => {
    const data = {
    };
    OrderTaxService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/order-tax/1`)
      .send(data)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(OrderTaxService.update).toHaveBeenCalledWith(1, data);
  });

  test('OrderTax deletion', async () => {
    OrderTaxService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/order-tax/1`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(204);
    expect(OrderTaxService.delete).toHaveBeenCalledWith(1);
  });
});
