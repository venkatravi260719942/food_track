import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import CustomerService from "../../../src/services/customer.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/customer.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/customer/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/customer");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    CustomerService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/customer")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(CustomerService.list).toHaveBeenCalled();
  });

  test("POST creates a new Customer", async () => {
    const data = {
      customerId: 42,
      customerName: "test",
      contactNumber: 3.141592,
      createdBy: "test",
      updatedBy: "test",
      createdDate: "2001-01-01T00:00:00Z",
      updatedDate: "2001-01-01T00:00:00Z",
    };

    CustomerService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/customer")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(CustomerService.create).toHaveBeenCalledWith(data);
  });
});

describe("/api/v1/customer/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    CustomerService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/customer/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(CustomerService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/customer/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    CustomerService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/customer/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(CustomerService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    CustomerService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/customer/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(CustomerService.get).not.toHaveBeenCalled();
  });

  test("Customer update", async () => {
    const data = {};
    CustomerService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/customer/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(CustomerService.update).toHaveBeenCalledWith(1, data);
  });

  test("Customer deletion", async () => {
    CustomerService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/customer/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(CustomerService.delete).toHaveBeenCalledWith(1);
  });
});
