// AI-assisted: see AI-ATTRIBUTION.md

import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { IsFollowerRequest } from "tweeter-shared";
import { daoFactory } from "../../src/lambda/DAOFactoryInstance";
import { handler } from "../../src/lambda/follow/GetIsFollowerStatusLambda";

// Swap the shared Dynamo factory for the in-memory fake so no AWS calls are made.
jest.mock("../../src/lambda/DAOFactoryInstance", () => {
  const { FakeDAOFactory } = jest.requireActual<typeof import("../fakes/FakeDAOFactory")>(
    "../fakes/FakeDAOFactory"
  );
  return { daoFactory: new FakeDAOFactory() };
});

const TOKEN = "allen-token";

describe("GetIsFollowerStatusLambda", () => {
  const request: IsFollowerRequest = {
    token: TOKEN,
    userAlias: "@allen",
    selectedUserAlias: "@amy",
  };

  beforeAll(async () => {
    await daoFactory.getFollowDAO().putFollow("@allen", "@amy");
    await daoFactory.getAuthTokenDAO().putToken(TOKEN, "@allen", Math.floor(Date.now() / 1000) + 3600);
  });

  it("returns true when userAlias follows selectedUserAlias", async () => {
    const response = await handler(request);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(response.isFollower).toBe(true);
  });

  it("returns false in the other direction", async () => {
    const response = await handler({ ...request, userAlias: "@amy", selectedUserAlias: "@allen" });

    expect(response.isFollower).toBe(false);
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
