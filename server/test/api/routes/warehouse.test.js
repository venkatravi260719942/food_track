import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import WarehouseService from "../../../src/services/warehouse.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/warehouse.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/warehouse/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/warehouse");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    WarehouseService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/warehouse")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(WarehouseService.list).toHaveBeenCalled();
  });

  test("POST creates a new Warehouse", async () => {
    const data = {
      warehouseId: "test",
      organisationId: "test",
      tenantId: "test",
      name: "test",
      location: "test",
      createdBy: "test",
      createdDate: "2001-01-01T00:00:00Z",
      updatedBy: "test",
      updatedDate: "2001-01-01T00:00:00Z",
    };

    WarehouseService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/warehouse")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(WarehouseService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new Warehouse without required attributes fails", async () => {
    const data = {};

    WarehouseService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/warehouse")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(WarehouseService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/warehouse/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    WarehouseService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/warehouse/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(WarehouseService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/warehouse/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    WarehouseService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/warehouse/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(WarehouseService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    WarehouseService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/warehouse/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(WarehouseService.get).not.toHaveBeenCalled();
  });

  test("Warehouse update", async () => {
    const data = {
      warehouseId: "test",
    };
    WarehouseService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/warehouse/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(WarehouseService.update).toHaveBeenCalledWith(1, data);
  });

  test("Warehouse deletion", async () => {
    WarehouseService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/warehouse/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(WarehouseService.delete).toHaveBeenCalledWith(1);
  });
});
