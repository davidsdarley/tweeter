// AI-assisted: see AI-ATTRIBUTION.md

import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { TweeterRequest, UserDto } from "tweeter-shared";
import { daoFactory } from "../../src/lambda/DAOFactoryInstance";
import { handler } from "../../src/lambda/user/GetUserLambda";
import { UserService } from "../../src/model/service/UserService";

// Swap the shared Dynamo factory for the in-memory fake so no AWS calls are made.
jest.mock("../../src/lambda/DAOFactoryInstance", () => {
  const { FakeDAOFactory } = jest.requireActual<typeof import("../fakes/FakeDAOFactory")>(
    "../fakes/FakeDAOFactory"
  );
  return { daoFactory: new FakeDAOFactory() };
});

const USER_ALIAS = "@allen";

describe("GetUserLambda", () => {
  let request: TweeterRequest;
  let registeredUser: UserDto;

  beforeAll(async () => {
    const [user, authToken] = await new UserService(daoFactory).register(
      "Allen", "Anderson", USER_ALIAS, "password", "ZmFrZQ==", "png"
    );
    registeredUser = user;
    request = { token: authToken.token, userAlias: USER_ALIAS };
  });

  it("returns a successful response with the requested user", async () => {
    const response = await handler(request);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(response.user).toEqual(registeredUser);
  });

  it("rejects an unknown alias as a bad request", async () => {
    await expect(handler({ ...request, userAlias: "@no-such-user" })).rejects.toThrow(
      /^\[bad-request\]/
    );
  });

  it("rejects an invalid token as unauthorized", async () => {
    await expect(handler({ ...request, token: "bogus-token" })).rejects.toThrow(
      /^\[unauthorized\]/
    );
  });

  it("rejects a request with a missing token as a bad request", async () => {
    await expect(handler({ ...request, token: "" })).rejects.toThrow(
      "[bad-request] Missing auth token"
    );
  });
});
