import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import MenuItemCategoryService from "../../../src/services/menuitemcategory.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/menuitemcategory.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/menu-item-category/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/menu-item-category");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    MenuItemCategoryService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/menu-item-category")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(MenuItemCategoryService.list).toHaveBeenCalled();
  });

  test("POST creates a new MenuItemCategory", async () => {
    const data = {
      itemCategoryId: 42,
      itemCategory: "test",
      createdBy: "test",
      createdDate: "2001-01-01T00:00:00Z",
      updatedBy: "test",
      updatedDate: "2001-01-01T00:00:00Z",
    };

    MenuItemCategoryService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/menu-item-category")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(MenuItemCategoryService.create).toHaveBeenCalledWith(data);
  });
});

describe("/api/v1/menu-item-category/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    MenuItemCategoryService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/menu-item-category/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(MenuItemCategoryService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/menu-item-category/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    MenuItemCategoryService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/menu-item-category/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(MenuItemCategoryService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    MenuItemCategoryService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/menu-item-category/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(MenuItemCategoryService.get).not.toHaveBeenCalled();
  });

  test("MenuItemCategory update", async () => {
    const data = {};
    MenuItemCategoryService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/menu-item-category/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(MenuItemCategoryService.update).toHaveBeenCalledWith(1, data);
  });

  test("MenuItemCategory deletion", async () => {
    MenuItemCategoryService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/menu-item-category/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(MenuItemCategoryService.delete).toHaveBeenCalledWith(1);
  });
});
