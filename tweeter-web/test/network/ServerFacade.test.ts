// AI-assisted: see AI-ATTRIBUTION.md
import "isomorphic-fetch";
import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { ServerFacade } from "../../src/network/ServerFacade";
import {
  AuthToken,
  PagedStatusItemRequest,
  PagedUserItemRequest,
  Status,
  User,
} from "tweeter-shared";

// Integration tests against the deployed API. They expect the data written by
// tweeter-server/scripts/seed.ts:
// - @seeduser (password "password") follows @user1..@user18
// - @seeduser is followed by @user8..@user25
// - @seeduser has 16 story statuses; its feed has one status from each followee
//
// The tests leave the data as they found it: follow is always undone by
// unfollow, and postStatus/register only exercise requests the server rejects.
// Login creates auth tokens; afterAll logs the main one out.

// Cold Lambda starts plus bcrypt on login can exceed Jest's 5s default.
jest.setTimeout(30000);

const SEED_ALIAS = "@seeduser";
const SEED_PASSWORD = "password";
const SEED_IMAGE_URL =
  "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
const SEED_STORY_COUNT = 16;

const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);
const userAliases = (start: number, end: number): string[] =>
  range(start, end).map((n) => `@user${n}`);

const SEED_FOLLOWEES = userAliases(1, 18);
const SEED_FOLLOWERS = userAliases(8, 25);
// A user @seeduser does not follow, used for the follow/unfollow round trip.
const NOT_FOLLOWED_ALIAS = "@user25";

describe("ServerFacade integration", () => {
  const serverFacade = new ServerFacade();
  let token: string;

  beforeAll(async () => {
    const [, authToken] = await serverFacade.login({
      token: "",
      userAlias: SEED_ALIAS,
      password: SEED_PASSWORD,
    });
    token = authToken.token;
  });

  afterAll(async () => {
    if (token) {
      await serverFacade.logout({ token, userAlias: SEED_ALIAS });
    }
  });

  const userPageRequest = (pageSize: number): PagedUserItemRequest => ({
    token,
    userAlias: SEED_ALIAS,
    pageSize,
    lastItem: null,
  });

  const statusPageRequest = (pageSize: number): PagedStatusItemRequest => ({
    token,
    userAlias: SEED_ALIAS,
    pageSize,
    lastItem: null,
  });

  // Pages through every user, failing if any page overlaps an earlier one.
  const allUsers = async (
    getPage: (request: PagedUserItemRequest) => Promise<[User[], boolean]>
  ): Promise<string[]> => {
    const aliases: string[] = [];
    let request = userPageRequest(10);
    let hasMore = true;
    while (hasMore) {
      const [users, more] = await getPage(request);
      for (const user of users) {
        expect(aliases).not.toContain(user.alias);
        aliases.push(user.alias);
      }
      hasMore = more;
      if (users.length > 0) {
        request = { ...request, lastItem: users[users.length - 1].toDto() };
      }
    }
    return aliases;
  };

  const allStatuses = async (
    getPage: (request: PagedStatusItemRequest) => Promise<[Status[], boolean]>
  ): Promise<Status[]> => {
    const statuses: Status[] = [];
    let request = statusPageRequest(10);
    let hasMore = true;
    while (hasMore) {
      const [page, more] = await getPage(request);
      for (const status of page) {
        expect(statuses.some((s) => s.equals(status))).toBe(false);
        statuses.push(status);
      }
      hasMore = more;
      if (page.length > 0) {
        request = { ...request, lastItem: page[page.length - 1].toDto() };
      }
    }
    return statuses;
  };

  describe("auth", () => {
    it("login returns the seeded user and an AuthToken", async () => {
      const [user, authToken] = await serverFacade.login({
        token: "",
        userAlias: SEED_ALIAS,
        password: SEED_PASSWORD,
      });

      expect(user).toBeInstanceOf(User);
      expect(user.alias).toBe(SEED_ALIAS);
      expect(authToken).toBeInstanceOf(AuthToken);
      expect(authToken.token.length).toBeGreaterThan(0);

      await serverFacade.logout({ token: authToken.token, userAlias: SEED_ALIAS });
    });

    it("login rejects a wrong password", async () => {
      await expect(
        serverFacade.login({ token: "", userAlias: SEED_ALIAS, password: "wrong-password" })
      ).rejects.toThrow();
    });

    it("register rejects an alias that is already taken", async () => {
      await expect(
        serverFacade.register({
          token: "",
          userAlias: SEED_ALIAS,
          password: "password",
          firstName: "Duplicate",
          lastName: "User",
          userImageBytes: "ZmFrZSBpbWFnZSBieXRlcw==", // base64 of "fake image bytes"
          imageFileExtension: "png",
        })
      ).rejects.toThrow();
    });

    it("logout ends the session so the token no longer works", async () => {
      const [, authToken] = await serverFacade.login({
        token: "",
        userAlias: SEED_ALIAS,
        password: SEED_PASSWORD,
      });

      await expect(
        serverFacade.logout({ token: authToken.token, userAlias: SEED_ALIAS })
      ).resolves.toBeUndefined();

      await expect(
        serverFacade.getUser({ token: authToken.token, userAlias: SEED_ALIAS })
      ).rejects.toThrow();
    });

    it("rejects an authenticated request with an invalid token", async () => {
      await expect(
        serverFacade.getFolloweeCount({ token: "not-a-real-token", userAlias: SEED_ALIAS })
      ).rejects.toThrow();
    });
  });

  describe("users", () => {
    it("getUser returns the seeded user", async () => {
      const user = await serverFacade.getUser({ token, userAlias: SEED_ALIAS });

      expect(user).toBeInstanceOf(User);
      expect(user?.toDto()).toEqual({
        alias: SEED_ALIAS,
        firstName: "Seed",
        lastName: "User",
        imageUrl: SEED_IMAGE_URL,
      });
    });

    it("getUser rejects an unknown alias", async () => {
      await expect(
        serverFacade.getUser({ token, userAlias: "@no-such-user" })
      ).rejects.toThrow();
    });
  });

  describe("follows", () => {
    it("getMoreFollowees returns a full first page of User objects", async () => {
      const [users, hasMore] = await serverFacade.getMoreFollowees(userPageRequest(10));

      expect(users).toHaveLength(10);
      expect(hasMore).toBe(true);
      for (const user of users) {
        expect(user).toBeInstanceOf(User);
        expect(SEED_FOLLOWEES).toContain(user.alias);
      }
    });

    it("getMoreFollowees respects a smaller page size", async () => {
      const [users] = await serverFacade.getMoreFollowees(userPageRequest(3));

      expect(users).toHaveLength(3);
    });

    it("getMoreFollowees pages through exactly the seeded followees", async () => {
      const aliases = await allUsers((r) => serverFacade.getMoreFollowees(r));

      expect([...aliases].sort()).toEqual([...SEED_FOLLOWEES].sort());
    });

    it("getMoreFollowers pages through exactly the seeded followers", async () => {
      const aliases = await allUsers((r) => serverFacade.getMoreFollowers(r));

      expect([...aliases].sort()).toEqual([...SEED_FOLLOWERS].sort());
    });

    it("getFolloweeCount and getFollowerCount match the seeded follows", async () => {
      const request = { token, userAlias: SEED_ALIAS };

      expect(await serverFacade.getFolloweeCount(request)).toBe(SEED_FOLLOWEES.length);
      expect(await serverFacade.getFollowerCount(request)).toBe(SEED_FOLLOWERS.length);
    });

    it("getFollowerCount returns the requested user's count, not the logged-in user's", async () => {
      // @user25's followers are all peer @userN follows (at most 10), so its
      // count differs from @seeduser's 18.
      const count = await serverFacade.getFollowerCount({ token, userAlias: NOT_FOLLOWED_ALIAS });

      expect(Number.isInteger(count)).toBe(true);
      expect(count).not.toBe(SEED_FOLLOWERS.length);
    });

    it("getIsFollowerStatus reports whether @seeduser follows the selected user", async () => {
      expect(
        await serverFacade.getIsFollowerStatus({
          token,
          userAlias: SEED_ALIAS,
          selectedUserAlias: SEED_FOLLOWEES[0],
        })
      ).toBe(true);

      expect(
        await serverFacade.getIsFollowerStatus({
          token,
          userAlias: SEED_ALIAS,
          selectedUserAlias: NOT_FOLLOWED_ALIAS,
        })
      ).toBe(false);
    });

    it("follow then unfollow updates and restores the followed user's counts", async () => {
      const request = { token, userAlias: NOT_FOLLOWED_ALIAS };
      const followersBefore = await serverFacade.getFollowerCount(request);
      const followeesBefore = await serverFacade.getFolloweeCount(request);

      let followed = false;
      try {
        const [followersAfterFollow, followeesAfterFollow] = await serverFacade.follow(request);
        followed = true;
        expect(followersAfterFollow).toBe(followersBefore + 1);
        expect(followeesAfterFollow).toBe(followeesBefore);
        expect(
          await serverFacade.getIsFollowerStatus({
            token,
            userAlias: SEED_ALIAS,
            selectedUserAlias: NOT_FOLLOWED_ALIAS,
          })
        ).toBe(true);
      } finally {
        if (followed) {
          const [followersAfterUnfollow, followeesAfterUnfollow] =
            await serverFacade.unfollow(request);
          expect(followersAfterUnfollow).toBe(followersBefore);
          expect(followeesAfterUnfollow).toBe(followeesBefore);
        }
      }
    });
  });

  describe("statuses", () => {
    it("getMoreStoryItems respects a smaller page size", async () => {
      const [statuses] = await serverFacade.getMoreStoryItems(statusPageRequest(3));

      expect(statuses).toHaveLength(3);
    });

    it("getMoreStoryItems pages through the seeded story, all by @seeduser", async () => {
      const statuses = await allStatuses((r) => serverFacade.getMoreStoryItems(r));

      expect(statuses).toHaveLength(SEED_STORY_COUNT);
      for (const status of statuses) {
        expect(status).toBeInstanceOf(Status);
        expect(status.user.alias).toBe(SEED_ALIAS);
      }
    });

    it("getMoreFeedItems respects a smaller page size", async () => {
      const [statuses] = await serverFacade.getMoreFeedItems(statusPageRequest(3));

      expect(statuses).toHaveLength(3);
    });

    it("getMoreFeedItems pages through one status from each followee", async () => {
      const statuses = await allStatuses((r) => serverFacade.getMoreFeedItems(r));

      const authors = statuses.map((s) => s.user.alias);
      expect([...authors].sort()).toEqual([...SEED_FOLLOWEES].sort());
    });

    it("getMoreFeedItems returns newest statuses first", async () => {
      const [statuses] = await serverFacade.getMoreFeedItems(statusPageRequest(10));

      for (let i = 1; i < statuses.length; i++) {
        expect(statuses[i - 1].timestamp).toBeGreaterThanOrEqual(statuses[i].timestamp);
      }
    });

    it("postStatus rejects a status posted as a different user", async () => {
      const otherUser = new User("User", "1", SEED_FOLLOWEES[0], SEED_IMAGE_URL);
      const status = new Status("Should be rejected", otherUser, Date.now());

      await expect(
        serverFacade.postStatus({
          token,
          userAlias: otherUser.alias,
          newStatus: status.toDto(),
        })
      ).rejects.toThrow();
    });
  });
});
