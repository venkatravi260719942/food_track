import supertest from 'supertest';
import { jest } from '@jest/globals'; // eslint-disable-line

import app from '../../../src/app.js';
import ReceiptsService from '../../../src/services/receipts.js';
import UserService from '../../../src/services/user.js';

jest.mock('../../../src/services/receipts.js');
jest.mock('../../../src/services/user.js');

UserService.authenticateWithToken = jest.fn().mockResolvedValue({ email: 'test@example.com' });

describe('/api/v1/receipts/', () => {
  test('anonymous requests are blocked', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/receipts');
    expect(res.status).toBe(401);
  });

  test('GET lists all the models', async () => {
    const data = [{ name: 'First' }, { name: 'Second' }];
    ReceiptsService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get('/api/v1/receipts')
      .set('Authorization', 'token abc');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(ReceiptsService.list).toHaveBeenCalled();
  });

  test('POST creates a new Receipts', async () => {
    const data = {
      receiptId: 42,
      paymentId: 42,
      receiptNumber: 'test',
      issuedDate: 'test',
      details: 'test',
    };

    ReceiptsService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post('/api/v1/receipts')
      .set('Authorization', 'token abc')
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(ReceiptsService.create).toHaveBeenCalledWith(data);
  });

});

describe('/api/v1/receipts/:id', () => {
  test('getting a single result succeeds for authorized user', async () => {
    const data = { email: 'test@example.com' };
    ReceiptsService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/receipts/1`)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(ReceiptsService.get).toHaveBeenCalledWith(1);
  });

  test('getting a single result fails for anonymous user', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/receipts/1');
    expect(res.status).toBe(401);
  });

  test('request for nonexistent object returns 404', async () => {
    const id = '1';
    ReceiptsService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/receipts/${id}`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(404);
    expect(ReceiptsService.get).toHaveBeenCalled();
  });

  test('request with incorrectly-formatted ObjectId fails', async () => {
    ReceiptsService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/receipts/bogus`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(400);
    expect(ReceiptsService.get).not.toHaveBeenCalled();
  });

  test('Receipts update', async () => {
    const data = {
    };
    ReceiptsService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/receipts/1`)
      .send(data)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(ReceiptsService.update).toHaveBeenCalledWith(1, data);
  });

  test('Receipts deletion', async () => {
    ReceiptsService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/receipts/1`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(204);
    expect(ReceiptsService.delete).toHaveBeenCalledWith(1);
  });
});
