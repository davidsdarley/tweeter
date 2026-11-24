// AI-assisted: see AI-ATTRIBUTION.md

import { describe, expect, it, jest } from "@jest/globals";
import { RegisterRequest } from "tweeter-shared";
import { handler } from "../../src/lambda/user/RegisterLambda";

// Swap the shared Dynamo factory for the in-memory fake so no AWS calls are made.
jest.mock("../../src/lambda/DAOFactoryInstance", () => {
  const { FakeDAOFactory } = jest.requireActual<typeof import("../fakes/FakeDAOFactory")>(
    "../fakes/FakeDAOFactory"
  );
  return { daoFactory: new FakeDAOFactory() };
});

describe("RegisterLambda", () => {
  const request: RegisterRequest = {
    token: "",
    userAlias: "@newuser",
    password: "password",
    firstName: "New",
    lastName: "User",
    userImageBytes: "ZmFrZSBpbWFnZSBieXRlcw==", // base64 of "fake image bytes"
    imageFileExtension: "png",
  };

  it("returns a successful response with the new user and an auth token", async () => {
    const response = await handler(request);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(response.user?.alias).toBe("@newuser");
    expect(response.user?.firstName).toBe("New");
    expect(response.authToken?.token).toBeTruthy();
  });

  it("rejects an alias that is already registered as a bad request", async () => {
    await handler({ ...request, userAlias: "@taken" });

    await expect(handler({ ...request, userAlias: "@taken" })).rejects.toThrow(/^\[bad-request\]/);
  });

  it("rejects a request with an empty alias as a bad request", async () => {
    await expect(handler({ ...request, userAlias: "" })).rejects.toThrow(
      "[bad-request] Missing user alias"
    );
  });
});
