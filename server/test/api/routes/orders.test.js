import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import OrdersService from "../../../src/services/orders.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/orders.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/orders/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/orders");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    OrdersService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/orders")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(OrdersService.list).toHaveBeenCalled();
  });

  test("POST creates a new Orders", async () => {
    const data = {
      orderId: 42,
      supplierId: 2,
      orderStatus: true,
      orderedBy: "test",
      orderedDate: "2001-01-01T00:00:00Z",
      expectedDeliveryDate: "2001-01-01T00:00:00Z",
    };

    OrdersService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/orders")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(OrdersService.create).toHaveBeenCalledWith(data);
  });
});

describe("/api/v1/orders/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    OrdersService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/orders/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(OrdersService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/orders/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    OrdersService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/orders/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(OrdersService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    OrdersService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/orders/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(OrdersService.get).not.toHaveBeenCalled();
  });

  test("Orders update", async () => {
    const data = {};
    OrdersService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/orders/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(OrdersService.update).toHaveBeenCalledWith(1, data);
  });

  test("Orders deletion", async () => {
    OrdersService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/orders/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(OrdersService.delete).toHaveBeenCalledWith(1);
  });
});
