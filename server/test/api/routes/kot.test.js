import supertest from 'supertest';
import { jest } from '@jest/globals'; // eslint-disable-line

import app from '../../../src/app.js';
import KOTService from '../../../src/services/kot.js';
import UserService from '../../../src/services/user.js';

jest.mock('../../../src/services/kot.js');
jest.mock('../../../src/services/user.js');

UserService.authenticateWithToken = jest.fn().mockResolvedValue({ email: 'test@example.com' });

describe('/api/v1/kot/', () => {
  test('anonymous requests are blocked', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/kot');
    expect(res.status).toBe(401);
  });

  test('GET lists all the models', async () => {
    const data = [{ name: 'First' }, { name: 'Second' }];
    KOTService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get('/api/v1/kot')
      .set('Authorization', 'token abc');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(KOTService.list).toHaveBeenCalled();
  });

  test('POST creates a new KOT', async () => {
    const data = {
      kotId: 42,
      orderId: 42,
      kotNumber: 'test',
      status: 'test',
      createdAt: '2001-01-01T00:00:00Z',
    };

    KOTService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post('/api/v1/kot')
      .set('Authorization', 'token abc')
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(KOTService.create).toHaveBeenCalledWith(data);
  });

});

describe('/api/v1/kot/:id', () => {
  test('getting a single result succeeds for authorized user', async () => {
    const data = { email: 'test@example.com' };
    KOTService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/kot/1`)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(KOTService.get).toHaveBeenCalledWith(1);
  });

  test('getting a single result fails for anonymous user', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/kot/1');
    expect(res.status).toBe(401);
  });

  test('request for nonexistent object returns 404', async () => {
    const id = '1';
    KOTService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/kot/${id}`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(404);
    expect(KOTService.get).toHaveBeenCalled();
  });

  test('request with incorrectly-formatted ObjectId fails', async () => {
    KOTService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/kot/bogus`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(400);
    expect(KOTService.get).not.toHaveBeenCalled();
  });

  test('KOT update', async () => {
    const data = {
    };
    KOTService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/kot/1`)
      .send(data)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(KOTService.update).toHaveBeenCalledWith(1, data);
  });

  test('KOT deletion', async () => {
    KOTService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/kot/1`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(204);
    expect(KOTService.delete).toHaveBeenCalledWith(1);
  });
});
