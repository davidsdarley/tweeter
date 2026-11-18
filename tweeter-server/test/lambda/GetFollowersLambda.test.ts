// AI-assisted: see AI-ATTRIBUTION.md

import { describe, expect, it } from "@jest/globals";
import { handler } from "../../src/lambda/follow/GetFollowersLambda";
import { FakeData, PagedUserItemRequest } from "tweeter-shared";

const PAGE_SIZE = 10;
const USER_ALIAS = "general-kenobi";

describe("GetFollowersLambda", () => {
  const firstPageRequest: PagedUserItemRequest = {
    token: "fake-token",
    userAlias: USER_ALIAS,
    pageSize: PAGE_SIZE,
    lastItem: null,
  };

  it("returns a successful response with a full first page", async () => {
    const response = await handler(firstPageRequest);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(response.items).toHaveLength(PAGE_SIZE);
  });

  it("returns exactly the users FakeData provides", async () => {
    const [expectedUsers, expectedHasMore] = FakeData.instance.getPageOfUsers(
      null,
      PAGE_SIZE,
      USER_ALIAS
    );

    const response = await handler(firstPageRequest);

    expect(response.items).toEqual(expectedUsers.map((u) => u.toDto()));
    expect(response.hasMore).toBe(expectedHasMore);
  });

  it("returns a second page with no overlap when given lastItem", async () => {
    const firstPage = await handler(firstPageRequest);
    const firstItems = firstPage.items ?? [];
    const lastItem = firstItems[firstItems.length - 1];

    const secondPage = await handler({ ...firstPageRequest, lastItem });

    expect(secondPage.success).toBe(true);
    const secondItems = secondPage.items ?? [];
    expect(secondItems.length).toBeGreaterThan(0);

    const firstAliases = new Set(firstItems.map((u) => u.alias));
    for (const user of secondItems) {
      expect(firstAliases.has(user.alias)).toBe(false);
    }
  });

  it("respects a smaller pageSize", async () => {
    const response = await handler({ ...firstPageRequest, pageSize: 3 });

    expect(response.success).toBe(true);
    expect(response.items).toHaveLength(3);
  });

  it("rejects a pageSize of 0 as a bad request", async () => {
    await expect(handler({ ...firstPageRequest, pageSize: 0 })).rejects.toThrow(
      "[bad-request] pageSize must be greater than 0"
    );
  });
});
