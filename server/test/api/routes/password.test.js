import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import PasswordService from "../../../src/services/password.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/password.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/password/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/password");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    PasswordService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/password")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(PasswordService.list).toHaveBeenCalled();
  });

  test("POST creates a new Password", async () => {
    const data = {
      passwordId: "test",
      restPasswordToken: "test",
    };

    PasswordService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/password")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(PasswordService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new Password without required attributes fails", async () => {
    const data = {};

    PasswordService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/password")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(PasswordService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/password/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    PasswordService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/password/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(PasswordService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/password/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    PasswordService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/password/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(PasswordService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    PasswordService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/password/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(PasswordService.get).not.toHaveBeenCalled();
  });

  test("Password update", async () => {
    const data = {
      passwordId: "test",
    };
    PasswordService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/password/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(PasswordService.update).toHaveBeenCalledWith(1, data);
  });

  test("Password deletion", async () => {
    PasswordService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/password/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(PasswordService.delete).toHaveBeenCalledWith(1);
  });
});
