// AI-assisted: see AI-ATTRIBUTION.md

import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { PagedUserItemRequest, UserDto } from "tweeter-shared";
import { daoFactory } from "../../src/lambda/DAOFactoryInstance";
import { handler } from "../../src/lambda/follow/GetFollowersLambda";

// Swap the shared Dynamo factory for the in-memory fake so no AWS calls are made.
jest.mock("../../src/lambda/DAOFactoryInstance", () => {
  const { FakeDAOFactory } = jest.requireActual<typeof import("../fakes/FakeDAOFactory")>(
    "../fakes/FakeDAOFactory"
  );
  return { daoFactory: new FakeDAOFactory() };
});

const USER_ALIAS = "@allen";
const TOKEN = "allen-token";
const OTHER_ALIASES = ["@amy", "@bob", "@cat"];

const makeUser = (alias: string): UserDto => ({
  firstName: alias.slice(1),
  lastName: "Test",
  alias,
  imageUrl: "url",
});

describe("GetFollowersLambda", () => {
  const firstPageRequest: PagedUserItemRequest = {
    token: TOKEN,
    userAlias: USER_ALIAS,
    pageSize: 2,
    lastItem: null,
  };

  beforeAll(async () => {
    for (const alias of [USER_ALIAS, ...OTHER_ALIASES]) {
      await daoFactory.getUserDAO().putUser(makeUser(alias), "hash");
    }
    for (const alias of OTHER_ALIASES) {
      await daoFactory.getFollowDAO().putFollow(alias, USER_ALIAS);
    }
    await daoFactory.getAuthTokenDAO().putToken(TOKEN, USER_ALIAS, Math.floor(Date.now() / 1000) + 3600);
  });

  it("returns a successful response with the first page", async () => {
    const response = await handler(firstPageRequest);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(response.items).toEqual([makeUser("@amy"), makeUser("@bob")]);
    expect(response.hasMore).toBe(true);
  });

  it("returns the next page when given lastItem", async () => {
    const response = await handler({ ...firstPageRequest, lastItem: makeUser("@bob") });

    expect(response.items).toEqual([makeUser("@cat")]);
    expect(response.hasMore).toBe(false);
  });

  it("rejects an invalid token as unauthorized", async () => {
    await expect(handler({ ...firstPageRequest, token: "bogus-token" })).rejects.toThrow(
      /^\[unauthorized\]/
    );
  });

  it("rejects a pageSize of 0 as a bad request", async () => {
    await expect(handler({ ...firstPageRequest, pageSize: 0 })).rejects.toThrow(
      "[bad-request] pageSize must be greater than 0"
    );
  });
});
