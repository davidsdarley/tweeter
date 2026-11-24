// AI-assisted: see AI-ATTRIBUTION.md

import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { TweeterRequest } from "tweeter-shared";
import { daoFactory } from "../../src/lambda/DAOFactoryInstance";
import { handler } from "../../src/lambda/follow/FollowLambda";

// Swap the shared Dynamo factory for the in-memory fake so no AWS calls are made.
jest.mock("../../src/lambda/DAOFactoryInstance", () => {
  const { FakeDAOFactory } = jest.requireActual<typeof import("../fakes/FakeDAOFactory")>(
    "../fakes/FakeDAOFactory"
  );
  return { daoFactory: new FakeDAOFactory() };
});

const FOLLOWER = "@allen";
const FOLLOWEE = "@amy";
const TOKEN = "allen-token";

describe("FollowLambda", () => {
  const request: TweeterRequest = { token: TOKEN, userAlias: FOLLOWEE };

  beforeAll(async () => {
    for (const alias of [FOLLOWER, FOLLOWEE]) {
      await daoFactory.getUserDAO().putUser(
        { firstName: alias.slice(1), lastName: "Test", alias, imageUrl: "url" },
        "hash"
      );
    }
    await daoFactory.getAuthTokenDAO().putToken(TOKEN, FOLLOWER, Math.floor(Date.now() / 1000) + 3600);
  });

  it("returns a successful response with the followed user's updated counts", async () => {
    const response = await handler(request);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(response.followerCount).toBe(1);
    expect(response.followeeCount).toBe(0);
    expect(await daoFactory.getFollowDAO().isFollower(FOLLOWER, FOLLOWEE)).toBe(true);
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
