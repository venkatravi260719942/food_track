import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import BranchService from "../../../src/services/branch.js";
import UserService from "../../../src/services/user.js";

import router from "../../../src/api/routes/branch.js";

jest.mock("../../../src/services/branch.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/branch/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/branch");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    BranchService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/branch")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(BranchService.list).toHaveBeenCalled();
  });

  test("POST creates a new Branch", async () => {
    const data = {
      branchId: 2,
      organisationId: 1,
      address: "test",
      contactNumber: 3098141592,
      branchName: "test",
      isActive: true,
      createdBy: "test",
      createdDate: "2001-01-01T00:00:00Z",
      updatedBy: "test",
      updatedDate: "2001-01-01T00:00:00Z",
    };

    BranchService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/branch")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(BranchService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new Branch without required attributes fails", async () => {
    const data = {};

    BranchService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/branch")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(BranchService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/branch/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com", branchId: 1 };
    BranchService.getBranchBasedOnBranchId = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/branch/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(BranchService.getBranchBasedOnBranchId).toHaveBeenCalledWith("1");
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/branch/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    BranchService.getBranchBasedOnBranchId = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/branch/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(BranchService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    BranchService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/branch/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(BranchService.get).not.toHaveBeenCalled();
  });

  test("Branch update", async () => {
    const data = {
      branchId: 1,
    };
    BranchService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/branch/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(BranchService.update).toHaveBeenCalledWith(1, data);
  });

  test("Branch deletion", async () => {
    BranchService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/branch/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(BranchService.delete).toHaveBeenCalledWith(1);
  });
});

describe("/api/v1/branch/organisationId/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com", branchId: 1, organisationId: 1 };
    BranchService.getBranchBasedOnOrganisationId = jest
      .fn()
      .mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/branch/organisationId/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(BranchService.getBranchBasedOnOrganisationId).toHaveBeenCalledWith(
      "1"
    );
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/branch/organisationId/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    BranchService.getBranchBasedOnOrganisationId = jest
      .fn()
      .mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/branch/organisationId/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(BranchService.getBranchBasedOnOrganisationId).toHaveBeenCalled();
  });

  // test("request with incorrectly-formatted ObjectId fails", async () => {
  //   BranchService.get = jest.fn();
  //   const req = supertest(app);

  //   const res = await req
  //     .get(`/api/v1/branch/bogus`)
  //     .set("Authorization", "token abc");

  //   expect(res.status).toBe(400);
  //   expect(BranchService.get).not.toHaveBeenCalled();
  // });

  test("Branch update", async () => {
    const data = {
      branchId: 2,
    };
    BranchService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/branch/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(BranchService.update).toHaveBeenCalledWith(1, data);
  });

  test("Branch deletion", async () => {
    BranchService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/branch/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(BranchService.delete).toHaveBeenCalledWith(1);
  });
});

describe("Profile Picture Upload API", () => {
  it("should upload a file to S3 and return the file URL", async () => {
    const response = await supertest(app)
      .post("/api/v1/branch/upload-image")
      .attach("file", "C:/Users/MariyaSughali/Downloads/d.jpg"); // Attach a file to the request

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe("Successfully uploaded file!");
    expect(response.body.fileName).toBeDefined();
    expect(response.body.imageUrl).toBeDefined();
  });
});
