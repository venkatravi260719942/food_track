import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import UserSettingService from "../../../src/services/usersetting.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/usersetting.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/user-setting/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/user-setting");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    UserSettingService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/user-setting")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(UserSettingService.list).toHaveBeenCalled();
  });

  test("POST creates a new UserSetting", async () => {
    const data = {
      settingId: "test",
      inviteUser: true,
      manageUser: true,
      languageId: "test",
      roleId: "test",
      tenantId: "test",
      updatedBy: "test",
      updatedDate: "2001-01-01T00:00:00Z",
    };

    UserSettingService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/user-setting")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(UserSettingService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new UserSetting without required attributes fails", async () => {
    const data = {};

    UserSettingService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/user-setting")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(UserSettingService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/user-setting/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    UserSettingService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/user-setting/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(UserSettingService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/user-setting/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    UserSettingService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/user-setting/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(UserSettingService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    UserSettingService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/user-setting/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(UserSettingService.get).not.toHaveBeenCalled();
  });

  test("UserSetting update", async () => {
    const data = {
      settingId: "test",
    };
    UserSettingService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/user-setting/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(UserSettingService.update).toHaveBeenCalledWith(1, data);
  });

  test("UserSetting deletion", async () => {
    UserSettingService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/user-setting/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(UserSettingService.delete).toHaveBeenCalledWith(1);
  });
});
