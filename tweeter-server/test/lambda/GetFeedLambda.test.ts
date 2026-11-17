// AI-assisted: see AI-ATTRIBUTION.md

import { describe, expect, it } from "@jest/globals";
import { handler } from "../../src/lambda/status/GetFeedLambda";
import { FakeData, PagedStatusItemRequest, StatusDto } from "tweeter-shared";

const PAGE_SIZE = 10;
const USER_ALIAS = "general-kenobi";

// A status is identified by its sender, timestamp, and post (same fields Status.equals compares)
const statusKey = (status: StatusDto): string =>
  `${status.user.alias}|${status.timestamp}|${status.post}`;

describe("GetFeedLambda", () => {
  const firstPageRequest: PagedStatusItemRequest = {
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

  it("returns exactly the statuses FakeData provides", async () => {
    const [expectedStatuses, expectedHasMore] =
      FakeData.instance.getPageOfStatuses(null, PAGE_SIZE);

    const response = await handler(firstPageRequest);

    expect(response.items).toEqual(expectedStatuses.map((s) => s.toDto()));
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

    const firstKeys = new Set(firstItems.map(statusKey));
    for (const status of secondItems) {
      expect(firstKeys.has(statusKey(status))).toBe(false);
    }
  });

  it("respects a smaller pageSize", async () => {
    const response = await handler({ ...firstPageRequest, pageSize: 3 });

    expect(response.success).toBe(true);
    expect(response.items).toHaveLength(3);
  });
});
