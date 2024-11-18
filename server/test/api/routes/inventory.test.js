import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import InventoryService from "../../../src/services/inventory.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/inventory.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/inventory/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/inventory");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    InventoryService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/inventory")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(InventoryService.list).toHaveBeenCalled();
  });

  test("POST creates a new Inventory", async () => {
    const data = {
      inventoryId: 1,
      productId: 2,
      quantity: 42,
      createdBy: "test",
      createdDate: "2001-01-01T00:00:00Z",
      updatedBy: "test",
      updatedDate: "2001-01-01T00:00:00Z",
    };

    InventoryService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/inventory")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(InventoryService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new Inventory without required attributes fails", async () => {
    const data = {};

    InventoryService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/inventory")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(InventoryService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/inventory/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    InventoryService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/inventory/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(InventoryService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/inventory/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    InventoryService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/inventory/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(InventoryService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    InventoryService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/inventory/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(InventoryService.get).not.toHaveBeenCalled();
  });

  test("Inventory update", async () => {
    const data = {
      inventoryId: 1,
    };
    InventoryService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/inventory/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(InventoryService.update).toHaveBeenCalledWith(1, data);
  });

  test("Inventory deletion", async () => {
    InventoryService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/inventory/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(InventoryService.delete).toHaveBeenCalledWith(1);
  });
});
