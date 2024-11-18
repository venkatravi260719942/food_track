import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import SupplierService from "../../../src/services/supplier.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/supplier.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/supplier/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/supplier");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    SupplierService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/supplier")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(SupplierService.list).toHaveBeenCalled();
  });

  test("POST creates a new Supplier", async () => {
    const data = {
      supplierId: 42,
      supplierName: "test",
      type: 42,
      branchId: { foo: "bar" },
      productId: "2",
      email: "test",
      contactNumber: 341592,
      address: "test",
    };

    SupplierService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/supplier")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(SupplierService.create).toHaveBeenCalledWith(data);
  });
});

describe("/api/v1/supplier/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    SupplierService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/supplier/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(SupplierService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/supplier/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    SupplierService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/supplier/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(SupplierService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    SupplierService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/supplier/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(SupplierService.get).not.toHaveBeenCalled();
  });

  test("Supplier update", async () => {
    const data = {};
    SupplierService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/supplier/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(SupplierService.update).toHaveBeenCalledWith(1, data);
  });

  test("Supplier deletion", async () => {
    SupplierService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/supplier/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(SupplierService.delete).toHaveBeenCalledWith(1);
  });
});
