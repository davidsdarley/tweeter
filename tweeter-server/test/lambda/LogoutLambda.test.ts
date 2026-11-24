// AI-assisted: see AI-ATTRIBUTION.md

import { describe, expect, it, jest } from "@jest/globals";
import { TweeterRequest } from "tweeter-shared";
import { handler } from "../../src/lambda/user/LogoutLambda";

// Swap the shared Dynamo factory for the in-memory fake so no AWS calls are made.
jest.mock("../../src/lambda/DAOFactoryInstance", () => {
  const { FakeDAOFactory } = jest.requireActual<typeof import("../fakes/FakeDAOFactory")>(
    "../fakes/FakeDAOFactory"
  );
  return { daoFactory: new FakeDAOFactory() };
});

describe("LogoutLambda", () => {
  const request: TweeterRequest = {
    token: "fake-token",
    userAlias: "",
  };

  it("returns a successful response for a token", async () => {
    const response = await handler(request);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
  });

  it("rejects a request with a missing token as a bad request", async () => {
    await expect(handler({ ...request, token: "" })).rejects.toThrow(
      "[bad-request] Missing auth token"
    );
  });
});
