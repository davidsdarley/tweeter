// AI-assisted: see AI-ATTRIBUTION.md

import { beforeEach, describe, expect, it } from "@jest/globals";
import { UserDto } from "tweeter-shared";
import { FollowService } from "../../../src/model/service/FollowService";
import { FakeDAOFactory } from "../../fakes/FakeDAOFactory";

const ALICE = "@alice";
const BOB = "@bob";
const ALICE_TOKEN = "alice-token";
const OTHER_ALIASES = ["@bob", "@carol", "@dave", "@erin"];

const nowEpochSeconds = (): number => Math.floor(Date.now() / 1000);

const makeUser = (alias: string): UserDto => ({
    firstName: alias.slice(1),
    lastName: "Test",
    alias,
    imageUrl: `https://example.com/${alias.slice(1)}.png`,
});

describe("FollowService", () => {
    let factory: FakeDAOFactory;
    let service: FollowService;

    const counts = async (alias: string): Promise<[number, number]> => [
        await factory.userDAO.getFollowerCount(alias),
        await factory.userDAO.getFolloweeCount(alias),
    ];

    beforeEach(async () => {
        factory = new FakeDAOFactory();
        service = new FollowService(factory);

        for (const alias of [ALICE, ...OTHER_ALIASES]) {
            await factory.userDAO.putUser(makeUser(alias), "unused-hash");
        }
        await factory.authTokenDAO.putToken(ALICE_TOKEN, ALICE, nowEpochSeconds() + 3600);
    });

    describe("loadMoreFollowees", () => {
        beforeEach(async () => {
            // Seeded out of order; the DAO returns pages in alias order.
            for (const alias of ["@erin", "@bob", "@dave", "@carol"]) {
                await factory.followDAO.putFollow(ALICE, alias);
            }
        });

        it("returns the first page of followees in order", async () => {
            const [users, hasMore] = await service.loadMoreFollowees(ALICE_TOKEN, ALICE, 2, null);

            expect(users).toEqual([makeUser("@bob"), makeUser("@carol")]);
            expect(hasMore).toBe(true);
        });

        it("continues after lastItem on the next page", async () => {
            const [firstPage] = await service.loadMoreFollowees(ALICE_TOKEN, ALICE, 2, null);
            const lastItem = firstPage[firstPage.length - 1];

            const [users, hasMore] = await service.loadMoreFollowees(ALICE_TOKEN, ALICE, 2, lastItem);

            expect(users).toEqual([makeUser("@dave"), makeUser("@erin")]);
            expect(hasMore).toBe(false);
        });

        it("returns an empty page for a user who follows no one", async () => {
            expect(await service.loadMoreFollowees(ALICE_TOKEN, BOB, 2, null)).toEqual([[], false]);
        });
    });

    describe("loadMoreFollowers", () => {
        beforeEach(async () => {
            for (const alias of ["@dave", "@carol", "@erin", "@bob"]) {
                await factory.followDAO.putFollow(alias, ALICE);
            }
        });

        it("returns the first page of followers in order", async () => {
            const [users, hasMore] = await service.loadMoreFollowers(ALICE_TOKEN, ALICE, 3, null);

            expect(users).toEqual([makeUser("@bob"), makeUser("@carol"), makeUser("@dave")]);
            expect(hasMore).toBe(true);
        });

        it("continues after lastItem on the next page", async () => {
            const [firstPage] = await service.loadMoreFollowers(ALICE_TOKEN, ALICE, 3, null);
            const lastItem = firstPage[firstPage.length - 1];

            const [users, hasMore] = await service.loadMoreFollowers(ALICE_TOKEN, ALICE, 3, lastItem);

            expect(users).toEqual([makeUser("@erin")]);
            expect(hasMore).toBe(false);
        });
    });

    describe("follow", () => {
        it("records the follow for the token's user and updates both counts", async () => {
            const [followerCount, followeeCount] = await service.follow(ALICE_TOKEN, BOB);

            expect(await factory.followDAO.isFollower(ALICE, BOB)).toBe(true);
            expect(await counts(BOB)).toEqual([1, 0]);
            expect(await counts(ALICE)).toEqual([0, 1]);
            // The response carries the followed user's counts.
            expect([followerCount, followeeCount]).toEqual([1, 0]);
        });

        it("does not double-count when following the same user twice", async () => {
            await service.follow(ALICE_TOKEN, BOB);
            const [followerCount, followeeCount] = await service.follow(ALICE_TOKEN, BOB);

            expect(await counts(BOB)).toEqual([1, 0]);
            expect(await counts(ALICE)).toEqual([0, 1]);
            expect([followerCount, followeeCount]).toEqual([1, 0]);
            expect(factory.followDAO.follows).toEqual([[ALICE, BOB]]);
        });
    });

    describe("unfollow", () => {
        it("removes the follow and updates both counts", async () => {
            await service.follow(ALICE_TOKEN, BOB);

            const [followerCount, followeeCount] = await service.unfollow(ALICE_TOKEN, BOB);

            expect(await factory.followDAO.isFollower(ALICE, BOB)).toBe(false);
            expect(await counts(BOB)).toEqual([0, 0]);
            expect(await counts(ALICE)).toEqual([0, 0]);
            expect([followerCount, followeeCount]).toEqual([0, 0]);
        });

        it("changes nothing when the user is not being followed", async () => {
            const [followerCount, followeeCount] = await service.unfollow(ALICE_TOKEN, BOB);

            expect(await counts(BOB)).toEqual([0, 0]);
            expect(await counts(ALICE)).toEqual([0, 0]);
            expect([followerCount, followeeCount]).toEqual([0, 0]);
            expect(factory.followDAO.follows).toEqual([]);
        });
    });

    describe("counts", () => {
        it("reads follower and followee counts from the user DAO", async () => {
            await service.follow(ALICE_TOKEN, BOB);
            await service.follow(ALICE_TOKEN, "@carol");

            expect(await service.getFolloweeCount(ALICE_TOKEN, ALICE)).toBe(2);
            expect(await service.getFollowerCount(ALICE_TOKEN, ALICE)).toBe(0);
            expect(await service.getFollowerCount(ALICE_TOKEN, BOB)).toBe(1);
        });
    });

    describe("getIsFollowerStatus", () => {
        it("is true after follow and false after unfollow", async () => {
            expect(await service.getIsFollowerStatus(ALICE_TOKEN, ALICE, BOB)).toBe(false);

            await service.follow(ALICE_TOKEN, BOB);
            expect(await service.getIsFollowerStatus(ALICE_TOKEN, ALICE, BOB)).toBe(true);
            // Following is one-directional.
            expect(await service.getIsFollowerStatus(ALICE_TOKEN, BOB, ALICE)).toBe(false);

            await service.unfollow(ALICE_TOKEN, BOB);
            expect(await service.getIsFollowerStatus(ALICE_TOKEN, ALICE, BOB)).toBe(false);
        });
    });

    describe("authorization", () => {
        const BAD_TOKEN = "no-such-token";
        const calls: Array<[string, () => Promise<unknown>]> = [
            ["loadMoreFollowees", () => service.loadMoreFollowees(BAD_TOKEN, ALICE, 10, null)],
            ["loadMoreFollowers", () => service.loadMoreFollowers(BAD_TOKEN, ALICE, 10, null)],
            ["getFolloweeCount", () => service.getFolloweeCount(BAD_TOKEN, ALICE)],
            ["getFollowerCount", () => service.getFollowerCount(BAD_TOKEN, ALICE)],
            ["follow", () => service.follow(BAD_TOKEN, BOB)],
            ["unfollow", () => service.unfollow(BAD_TOKEN, BOB)],
            ["getIsFollowerStatus", () => service.getIsFollowerStatus(BAD_TOKEN, ALICE, BOB)],
        ];

        it.each(calls)("%s rejects an invalid token with [unauthorized]", async (_name, call) => {
            await expect(call()).rejects.toThrow(/^\[unauthorized\]/);
        });

        it("rejects an expired token with [unauthorized]", async () => {
            await factory.authTokenDAO.putToken("expired-token", ALICE, nowEpochSeconds() - 1);

            await expect(service.follow("expired-token", BOB)).rejects.toThrow(/^\[unauthorized\]/);
        });

        it("does not change any follows or counts when follow is unauthorized", async () => {
            await expect(service.follow(BAD_TOKEN, BOB)).rejects.toThrow(/^\[unauthorized\]/);

            expect(factory.followDAO.follows).toEqual([]);
            expect(await counts(BOB)).toEqual([0, 0]);
        });
    });
});
