import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import PrimaryInterestService from "../../../src/services/primaryinterest.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/primaryinterest.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/primary-interest/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/primary-interest");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    PrimaryInterestService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/primary-interest")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(PrimaryInterestService.list).toHaveBeenCalled();
  });

  test("POST creates a new PrimaryInterest", async () => {
    const data = {
      primaryInterestId: "test",
      primaryInterest: "test",
      createdBy: "test",
      createdDate: "2001-01-01T00:00:00Z",
      updatedBy: "test",
      updatedDate: "2001-01-01T00:00:00Z",
    };

    PrimaryInterestService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/primary-interest")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(PrimaryInterestService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new PrimaryInterest without required attributes fails", async () => {
    const data = {};

    PrimaryInterestService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/primary-interest")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(PrimaryInterestService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/primary-interest/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    PrimaryInterestService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/primary-interest/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(PrimaryInterestService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/primary-interest/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    PrimaryInterestService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/primary-interest/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(PrimaryInterestService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    PrimaryInterestService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/primary-interest/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(PrimaryInterestService.get).not.toHaveBeenCalled();
  });

  test("PrimaryInterest update", async () => {
    const data = {
      primaryInterestId: "test",
    };
    PrimaryInterestService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/primary-interest/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(PrimaryInterestService.update).toHaveBeenCalledWith(1, data);
  });

  test("PrimaryInterest deletion", async () => {
    PrimaryInterestService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/primary-interest/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(PrimaryInterestService.delete).toHaveBeenCalledWith(1);
  });
});
