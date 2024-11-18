import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import MenuItemDiningOrderService from "../../../src/services/menuitemdiningorder.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/menuitemdiningorder.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/menu-item-dining-order/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/menu-item-dining-order");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    MenuItemDiningOrderService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/menu-item-dining-order")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(MenuItemDiningOrderService.list).toHaveBeenCalled();
  });

  test("POST creates a new MenuItemDiningOrder", async () => {
    const data = {
      diningOrderId: 42,
      menuItemId: "test",
      quantity: 42,
      orderId: 42,
      createdBy: "test",
      updatedBy: "test",
      createdDate: "2001-01-01T00:00:00Z",
      updatedDate: "2001-01-01T00:00:00Z",
    };

    MenuItemDiningOrderService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/menu-item-dining-order")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(MenuItemDiningOrderService.create).toHaveBeenCalledWith(data);
  });
});

describe("/api/v1/menu-item-dining-order/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    MenuItemDiningOrderService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/menu-item-dining-order/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(MenuItemDiningOrderService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/menu-item-dining-order/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    MenuItemDiningOrderService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/menu-item-dining-order/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(MenuItemDiningOrderService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    MenuItemDiningOrderService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/menu-item-dining-order/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(MenuItemDiningOrderService.get).not.toHaveBeenCalled();
  });

  test("MenuItemDiningOrder update", async () => {
    const data = {};
    MenuItemDiningOrderService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/menu-item-dining-order/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(MenuItemDiningOrderService.update).toHaveBeenCalledWith(1, data);
  });

  test("MenuItemDiningOrder deletion", async () => {
    MenuItemDiningOrderService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/menu-item-dining-order/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(MenuItemDiningOrderService.delete).toHaveBeenCalledWith(1);
  });
});
