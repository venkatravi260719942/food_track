import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import FloorLayoutService from "../../../src/services/floorlayout.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/floorlayout.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/floor-layout/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/floor-layout");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    FloorLayoutService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/floor-layout")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(FloorLayoutService.list).toHaveBeenCalled();
  });

  test("POST creates a new FloorLayout", async () => {
    const data = {
      floorId: 42,
      organisationId: 42,
      branchId: 42,
      floorName: "test",
      isActive: true,
      createdBy: "test",
      updatedBy: "test",
      createdDate: "2001-01-01T00:00:00Z",
      updatedDate: "2001-01-01T00:00:00Z",
    };

    FloorLayoutService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/floor-layout")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(FloorLayoutService.create).toHaveBeenCalledWith(data);
  });
});

describe("/api/v1/floor-layout/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    FloorLayoutService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/floor-layout/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(FloorLayoutService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/floor-layout/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    FloorLayoutService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/floor-layout/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(FloorLayoutService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    FloorLayoutService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/floor-layout/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(FloorLayoutService.get).not.toHaveBeenCalled();
  });

  test("FloorLayout update", async () => {
    const data = {};
    FloorLayoutService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/floor-layout/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(FloorLayoutService.update).toHaveBeenCalledWith(1, data);
  });

  test("FloorLayout deletion", async () => {
    FloorLayoutService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/floor-layout/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(FloorLayoutService.delete).toHaveBeenCalledWith(1);
  });
});
