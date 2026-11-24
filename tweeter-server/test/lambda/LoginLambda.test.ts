// AI-assisted: see AI-ATTRIBUTION.md

import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { LoginRequest } from "tweeter-shared";
import { daoFactory } from "../../src/lambda/DAOFactoryInstance";
import { handler } from "../../src/lambda/user/LoginLambda";
import { UserService } from "../../src/model/service/UserService";

// Swap the shared Dynamo factory for the in-memory fake so no AWS calls are made.
jest.mock("../../src/lambda/DAOFactoryInstance", () => {
  const { FakeDAOFactory } = jest.requireActual<typeof import("../fakes/FakeDAOFactory")>(
    "../fakes/FakeDAOFactory"
  );
  return { daoFactory: new FakeDAOFactory() };
});

describe("LoginLambda", () => {
  const request: LoginRequest = {
    token: "",
    userAlias: "@allen",
    password: "password",
  };

  beforeAll(async () => {
    await new UserService(daoFactory).register(
      "Allen", "Anderson", "@allen", "password", "ZmFrZQ==", "png"
    );
  });

  it("returns a successful response with the user and an auth token", async () => {
    const response = await handler(request);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(response.user?.alias).toBe("@allen");
    expect(response.authToken?.token).toBeTruthy();
  });

  it("rejects a wrong password as a bad request", async () => {
    await expect(handler({ ...request, password: "wrong" })).rejects.toThrow(/^\[bad-request\]/);
  });

  it("rejects a request with an empty alias as a bad request", async () => {
    await expect(handler({ ...request, userAlias: "" })).rejects.toThrow(
      "[bad-request] Missing user alias"
    );
  });
});
