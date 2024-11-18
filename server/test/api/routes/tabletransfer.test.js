import supertest from 'supertest';
import { jest } from '@jest/globals'; // eslint-disable-line

import app from '../../../src/app.js';
import TableTransferService from '../../../src/services/tabletransfer.js';
import UserService from '../../../src/services/user.js';

jest.mock('../../../src/services/tabletransfer.js');
jest.mock('../../../src/services/user.js');

UserService.authenticateWithToken = jest.fn().mockResolvedValue({ email: 'test@example.com' });

describe('/api/v1/table-transfer/', () => {
  test('anonymous requests are blocked', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/table-transfer');
    expect(res.status).toBe(401);
  });

  test('GET lists all the models', async () => {
    const data = [{ name: 'First' }, { name: 'Second' }];
    TableTransferService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get('/api/v1/table-transfer')
      .set('Authorization', 'token abc');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(TableTransferService.list).toHaveBeenCalled();
  });

  test('POST creates a new TableTransfer', async () => {
    const data = {
      transferId: 42,
      orderId: 42,
      fromTableId: 42,
      toTableId: 42,
      transferDate: '2001-01-01T00:00:00Z',
      reason: 'test',
    };

    TableTransferService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post('/api/v1/table-transfer')
      .set('Authorization', 'token abc')
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(TableTransferService.create).toHaveBeenCalledWith(data);
  });

});

describe('/api/v1/table-transfer/:id', () => {
  test('getting a single result succeeds for authorized user', async () => {
    const data = { email: 'test@example.com' };
    TableTransferService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/table-transfer/1`)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(TableTransferService.get).toHaveBeenCalledWith(1);
  });

  test('getting a single result fails for anonymous user', async () => {
    const req = supertest(app);
    const res = await req.get('/api/v1/table-transfer/1');
    expect(res.status).toBe(401);
  });

  test('request for nonexistent object returns 404', async () => {
    const id = '1';
    TableTransferService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/table-transfer/${id}`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(404);
    expect(TableTransferService.get).toHaveBeenCalled();
  });

  test('request with incorrectly-formatted ObjectId fails', async () => {
    TableTransferService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/table-transfer/bogus`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(400);
    expect(TableTransferService.get).not.toHaveBeenCalled();
  });

  test('TableTransfer update', async () => {
    const data = {
    };
    TableTransferService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/table-transfer/1`)
      .send(data)
      .set('Authorization', 'token abc');

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(TableTransferService.update).toHaveBeenCalledWith(1, data);
  });

  test('TableTransfer deletion', async () => {
    TableTransferService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/table-transfer/1`)
      .set('Authorization', 'token abc');

    expect(res.status).toBe(204);
    expect(TableTransferService.delete).toHaveBeenCalledWith(1);
  });
});
