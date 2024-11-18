import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import CompanySizeService from "../../../src/services/companysize.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/companysize.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/company-size/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/company-size");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    CompanySizeService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/company-size")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(CompanySizeService.list).toHaveBeenCalled();
  });

  test("POST creates a new CompanySize", async () => {
    const data = {
      companySizeId: 1,
      companySize: "test",
      createdBy: "test",
      createdDate: "2001-01-01T00:00:00Z",
    };

    CompanySizeService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/company-size")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(CompanySizeService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new CompanySize without required attributes fails", async () => {
    const data = {};

    CompanySizeService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/company-size")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(CompanySizeService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/company-size/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    CompanySizeService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/company-size/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(CompanySizeService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/company-size/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    CompanySizeService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/company-size/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(CompanySizeService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    CompanySizeService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/company-size/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(CompanySizeService.get).not.toHaveBeenCalled();
  });

  test("CompanySize update", async () => {
    const data = {
      companySizeId: 1,
    };
    CompanySizeService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/company-size/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(CompanySizeService.update).toHaveBeenCalledWith(1, data);
  });

  test("CompanySize deletion", async () => {
    CompanySizeService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/company-size/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(CompanySizeService.delete).toHaveBeenCalledWith(1);
  });
});
