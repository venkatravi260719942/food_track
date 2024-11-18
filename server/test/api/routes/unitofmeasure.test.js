import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import UnitOfMeasureService from "../../../src/services/unitofmeasure.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/unitofmeasure.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/unit-of-measure/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/unit-of-measure");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    UnitOfMeasureService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/unit-of-measure")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(UnitOfMeasureService.list).toHaveBeenCalled();
  });

  test("POST creates a new UnitOfMeasure", async () => {
    const data = {
      unitId: 1,
      units: "kilogram",
      createdBy: "test",
      createdDate: "2001-01-01T00:00:00Z",
      updatedBy: "test",
      updatedDate: "2001-01-01T00:00:00Z",
    };

    UnitOfMeasureService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/unit-of-measure")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(UnitOfMeasureService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new UnitOfMeasure without required attributes fails", async () => {
    const data = {};

    UnitOfMeasureService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/unit-of-measure")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(UnitOfMeasureService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/unit-of-measure/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    UnitOfMeasureService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/unit-of-measure/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(UnitOfMeasureService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/unit-of-measure/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    UnitOfMeasureService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/unit-of-measure/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(UnitOfMeasureService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    UnitOfMeasureService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/unit-of-measure/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(UnitOfMeasureService.get).not.toHaveBeenCalled();
  });

  test("UnitOfMeasure update", async () => {
    const data = {
      unitId: "test",
    };
    UnitOfMeasureService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/unit-of-measure/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(UnitOfMeasureService.update).toHaveBeenCalledWith(1, data);
  });

  test("UnitOfMeasure deletion", async () => {
    UnitOfMeasureService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/unit-of-measure/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(UnitOfMeasureService.delete).toHaveBeenCalledWith(1);
  });
});
