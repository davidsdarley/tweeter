// AI-assisted: see AI-ATTRIBUTION.md

import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { TweeterRequest } from "tweeter-shared";
import { daoFactory } from "../../src/lambda/DAOFactoryInstance";
import { handler } from "../../src/lambda/follow/GetFollowerCountLambda";

// Swap the shared Dynamo factory for the in-memory fake so no AWS calls are made.
jest.mock("../../src/lambda/DAOFactoryInstance", () => {
  const { FakeDAOFactory } = jest.requireActual<typeof import("../fakes/FakeDAOFactory")>(
    "../fakes/FakeDAOFactory"
  );
  return { daoFactory: new FakeDAOFactory() };
});

const USER_ALIAS = "@allen";
const TOKEN = "allen-token";

describe("GetFollowerCountLambda", () => {
  const request: TweeterRequest = { token: TOKEN, userAlias: USER_ALIAS };

  beforeAll(async () => {
    const userDAO = daoFactory.getUserDAO();
    await userDAO.putUser(
      { firstName: "Allen", lastName: "Anderson", alias: USER_ALIAS, imageUrl: "url" },
      "hash"
    );
    for (let i = 0; i < 3; i++) {
      await userDAO.incrementFollowerCount(USER_ALIAS);
    }
    await daoFactory.getAuthTokenDAO().putToken(TOKEN, USER_ALIAS, Math.floor(Date.now() / 1000) + 3600);
  });

  it("returns a successful response with the stored count", async () => {
    const response = await handler(request);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(response.count).toBe(3);
  });

  it("rejects an invalid token as unauthorized", async () => {
    await expect(handler({ ...request, token: "bogus-token" })).rejects.toThrow(/^\[unauthorized\]/);
  });

  it("rejects a request with a missing token as a bad request", async () => {
    await expect(handler({ ...request, token: "" })).rejects.toThrow(
      "[bad-request] Missing auth token"
    );
  });
});
