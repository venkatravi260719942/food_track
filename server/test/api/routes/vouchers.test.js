import supertest from 'supertest';
import { jest } from '@jest/globals'; // eslint-disable-line

import app from '../../../src/app.js';
import VouchersService from '../../../src/services/vouchers.js';
import UserService from '../../../src/services/user.js';

jest.mock('../../../src/services/vouchers.js');
jest.mock('../../../src/services/user.js');

UserService.authenticateWithToken = jest.fn().mockResolvedValue({ email: 'test@example.com' });

describe('/api/v1/vouchers/', () => {
  test('anonymous requests are blocked', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/vouchers');
    expect(res.status).toBe(401);
  });

  test('GET lists all the models', async () => {
    const data = [{ name: 'First' }, { name: 'Second' }];
    VouchersService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get('/api/v1/vouchers')
      .set('Authorization', 'token abc');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(VouchersService.list).toHaveBeenCalled();
  });

  test('POST creates a new Vouchers', async () => {
    const data = {
      voucherId: 42,
      code: 'test',
      description: 'test',
      discountType: 'test',
      discountValue: 42,
      expiryDate: '2001-01-01T00:00:00Z',
      isActive: true,
      createdAt: '2001-01-01T00:00:00Z',
    };

    VouchersService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post('/api/v1/vouchers')
      .set('Authorization', 'token abc')
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(VouchersService.create).toHaveBeenCalledWith(data);
  });

});

describe('/api/v1/vouchers/:id', () => {
  test('getting a single result succeeds for authorized user', async () => {
    const data = { email: 'test@example.com' };
    VouchersService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/vouchers/1`)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(VouchersService.get).toHaveBeenCalledWith(1);
  });

  test('getting a single result fails for anonymous user', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/vouchers/1');
    expect(res.status).toBe(401);
  });

  test('request for nonexistent object returns 404', async () => {
    const id = '1';
    VouchersService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/vouchers/${id}`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(404);
    expect(VouchersService.get).toHaveBeenCalled();
  });

  test('request with incorrectly-formatted ObjectId fails', async () => {
    VouchersService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/vouchers/bogus`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(400);
    expect(VouchersService.get).not.toHaveBeenCalled();
  });

  test('Vouchers update', async () => {
    const data = {
    };
    VouchersService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/vouchers/1`)
      .send(data)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(VouchersService.update).toHaveBeenCalledWith(1, data);
  });

  test('Vouchers deletion', async () => {
    VouchersService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/vouchers/1`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(204);
    expect(VouchersService.delete).toHaveBeenCalledWith(1);
  });
});
