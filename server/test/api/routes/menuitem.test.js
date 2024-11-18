import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import MenuItemService from "../../../src/services/menuitem.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/menuitem.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/menu-item/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/menu-item");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    MenuItemService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/menu-item")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(MenuItemService.list).toHaveBeenCalled();
  });

  test("POST creates a new MenuItem", async () => {
    const data = {
      itemId: 42,
      itemName: "test",
      itemCategoryId: 42,
      itemPrice: 42,
      itemDescription: "test",
      organisationId: 42,
      branchId: 42,
      itemImageUrl: "test",
      menuInventoryId: 42,
      createdBy: "test",
      createdDate: "2001-01-01T00:00:00Z",
      updatedBy: "test",
      updatedDate: "2001-01-01T00:00:00Z",
    };

    MenuItemService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/menu-item")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(MenuItemService.create).toHaveBeenCalledWith(data);
  });
});

describe("/api/v1/menu-item/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    MenuItemService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/menu-item/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(MenuItemService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/menu-item/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    MenuItemService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/menu-item/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(MenuItemService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    MenuItemService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/menu-item/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(MenuItemService.get).not.toHaveBeenCalled();
  });

  test("MenuItem update", async () => {
    const data = {};
    MenuItemService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/menu-item/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(MenuItemService.update).toHaveBeenCalledWith(1, data);
  });

  test("MenuItem deletion", async () => {
    MenuItemService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/menu-item/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(MenuItemService.delete).toHaveBeenCalledWith(1);
  });
});
