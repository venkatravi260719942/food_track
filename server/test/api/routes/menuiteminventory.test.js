import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import MenuItemInventoryService from "../../../src/services/menuiteminventory.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/menuiteminventory.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/menu-item-inventory/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/menu-item-inventory");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    MenuItemInventoryService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/menu-item-inventory")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(MenuItemInventoryService.list).toHaveBeenCalled();
  });

  test("POST creates a new MenuItemInventory", async () => {
    const data = {
      menuItemInventoryId: "test",
      menuItemId: 42,
      availableUnits: 42,
      createdBy: "test",
      updatedBy: "test",
      createdDate: "2001-01-01T00:00:00Z",
      updatedDate: "2001-01-01T00:00:00Z",
    };

    MenuItemInventoryService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/menu-item-inventory")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(MenuItemInventoryService.create).toHaveBeenCalledWith(data);
  });
});

describe("/api/v1/menu-item-inventory/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    MenuItemInventoryService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/menu-item-inventory/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(MenuItemInventoryService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/menu-item-inventory/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    MenuItemInventoryService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/menu-item-inventory/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(MenuItemInventoryService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    MenuItemInventoryService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/menu-item-inventory/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(MenuItemInventoryService.get).not.toHaveBeenCalled();
  });

  test("MenuItemInventory update", async () => {
    const data = {};
    MenuItemInventoryService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/menu-item-inventory/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(MenuItemInventoryService.update).toHaveBeenCalledWith(1, data);
  });

  test("MenuItemInventory deletion", async () => {
    MenuItemInventoryService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/menu-item-inventory/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(MenuItemInventoryService.delete).toHaveBeenCalledWith(1);
  });
});
