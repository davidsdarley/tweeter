// AI-assisted: see AI-ATTRIBUTION.md

import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { PostStatusRequest } from "tweeter-shared";
import { daoFactory } from "../../src/lambda/DAOFactoryInstance";
import { handler } from "../../src/lambda/status/PostStatusLambda";

// Swap the shared Dynamo factory for the in-memory fake so no AWS calls are made.
jest.mock("../../src/lambda/DAOFactoryInstance", () => {
  const { FakeDAOFactory } = jest.requireActual<typeof import("../fakes/FakeDAOFactory")>(
    "../fakes/FakeDAOFactory"
  );
  return { daoFactory: new FakeDAOFactory() };
});

const AUTHOR = "@allen";
const FOLLOWER = "@amy";
const TOKEN = "allen-token";

describe("PostStatusLambda", () => {
  const request: PostStatusRequest = {
    token: TOKEN,
    userAlias: AUTHOR,
    newStatus: {
      post: "Hello from the PostStatusLambda test",
      user: { firstName: "allen", lastName: "Test", alias: AUTHOR, imageUrl: "url" },
      timestamp: 1000,
    },
  };

  beforeAll(async () => {
    await daoFactory.getFollowDAO().putFollow(FOLLOWER, AUTHOR);
    await daoFactory.getAuthTokenDAO().putToken(TOKEN, AUTHOR, Math.floor(Date.now() / 1000) + 3600);
  });

  it("returns a successful response and writes the story and follower feed", async () => {
    const response = await handler(request);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect((await daoFactory.getStatusDAO().getStoryPage(AUTHOR, 10, null))[0]).toEqual([request.newStatus]);
    expect((await daoFactory.getStatusDAO().getFeedPage(FOLLOWER, 10, null))[0]).toEqual([request.newStatus]);
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
