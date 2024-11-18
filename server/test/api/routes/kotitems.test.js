import supertest from 'supertest';
import { jest } from '@jest/globals'; // eslint-disable-line

import app from '../../../src/app.js';
import KOTItemsService from '../../../src/services/kotitems.js';
import UserService from '../../../src/services/user.js';

jest.mock('../../../src/services/kotitems.js');
jest.mock('../../../src/services/user.js');

UserService.authenticateWithToken = jest.fn().mockResolvedValue({ email: 'test@example.com' });

describe('/api/v1/kotitems/', () => {
  test('anonymous requests are blocked', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/kotitems');
    expect(res.status).toBe(401);
  });

  test('GET lists all the models', async () => {
    const data = [{ name: 'First' }, { name: 'Second' }];
    KOTItemsService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get('/api/v1/kotitems')
      .set('Authorization', 'token abc');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(KOTItemsService.list).toHaveBeenCalled();
  });

  test('POST creates a new KOTItems', async () => {
    const data = {
      kotId: 42,
      orderItemId: 42,
      quantity: 42,
      status: 'test',
    };

    KOTItemsService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post('/api/v1/kotitems')
      .set('Authorization', 'token abc')
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(KOTItemsService.create).toHaveBeenCalledWith(data);
  });

});

describe('/api/v1/kotitems/:id', () => {
  test('getting a single result succeeds for authorized user', async () => {
    const data = { email: 'test@example.com' };
    KOTItemsService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/kotitems/1`)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(KOTItemsService.get).toHaveBeenCalledWith(1);
  });

  test('getting a single result fails for anonymous user', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/kotitems/1');
    expect(res.status).toBe(401);
  });

  test('request for nonexistent object returns 404', async () => {
    const id = '1';
    KOTItemsService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/kotitems/${id}`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(404);
    expect(KOTItemsService.get).toHaveBeenCalled();
  });

  test('request with incorrectly-formatted ObjectId fails', async () => {
    KOTItemsService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/kotitems/bogus`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(400);
    expect(KOTItemsService.get).not.toHaveBeenCalled();
  });

  test('KOTItems update', async () => {
    const data = {
    };
    KOTItemsService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/kotitems/1`)
      .send(data)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(KOTItemsService.update).toHaveBeenCalledWith(1, data);
  });

  test('KOTItems deletion', async () => {
    KOTItemsService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/kotitems/1`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(204);
    expect(KOTItemsService.delete).toHaveBeenCalledWith(1);
  });
});
