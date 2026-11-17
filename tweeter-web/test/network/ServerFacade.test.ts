// AI-assisted: see AI-ATTRIBUTION.md
import "isomorphic-fetch";
import { ServerFacade } from "../../src/network/ServerFacade";
import { FakeData, PagedUserItemRequest, User } from "tweeter-shared";

describe("ServerFacade integration", () => {
  const serverFacade = new ServerFacade();

  const firstPageRequest: PagedUserItemRequest = {
    token: "fake-token",
    userAlias: "@allen",
    pageSize: 10,   
    lastItem: null,
  };

    it("getMoreFollowees returns the expected first page", async () => {
    const [expectedUsers, expectedHasMore] =
      FakeData.instance.getPageOfUsers(null, 10, "@allen");

    const [users, hasMore] = await serverFacade.getMoreFollowees(firstPageRequest);

    expect(users.map((u) => u.alias)).toEqual(expectedUsers.map((u) => u.alias));
    expect(hasMore).toBe(expectedHasMore);
  });

  it("getMoreFollowees returns the next page with no overlap", async () => {
    const [firstPage] = await serverFacade.getMoreFollowees(firstPageRequest);
    const lastUser = firstPage[firstPage.length - 1];

    const [secondPage] = await serverFacade.getMoreFollowees({
      ...firstPageRequest,
      lastItem: lastUser.toDto(),
    });

    const firstAliases = firstPage.map((u) => u.alias);
    for (const user of secondPage) {
      expect(firstAliases).not.toContain(user.alias);
    }
  });

  it("getMoreFollowees respects a smaller page size", async () => {
    const [users] = await serverFacade.getMoreFollowees({
      ...firstPageRequest,
      pageSize: 3,
    });

    expect(users).toHaveLength(3);
  });

  it("getMoreFollowers returns the expected first page", async () => {
    // What the server should return (it uses FakeData)
    const [expectedUsers, expectedHasMore] =
      FakeData.instance.getPageOfUsers(null, 10, "@allen");

    const [users, hasMore] = await serverFacade.getMoreFollowers(firstPageRequest);

    expect(users.map((u) => u.alias)).toEqual(expectedUsers.map((u) => u.alias));
    expect(hasMore).toBe(expectedHasMore);
  });

  it("getMoreFollowers returns User objects, not raw DTOs", async () => {
    const [users] = await serverFacade.getMoreFollowers(firstPageRequest);

    // Proves ServerFacade converted DTOs into real User instances
    expect(users[0]).toBeInstanceOf(User);
  });
});