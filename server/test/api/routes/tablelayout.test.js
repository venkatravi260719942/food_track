import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import TableLayoutService from "../../../src/services/tablelayout.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/tablelayout.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/table-layout/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/table-layout");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    TableLayoutService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/table-layout")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(TableLayoutService.list).toHaveBeenCalled();
  });

  test("POST creates a new TableLayout", async () => {
    const data = {
      floorId: 42,
      tableName: "test",
      tableNumber: 42,
      numberOfChairs: 42,
      tableId: 42,
      isOccupied: true,
      createdBy: "test",
      updatedBy: "test",
      createdDate: "2001-01-01T00:00:00Z",
      updatedDate: "2001-01-01T00:00:00Z",
    };

    TableLayoutService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/table-layout")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(TableLayoutService.create).toHaveBeenCalledWith(data);
  });
});

describe("/api/v1/table-layout/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    TableLayoutService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/table-layout/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(TableLayoutService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/table-layout/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    TableLayoutService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/table-layout/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(TableLayoutService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    TableLayoutService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/table-layout/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(TableLayoutService.get).not.toHaveBeenCalled();
  });

  test("TableLayout update", async () => {
    const data = {};
    TableLayoutService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/table-layout/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(TableLayoutService.update).toHaveBeenCalledWith(1, data);
  });

  test("TableLayout deletion", async () => {
    TableLayoutService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/table-layout/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(TableLayoutService.delete).toHaveBeenCalledWith(1);
  });
});
