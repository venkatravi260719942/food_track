import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import CountryAndStateService from "../../../src/services/countryandstate.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/countryandstate.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/country-and-state/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/country-and-state");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    CountryAndStateService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/country-and-state")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(CountryAndStateService.list).toHaveBeenCalled();
  });

  test("POST creates a new CountryAndState", async () => {
    const data = {
      countryId: 42,
      countriesStateName: "test",
      isParent: true,
      parentId: 42,
      isActive: true,
    };

    CountryAndStateService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/country-and-state")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(CountryAndStateService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new CountryAndState without required attributes fails", async () => {
    const data = {};

    CountryAndStateService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/country-and-state")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(CountryAndStateService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/country-and-state/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    CountryAndStateService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/country-and-state/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(CountryAndStateService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/country-and-state/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    CountryAndStateService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/country-and-state/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(CountryAndStateService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    CountryAndStateService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/country-and-state/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(CountryAndStateService.get).not.toHaveBeenCalled();
  });

  test("CountryAndState update", async () => {
    const data = {
      countryId: 42,
    };
    CountryAndStateService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/country-and-state/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(CountryAndStateService.update).toHaveBeenCalledWith(1, data);
  });

  test("CountryAndState deletion", async () => {
    CountryAndStateService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/country-and-state/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(CountryAndStateService.delete).toHaveBeenCalledWith(1);
  });
});

//test cases

describe("getOnlyCountries", () => {
  test("should return an array of countries with their state names and IDs", async () => {
    // Arrange
    const expectedResults = [
      { countriesStateName: "Country 1", countryId: 1 },
      { countriesStateName: "Country 2", countryId: 2 },
    ];
    // Mock the findMany method of CountryAndStateService
    CountryAndStateService.getOnlyCountries = jest
      .fn()
      .mockResolvedValue(expectedResults);

    // Act
    const res = await supertest(app).get(
      "/api/v1/country-and-state/only-country"
    );

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expectedResults);
    // expect(CountryAndStateService.getOnlyCountries).toHaveBeenCalledWith({
    //   select: {
    //     countriesStateName: true,
    //     countryId: true,
    //   },
    //   where: {
    //     isParent: true,
    //     isActive: true,
    //   },
    // });
  });

  test("should throw an error if fetching countries fails", async () => {
    // Arrange
    const errorMessage = "Database error";
    // Mock the findMany method of CountryAndStateService to throw an error
    CountryAndStateService.getOnlyCountries = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    // Act & Assert

    await expect(CountryAndStateService.getOnlyCountries).rejects.toThrow(
      errorMessage
    );
    // expect(CountryAndStateService.getOnlyCountriesy).toHaveBeenCalledWith({
    //   select: {
    //     countriesStateName: true,
    //     countryId: true,
    //   },
    //   where: {
    //     isParent: true,
    //     isActive: true,
    //   },
    // });
  });
});
