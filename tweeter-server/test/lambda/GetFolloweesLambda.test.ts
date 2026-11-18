// AI-assisted: see AI-ATTRIBUTION.md
// AI-assisted: I got help from claude writing the tests. 

import { describe, expect, it } from "@jest/globals";
import { handler } from "../../src/lambda/follow/GetFolloweesLambda";
import { FakeData, PagedUserItemRequest } from "tweeter-shared";

const PAGE_SIZE = 10;

describe("GetFolloweesLambda", () => {
  // Shared starting request; individual tests tweak copies of it
  const firstPageRequest = {
    token: "fake-token",
    userAlias: "general-kenobi",
    pageSize: PAGE_SIZE,
    lastItem: null,
  };

  it("returns a successful response with a full page", async () => {
    const response = await handler(firstPageRequest);

    expect(response.success).toBe(true);
    expect(response.items).toHaveLength(PAGE_SIZE);
  });

//   it("returns exactly the users FakeData provides", async () => {
//     // Arrange: compute what the answer SHOULD be
//     const [expectedUsers, expectedHasMore] =
//       FakeData.instance.getPageOfUsers(null, 10, "@allen");

//     // Act
//     const response = await handler(firstPageRequest);

//     // Assert: compare real contents, not just "something came back"
//     expect(response.items).toEqual(expectedUsers.map((u) => u.dto));
//     expect(response.hasMore).toBe(expectedHasMore);
//   });

  it("rejects a pageSize of 0 as a bad request", async () => {
    await expect(handler({ ...firstPageRequest, pageSize: 0 })).rejects.toThrow(
      "[bad-request] pageSize must be greater than 0"
    );
  });
});
