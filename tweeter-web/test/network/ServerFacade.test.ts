// AI-assisted: see AI-ATTRIBUTION.md
import "isomorphic-fetch";
import { ServerFacade } from "../../src/network/ServerFacade";
import {
  AuthToken,
  FakeData,
  IsFollowerRequest,
  PagedStatusItemRequest,
  PagedUserItemRequest,
  Status,
  TweeterRequest,
  User,
} from "tweeter-shared";

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

  const firstFeedPageRequest: PagedStatusItemRequest = {
    token: "fake-token",
    userAlias: "@allen",
    pageSize: 10,
    lastItem: null,
  };

  it("getMoreFeedItems returns the next page with no overlap", async () => {
    const [firstPage] = await serverFacade.getMoreFeedItems(firstFeedPageRequest);
    const lastStatus = firstPage[firstPage.length - 1];

    const [secondPage] = await serverFacade.getMoreFeedItems({
      ...firstFeedPageRequest,
      lastItem: lastStatus.toDto(),
    });

    expect(secondPage.length).toBeGreaterThan(0);
    for (const status of secondPage) {
      expect(firstPage.some((s) => s.equals(status))).toBe(false);
    }
  });

  it("getMoreFeedItems respects a smaller page size", async () => {
    const [statuses] = await serverFacade.getMoreFeedItems({
      ...firstFeedPageRequest,
      pageSize: 3,
    });

    expect(statuses).toHaveLength(3);
  });

  it("getMoreStoryItems returns the next page with no overlap", async () => {
    const [firstPage] = await serverFacade.getMoreStoryItems(firstFeedPageRequest);
    const lastStatus = firstPage[firstPage.length - 1];

    const [secondPage] = await serverFacade.getMoreStoryItems({
      ...firstFeedPageRequest,
      lastItem: lastStatus.toDto(),
    });

    expect(secondPage.length).toBeGreaterThan(0);
    for (const status of secondPage) {
      expect(firstPage.some((s) => s.equals(status))).toBe(false);
    }
  });

  it("getMoreStoryItems respects a smaller page size", async () => {
    const [statuses] = await serverFacade.getMoreStoryItems({
      ...firstFeedPageRequest,
      pageSize: 3,
    });

    expect(statuses).toHaveLength(3);
  });

  it("postStatus resolves without error for a valid status", async () => {
    const user = FakeData.instance.firstUser!;
    const newStatus = new Status("Hello from the ServerFacade test", user, Date.now());

    await expect(
      serverFacade.postStatus({
        token: "fake-token",
        userAlias: user.alias,
        newStatus: newStatus.toDto(),
      })
    ).resolves.toBeUndefined();
  });

  const userRequest: TweeterRequest = {
    token: "fake-token",
    userAlias: "@allen",
  };

  it("getUser returns the user FakeData provides", async () => {
    const expectedUser = FakeData.instance.findUserByAlias("@allen");

    const user = await serverFacade.getUser(userRequest);

    expect(user).toBeInstanceOf(User);
    expect(user?.toDto()).toEqual(expectedUser?.toDto());
  });

  it("getUser returns null for an unknown alias", async () => {
    const user = await serverFacade.getUser({
      ...userRequest,
      userAlias: "@no-such-user",
    });

    expect(user).toBeNull();
  });

  it("getFolloweeCount returns an integer count between 1 and 10", async () => {
    const count = await serverFacade.getFolloweeCount(userRequest);

    expect(Number.isInteger(count)).toBe(true);
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(10);
  });

  it("getFollowerCount returns an integer count between 1 and 10", async () => {
    const count = await serverFacade.getFollowerCount(userRequest);

    expect(Number.isInteger(count)).toBe(true);
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(10);
  });

  it("getIsFollowerStatus returns a boolean", async () => {
    const request: IsFollowerRequest = {
      ...userRequest,
      selectedUserAlias: "@amy",
    };

    const isFollower = await serverFacade.getIsFollowerStatus(request);

    expect(typeof isFollower).toBe("boolean");
  });

  it("follow returns integer follower and followee counts between 1 and 10", async () => {
    const [followerCount, followeeCount] = await serverFacade.follow({
      ...userRequest,
      userAlias: "@amy",
    });

    for (const count of [followerCount, followeeCount]) {
      expect(Number.isInteger(count)).toBe(true);
      expect(count).toBeGreaterThanOrEqual(1);
      expect(count).toBeLessThanOrEqual(10);
    }
  });

  it("unfollow returns integer follower and followee counts between 1 and 10", async () => {
    const [followerCount, followeeCount] = await serverFacade.unfollow({
      ...userRequest,
      userAlias: "@amy",
    });

    for (const count of [followerCount, followeeCount]) {
      expect(Number.isInteger(count)).toBe(true);
      expect(count).toBeGreaterThanOrEqual(1);
      expect(count).toBeLessThanOrEqual(10);
    }
  });

  it("login returns the user FakeData provides and an AuthToken", async () => {
    const expectedUser = FakeData.instance.firstUser;

    const [user, authToken] = await serverFacade.login({
      token: "",
      userAlias: "@allen",
      password: "password",
    });

    expect(user).toBeInstanceOf(User);
    expect(user.toDto()).toEqual(expectedUser?.toDto());
    expect(authToken).toBeInstanceOf(AuthToken);
    expect(authToken.token.length).toBeGreaterThan(0);
  });

  it("register returns the user FakeData provides and an AuthToken", async () => {
    const expectedUser = FakeData.instance.firstUser;

    const [user, authToken] = await serverFacade.register({
      token: "",
      userAlias: "@newuser",
      password: "password",
      firstName: "New",
      lastName: "User",
      userImageBytes: "ZmFrZSBpbWFnZSBieXRlcw==", // base64 of "fake image bytes"
      imageFileExtension: "png",
    });

    expect(user).toBeInstanceOf(User);
    expect(user.toDto()).toEqual(expectedUser?.toDto());
    expect(authToken).toBeInstanceOf(AuthToken);
    expect(authToken.token.length).toBeGreaterThan(0);
  });

  it("logout resolves without error for a valid token", async () => {
    await expect(
      serverFacade.logout({ token: "fake-token", userAlias: "" })
    ).resolves.toBeUndefined();
  });
});
