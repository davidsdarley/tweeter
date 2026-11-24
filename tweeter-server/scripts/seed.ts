// AI-assisted: see AI-ATTRIBUTION.md

// Fills DynamoDB with test data through the DAOs (no direct DynamoDB calls).
//
// Run from tweeter-server/:
//   npx tsc -p scripts && node scripts/dist/scripts/seed.js
//
// Safe to rerun:
// - Users that already exist are skipped.
// - A follow that already exists is skipped, so counts are not bumped twice.
// - Statuses use fixed timestamps, so rerunning overwrites the same story and
//   feed items instead of adding duplicates.
//
// Paced for 4 WCU per table: every write is followed by a short pause, and
// feed fan-out goes out in small batches. Unprocessed batch items are retried
// by the DAO's retry helper; throttled single writes by the AWS SDK.

import { hash } from "bcryptjs";
import { StatusDto, UserDto } from "tweeter-shared";
import { DynamoDAOFactory } from "../src/dao/dynamo/DynamoDAOFactory";

// Same cost factor UserService.register uses.
const SALT_ROUNDS = 10;
const PASSWORD = "password";
const IMAGE_URL =
    "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";

const SEED_ALIAS = "@seeduser";
const USER_COUNT = 25;

// @seeduser follows @user1..@user18 and is followed by @user8..@user25.
const FOLLOWEE_NUMBERS = range(1, 18);
const FOLLOWER_NUMBERS = range(8, 25);
const SEED_STATUS_COUNT = 16;

// Among the other users (wrapping from @user25 back to @user1):
// - @userN follows the next (N % 6) users, which varies followees, and
// - @userN is followed by the previous (N % 10) users, which varies followers.
// With the @seeduser follows, every @userN ends up with 2-10 of each.
const PEER_FOLLOWEE_MOD = 6;
const PEER_FOLLOWER_MOD = 10;

interface FollowPair {
    readonly follower: string;
    readonly followee: string;
}

const FOLLOWS: readonly FollowPair[] = uniquePairs([
    ...FOLLOWEE_NUMBERS.map((n) => ({ follower: SEED_ALIAS, followee: userAlias(n) })),
    ...FOLLOWER_NUMBERS.map((n) => ({ follower: userAlias(n), followee: SEED_ALIAS })),
    ...range(1, USER_COUNT).flatMap((n) =>
        range(1, n % PEER_FOLLOWEE_MOD).map((offset) => ({
            follower: userAlias(n),
            followee: wrappedUserAlias(n + offset),
        }))
    ),
    ...range(1, USER_COUNT).flatMap((n) =>
        range(1, n % PEER_FOLLOWER_MOD).map((offset) => ({
            follower: wrappedUserAlias(n - offset),
            followee: userAlias(n),
        }))
    ),
]);

// Pause after each single write (~3 writes/second per table).
const WRITE_PAUSE_MS = 300;
// Feed receivers per putFeedItems call, and the pause between calls.
const FEED_BATCH_SIZE = 4;
const FEED_BATCH_PAUSE_MS = 1000;

// Fixed so reruns produce the same keys. Milliseconds, like Date.now() on the client.
const BASE_TIMESTAMP = Date.UTC(2026, 9, 1, 12, 0, 0);
const HOUR_MS = 60 * 60 * 1000;

const factory = new DynamoDAOFactory();
const userDAO = factory.getUserDAO();
const followDAO = factory.getFollowDAO();
const statusDAO = factory.getStatusDAO();

async function main(): Promise<void> {
    const seedUsers: UserDto[] = [
        user(SEED_ALIAS, "Seed", "User"),
        ...range(1, USER_COUNT).map((n) => user(userAlias(n), "User", `${n}`)),
    ];

    console.log(`Creating ${seedUsers.length} users...`);
    for (const u of seedUsers) {
        await createUserIfMissing(u);
    }

    console.log(`Creating ${FOLLOWS.length} follows...`);
    for (const { follower, followee } of FOLLOWS) {
        await followIfMissing(follower, followee);
    }

    // Statuses copy the stored user, so existing users keep their real names.
    const stored = await userDAO.getUsers(seedUsers.map((u) => u.alias));
    const usersByAlias = new Map(stored.map((u) => [u.alias, u]));
    const storedUser = (alias: string): UserDto => {
        const found = usersByAlias.get(alias);
        if (found === undefined) {
            throw new Error(`User ${alias} missing after creation`);
        }
        return found;
    };

    console.log(`Posting ${SEED_STATUS_COUNT} statuses for ${SEED_ALIAS}...`);
    for (let i = 0; i < SEED_STATUS_COUNT; i++) {
        await postStatus({
            post: seedPost(i),
            user: storedUser(SEED_ALIAS),
            timestamp: BASE_TIMESTAMP + i * 2 * HOUR_MS,
        });
    }

    console.log(`Posting ${FOLLOWEE_NUMBERS.length} statuses from followees...`);
    for (const [i, n] of FOLLOWEE_NUMBERS.entries()) {
        await postStatus({
            post: followeePost(n),
            user: storedUser(userAlias(n)),
            timestamp: BASE_TIMESTAMP + (i * 2 + 1) * HOUR_MS,
        });
    }

    const followeeCount = await userDAO.getFolloweeCount(SEED_ALIAS);
    const followerCount = await userDAO.getFollowerCount(SEED_ALIAS);
    console.log(
        `Done. ${SEED_ALIAS}: ${followeeCount} followees, ${followerCount} followers.`
    );
}

async function createUserIfMissing(u: UserDto): Promise<void> {
    if ((await userDAO.getUser(u.alias)) !== null) {
        console.log(`  skip ${u.alias} (exists)`);
        return;
    }
    const passwordHash = await hash(PASSWORD, SALT_ROUNDS);
    await userDAO.putUser(u, passwordHash);
    console.log(`  created ${u.alias}`);
    await pause(WRITE_PAUSE_MS);
}

// Same steps as FollowService.follow, so the stored counts match the follows table.
async function followIfMissing(followerAlias: string, followeeAlias: string): Promise<void> {
    if (await followDAO.isFollower(followerAlias, followeeAlias)) {
        return;
    }
    await followDAO.putFollow(followerAlias, followeeAlias);
    await pause(WRITE_PAUSE_MS);
    await userDAO.incrementFollowerCount(followeeAlias);
    await pause(WRITE_PAUSE_MS);
    await userDAO.incrementFolloweeCount(followerAlias);
    await pause(WRITE_PAUSE_MS);
}

// Same steps as StatusService.postStatus: story item, then one feed item per follower.
async function postStatus(status: StatusDto): Promise<void> {
    await statusDAO.putStory(status);
    await pause(WRITE_PAUSE_MS);

    const followers = await followDAO.getAllFollowerAliases(status.user.alias);
    // follows_index is eventually consistent and was just written, so also
    // include the followers this script created. putFeedItems removes duplicates.
    const receivers = [...new Set([...followers, ...plannedFollowers(status.user.alias)])];

    for (let i = 0; i < receivers.length; i += FEED_BATCH_SIZE) {
        await statusDAO.putFeedItems(receivers.slice(i, i + FEED_BATCH_SIZE), status);
        await pause(FEED_BATCH_PAUSE_MS);
    }
}

function plannedFollowers(alias: string): string[] {
    return FOLLOWS.filter((pair) => pair.followee === alias).map((pair) => pair.follower);
}

function seedPost(i: number): string {
    const mention = userAlias((i % USER_COUNT) + 1);
    return `Seed status #${i + 1}. Hello ${mention}! https://byu.edu`;
}

function followeePost(n: number): string {
    return `Status from User ${n}, saying hi to ${SEED_ALIAS}.`;
}

function user(alias: string, firstName: string, lastName: string): UserDto {
    return { alias, firstName, lastName, imageUrl: IMAGE_URL };
}

function userAlias(n: number): string {
    return `@user${n}`;
}

// Maps any integer onto 1..USER_COUNT, so 26 -> @user1 and 0 -> @user25.
function wrappedUserAlias(n: number): string {
    return userAlias((((n - 1) % USER_COUNT) + USER_COUNT) % USER_COUNT + 1);
}

// The two peer rules can produce the same pair; keep the first of each.
function uniquePairs(pairs: FollowPair[]): FollowPair[] {
    const seen = new Set<string>();
    return pairs.filter(({ follower, followee }) => {
        const key = `${follower}>${followee}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function range(from: number, to: number): number[] {
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

function pause(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
});
