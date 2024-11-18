import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import SupplierCategoryService from "../../../src/services/suppliercategory.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/suppliercategory.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/supplier-category/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/supplier-category");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    SupplierCategoryService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/supplier-category")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(SupplierCategoryService.list).toHaveBeenCalled();
  });

  test("POST creates a new SupplierCategory", async () => {
    const data = {
      categoryId: 42,
      categoryName: "test",
    };

    SupplierCategoryService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/supplier-category")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(SupplierCategoryService.create).toHaveBeenCalledWith(data);
  });
});

describe("/api/v1/supplier-category/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    SupplierCategoryService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/supplier-category/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(SupplierCategoryService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/supplier-category/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    SupplierCategoryService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/supplier-category/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(SupplierCategoryService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    SupplierCategoryService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/supplier-category/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(SupplierCategoryService.get).not.toHaveBeenCalled();
  });

  test("SupplierCategory update", async () => {
    const data = {};
    SupplierCategoryService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/supplier-category/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(SupplierCategoryService.update).toHaveBeenCalledWith(1, data);
  });

  test("SupplierCategory deletion", async () => {
    SupplierCategoryService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/supplier-category/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(SupplierCategoryService.delete).toHaveBeenCalledWith(1);
  });
});
