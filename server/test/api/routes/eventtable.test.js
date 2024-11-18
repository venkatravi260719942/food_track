import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import EventTableService from "../../../src/services/eventtable.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/eventtable.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/event-table/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/event-table");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    EventTableService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/event-table")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(EventTableService.list).toHaveBeenCalled();
  });

  test("POST creates a new EventTable", async () => {
    const data = {
      eventId: "test",
      eventName: "test",
      eventType: "test",
      typeId: "test",
      beforeValue: "test",
      aftervalue: "test",
      timestamp: "2001-01-01T00:00:00Z",
    };

    EventTableService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/event-table")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(EventTableService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new EventTable without required attributes fails", async () => {
    const data = {};

    EventTableService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/event-table")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(EventTableService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/event-table/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    EventTableService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/event-table/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(EventTableService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/event-table/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    EventTableService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/event-table/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(EventTableService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    EventTableService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/event-table/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(EventTableService.get).not.toHaveBeenCalled();
  });

  test("EventTable update", async () => {
    const data = {
      eventId: "test",
    };
    EventTableService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/event-table/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(EventTableService.update).toHaveBeenCalledWith(1, data);
  });

  test("EventTable deletion", async () => {
    EventTableService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/event-table/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(EventTableService.delete).toHaveBeenCalledWith(1);
  });
});
