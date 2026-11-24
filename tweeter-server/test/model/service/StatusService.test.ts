// AI-assisted: see AI-ATTRIBUTION.md

import { beforeEach, describe, expect, it } from "@jest/globals";
import { StatusDto, UserDto } from "tweeter-shared";
import { StatusService } from "../../../src/model/service/StatusService";
import { FakeDAOFactory } from "../../fakes/FakeDAOFactory";

const ALICE = "@alice";
const BOB = "@bob";
const CAROL = "@carol";
const DAVE = "@dave";
const ALICE_TOKEN = "alice-token";

const nowEpochSeconds = (): number => Math.floor(Date.now() / 1000);

const makeUser = (alias: string): UserDto => ({
    firstName: alias.slice(1),
    lastName: "Test",
    alias,
    imageUrl: `https://example.com/${alias.slice(1)}.png`,
});

const makeStatus = (alias: string, timestamp: number): StatusDto => ({
    post: `${alias} at ${timestamp}`,
    user: makeUser(alias),
    timestamp,
});

describe("StatusService", () => {
    let factory: FakeDAOFactory;
    let service: StatusService;

    beforeEach(async () => {
        factory = new FakeDAOFactory();
        service = new StatusService(factory);
        await factory.authTokenDAO.putToken(ALICE_TOKEN, ALICE, nowEpochSeconds() + 3600);
    });

    describe("loadMoreStoryItems", () => {
        beforeEach(async () => {
            // Seeded out of order; pages come back newest first.
            for (const timestamp of [200, 400, 100, 300]) {
                await factory.statusDAO.putStory(makeStatus(BOB, timestamp));
            }
        });

        it("returns the first page newest first", async () => {
            const [statuses, hasMore] = await service.loadMoreStoryItems(ALICE_TOKEN, BOB, 2, null);

            expect(statuses).toEqual([makeStatus(BOB, 400), makeStatus(BOB, 300)]);
            expect(hasMore).toBe(true);
        });

        it("continues after lastItem on the next page", async () => {
            const [firstPage] = await service.loadMoreStoryItems(ALICE_TOKEN, BOB, 2, null);
            const lastItem = firstPage[firstPage.length - 1];

            const [statuses, hasMore] = await service.loadMoreStoryItems(ALICE_TOKEN, BOB, 2, lastItem);

            expect(statuses).toEqual([makeStatus(BOB, 200), makeStatus(BOB, 100)]);
            expect(hasMore).toBe(false);
        });

        it("rejects an invalid token as unauthorized", async () => {
            await expect(service.loadMoreStoryItems("bogus-token", BOB, 2, null)).rejects.toThrow(
                /^\[unauthorized\]/
            );
        });
    });

    describe("loadMoreFeedItems", () => {
        beforeEach(async () => {
            await factory.statusDAO.putFeedItems([ALICE], makeStatus(BOB, 100));
            await factory.statusDAO.putFeedItems([ALICE], makeStatus(CAROL, 300));
            await factory.statusDAO.putFeedItems([ALICE], makeStatus(BOB, 200));
        });

        it("returns the first page newest first", async () => {
            const [statuses, hasMore] = await service.loadMoreFeedItems(ALICE_TOKEN, ALICE, 2, null);

            expect(statuses).toEqual([makeStatus(CAROL, 300), makeStatus(BOB, 200)]);
            expect(hasMore).toBe(true);
        });

        it("continues after lastItem on the next page", async () => {
            const [firstPage] = await service.loadMoreFeedItems(ALICE_TOKEN, ALICE, 2, null);
            const lastItem = firstPage[firstPage.length - 1];

            const [statuses, hasMore] = await service.loadMoreFeedItems(ALICE_TOKEN, ALICE, 2, lastItem);

            expect(statuses).toEqual([makeStatus(BOB, 100)]);
            expect(hasMore).toBe(false);
        });

        it("rejects an invalid token as unauthorized", async () => {
            await expect(service.loadMoreFeedItems("bogus-token", ALICE, 2, null)).rejects.toThrow(
                /^\[unauthorized\]/
            );
        });
    });

    describe("postStatus", () => {
        const status = makeStatus(ALICE, 500);

        it("adds the status to the author's story and every follower's feed only", async () => {
            await factory.followDAO.putFollow(BOB, ALICE);
            await factory.followDAO.putFollow(CAROL, ALICE);
            // Dave follows Bob, not Alice, so he must not receive the status.
            await factory.followDAO.putFollow(DAVE, BOB);

            await service.postStatus(ALICE_TOKEN, status);

            expect(factory.statusDAO.stories.get(ALICE)).toEqual([status]);
            expect(factory.statusDAO.feeds.get(BOB)).toEqual([status]);
            expect(factory.statusDAO.feeds.get(CAROL)).toEqual([status]);
            expect(factory.statusDAO.feeds.has(DAVE)).toBe(false);
            expect(factory.statusDAO.feeds.has(ALICE)).toBe(false);
        });

        it("still writes the story when the author has no followers", async () => {
            await service.postStatus(ALICE_TOKEN, status);

            expect(factory.statusDAO.stories.get(ALICE)).toEqual([status]);
            expect(factory.statusDAO.feeds.size).toBe(0);
        });

        it("rejects posting as a different user than the token's as unauthorized", async () => {
            await factory.followDAO.putFollow(CAROL, BOB);

            await expect(service.postStatus(ALICE_TOKEN, makeStatus(BOB, 500))).rejects.toThrow(
                /^\[unauthorized\]/
            );
            expect(factory.statusDAO.stories.size).toBe(0);
            expect(factory.statusDAO.feeds.size).toBe(0);
        });

        it("rejects an invalid token as unauthorized", async () => {
            await expect(service.postStatus("bogus-token", status)).rejects.toThrow(/^\[unauthorized\]/);
            expect(factory.statusDAO.stories.size).toBe(0);
        });
    });
});
