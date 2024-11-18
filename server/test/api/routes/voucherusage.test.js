import supertest from 'supertest';
import { jest } from '@jest/globals'; // eslint-disable-line

import app from '../../../src/app.js';
import VoucherUsageService from '../../../src/services/voucherusage.js';
import UserService from '../../../src/services/user.js';

jest.mock('../../../src/services/voucherusage.js');
jest.mock('../../../src/services/user.js');

UserService.authenticateWithToken = jest.fn().mockResolvedValue({ email: 'test@example.com' });

describe('/api/v1/voucher-usage/', () => {
  test('anonymous requests are blocked', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/voucher-usage');
    expect(res.status).toBe(401);
  });

  test('GET lists all the models', async () => {
    const data = [{ name: 'First' }, { name: 'Second' }];
    VoucherUsageService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get('/api/v1/voucher-usage')
      .set('Authorization', 'token abc');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(VoucherUsageService.list).toHaveBeenCalled();
  });

  test('POST creates a new VoucherUsage', async () => {
    const data = {
      orderId: 'test',
      voucherId: 42,
      discountAmount: 42,
      appliedAt: '2001-01-01T00:00:00Z',
    };

    VoucherUsageService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post('/api/v1/voucher-usage')
      .set('Authorization', 'token abc')
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(VoucherUsageService.create).toHaveBeenCalledWith(data);
  });

});

describe('/api/v1/voucher-usage/:id', () => {
  test('getting a single result succeeds for authorized user', async () => {
    const data = { email: 'test@example.com' };
    VoucherUsageService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/voucher-usage/1`)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(VoucherUsageService.get).toHaveBeenCalledWith(1);
  });

  test('getting a single result fails for anonymous user', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/voucher-usage/1');
    expect(res.status).toBe(401);
  });

  test('request for nonexistent object returns 404', async () => {
    const id = '1';
    VoucherUsageService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/voucher-usage/${id}`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(404);
    expect(VoucherUsageService.get).toHaveBeenCalled();
  });

  test('request with incorrectly-formatted ObjectId fails', async () => {
    VoucherUsageService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/voucher-usage/bogus`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(400);
    expect(VoucherUsageService.get).not.toHaveBeenCalled();
  });

  test('VoucherUsage update', async () => {
    const data = {
    };
    VoucherUsageService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/voucher-usage/1`)
      .send(data)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(VoucherUsageService.update).toHaveBeenCalledWith(1, data);
  });

  test('VoucherUsage deletion', async () => {
    VoucherUsageService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/voucher-usage/1`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(204);
    expect(VoucherUsageService.delete).toHaveBeenCalledWith(1);
  });
});
