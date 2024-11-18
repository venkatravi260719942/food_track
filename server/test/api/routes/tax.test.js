import supertest from 'supertest';
import { jest } from '@jest/globals'; // eslint-disable-line

import app from '../../../src/app.js';
import TaxService from '../../../src/services/tax.js';
import UserService from '../../../src/services/user.js';

jest.mock('../../../src/services/tax.js');
jest.mock('../../../src/services/user.js');

UserService.authenticateWithToken = jest.fn().mockResolvedValue({ email: 'test@example.com' });

describe('/api/v1/tax/', () => {
  test('anonymous requests are blocked', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/tax');
    expect(res.status).toBe(401);
  });

  test('GET lists all the models', async () => {
    const data = [{ name: 'First' }, { name: 'Second' }];
    TaxService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get('/api/v1/tax')
      .set('Authorization', 'token abc');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(TaxService.list).toHaveBeenCalled();
  });

  test('POST creates a new Tax', async () => {
    const data = {
      taxId: 'test',
      rate: 42,
      applicableFrom: '2001-01-01T00:00:00Z',
      applicableTo: '2001-01-01T00:00:00Z',
      countryId: 42,
    };

    TaxService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post('/api/v1/tax')
      .set('Authorization', 'token abc')
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(TaxService.create).toHaveBeenCalledWith(data);
  });

});

describe('/api/v1/tax/:id', () => {
  test('getting a single result succeeds for authorized user', async () => {
    const data = { email: 'test@example.com' };
    TaxService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/tax/1`)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(TaxService.get).toHaveBeenCalledWith(1);
  });

  test('getting a single result fails for anonymous user', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/tax/1');
    expect(res.status).toBe(401);
  });

  test('request for nonexistent object returns 404', async () => {
    const id = '1';
    TaxService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/tax/${id}`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(404);
    expect(TaxService.get).toHaveBeenCalled();
  });

  test('request with incorrectly-formatted ObjectId fails', async () => {
    TaxService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/tax/bogus`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(400);
    expect(TaxService.get).not.toHaveBeenCalled();
  });

  test('Tax update', async () => {
    const data = {
    };
    TaxService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/tax/1`)
      .send(data)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(TaxService.update).toHaveBeenCalledWith(1, data);
  });

  test('Tax deletion', async () => {
    TaxService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/tax/1`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(204);
    expect(TaxService.delete).toHaveBeenCalledWith(1);
  });
});
