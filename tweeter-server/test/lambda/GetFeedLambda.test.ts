// AI-assisted: see AI-ATTRIBUTION.md

import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { PagedStatusItemRequest, StatusDto } from "tweeter-shared";
import { daoFactory } from "../../src/lambda/DAOFactoryInstance";
import { handler } from "../../src/lambda/status/GetFeedLambda";

// Swap the shared Dynamo factory for the in-memory fake so no AWS calls are made.
jest.mock("../../src/lambda/DAOFactoryInstance", () => {
  const { FakeDAOFactory } = jest.requireActual<typeof import("../fakes/FakeDAOFactory")>(
    "../fakes/FakeDAOFactory"
  );
  return { daoFactory: new FakeDAOFactory() };
});

const RECEIVER = "@allen";
const TOKEN = "allen-token";

const makeStatus = (alias: string, timestamp: number): StatusDto => ({
  post: `${alias} post ${timestamp}`,
  user: { firstName: alias.slice(1), lastName: "Test", alias, imageUrl: "url" },
  timestamp,
});

describe("GetFeedLambda", () => {
  const firstPageRequest: PagedStatusItemRequest = {
    token: TOKEN,
    userAlias: RECEIVER,
    pageSize: 2,
    lastItem: null,
  };

  beforeAll(async () => {
    await daoFactory.getStatusDAO().putFeedItems([RECEIVER], makeStatus("@amy", 100));
    await daoFactory.getStatusDAO().putFeedItems([RECEIVER], makeStatus("@bob", 300));
    await daoFactory.getStatusDAO().putFeedItems([RECEIVER], makeStatus("@amy", 200));
    await daoFactory.getAuthTokenDAO().putToken(TOKEN, RECEIVER, Math.floor(Date.now() / 1000) + 3600);
  });

  it("returns a successful response with the first page newest first", async () => {
    const response = await handler(firstPageRequest);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(response.items).toEqual([makeStatus("@bob", 300), makeStatus("@amy", 200)]);
    expect(response.hasMore).toBe(true);
  });

  it("returns the next page when given lastItem", async () => {
    const response = await handler({ ...firstPageRequest, lastItem: makeStatus("@amy", 200) });

    expect(response.items).toEqual([makeStatus("@amy", 100)]);
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
