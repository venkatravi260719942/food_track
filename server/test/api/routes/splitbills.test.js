import supertest from 'supertest';
import { jest } from '@jest/globals'; // eslint-disable-line

import app from '../../../src/app.js';
import SplitBillsService from '../../../src/services/splitbills.js';
import UserService from '../../../src/services/user.js';

jest.mock('../../../src/services/splitbills.js');
jest.mock('../../../src/services/user.js');

UserService.authenticateWithToken = jest.fn().mockResolvedValue({ email: 'test@example.com' });

describe('/api/v1/split-bills/', () => {
  test('anonymous requests are blocked', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/split-bills');
    expect(res.status).toBe(401);
  });

  test('GET lists all the models', async () => {
    const data = [{ name: 'First' }, { name: 'Second' }];
    SplitBillsService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get('/api/v1/split-bills')
      .set('Authorization', 'token abc');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(SplitBillsService.list).toHaveBeenCalled();
  });

  test('POST creates a new SplitBills', async () => {
    const data = {
      originalBillId: 42,
      splitBillId: 42,
      splitBillType: 'test',
    };

    SplitBillsService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post('/api/v1/split-bills')
      .set('Authorization', 'token abc')
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(SplitBillsService.create).toHaveBeenCalledWith(data);
  });

});

describe('/api/v1/split-bills/:id', () => {
  test('getting a single result succeeds for authorized user', async () => {
    const data = { email: 'test@example.com' };
    SplitBillsService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/split-bills/1`)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(SplitBillsService.get).toHaveBeenCalledWith(1);
  });

  test('getting a single result fails for anonymous user', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/split-bills/1');
    expect(res.status).toBe(401);
  });

  test('request for nonexistent object returns 404', async () => {
    const id = '1';
    SplitBillsService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/split-bills/${id}`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(404);
    expect(SplitBillsService.get).toHaveBeenCalled();
  });

  test('request with incorrectly-formatted ObjectId fails', async () => {
    SplitBillsService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/split-bills/bogus`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(400);
    expect(SplitBillsService.get).not.toHaveBeenCalled();
  });

  test('SplitBills update', async () => {
    const data = {
    };
    SplitBillsService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/split-bills/1`)
      .send(data)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(SplitBillsService.update).toHaveBeenCalledWith(1, data);
  });

  test('SplitBills deletion', async () => {
    SplitBillsService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/split-bills/1`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(204);
    expect(SplitBillsService.delete).toHaveBeenCalledWith(1);
  });
});
