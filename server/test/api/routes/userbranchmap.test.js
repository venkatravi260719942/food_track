import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import UserBranchMapService from "../../../src/services/userbranchmap.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/userbranchmap.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/user-branch-map/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/user-branch-map");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    UserBranchMapService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/user-branch-map")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(UserBranchMapService.list).toHaveBeenCalled();
  });

  test("POST creates a new UserBranchMap", async () => {
    const data = {
      branchMapId: 1,
      organisationId: 2,
      branchId: 3,
      roleId: 2,
      email: "test@example.com",
      isActive: true,
      createdBy: "test",
      createdDate: "2001-01-01T00:00:00Z",
      updatedBy: "test",
      updatedDate: "2001-01-01T00:00:00Z",
      tenantId: "test",
      isInvited: true,
      isAccepted: true,
    };

    UserBranchMapService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/user-branch-map")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(UserBranchMapService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new UserBranchMap without required attributes fails", async () => {
    const data = {};

    UserBranchMapService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/user-branch-map")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(UserBranchMapService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/user-branch-map/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    UserBranchMapService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/user-branch-map/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(UserBranchMapService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/user-branch-map/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    UserBranchMapService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/user-branch-map/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(UserBranchMapService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    UserBranchMapService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/user-branch-map/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(UserBranchMapService.get).not.toHaveBeenCalled();
  });

  test("UserBranchMap update", async () => {
    const data = {
      branchMapId: 1,
    };
    UserBranchMapService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/user-branch-map/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(UserBranchMapService.update).toHaveBeenCalledWith(1, data);
  });

  test("UserBranchMap deletion", async () => {
    UserBranchMapService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/user-branch-map/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(UserBranchMapService.delete).toHaveBeenCalledWith(1);
  });

  test("getmanagerdetails", async () => {
    const data = { email: "test@example.com" };
    UserBranchMapService.getUsersWithRoles = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/user-branch-map/managerdata/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(UserBranchMapService.getUsersWithRoles).toHaveBeenCalledWith("1");
  });
});
