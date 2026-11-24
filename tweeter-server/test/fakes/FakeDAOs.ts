// AI-assisted: see AI-ATTRIBUTION.md

// In-memory DAO implementations for service and lambda tests. They hold
// state in plain Maps/arrays and expose it as public fields so tests can
// seed data and inspect what a service wrote.

import { StatusDto, UserDto } from "tweeter-shared";
import { AuthTokenDAO, AuthTokenRecord } from "../../src/dao/AuthTokenDAO";
import { FollowDAO } from "../../src/dao/FollowDAO";
import { ImageDAO } from "../../src/dao/ImageDAO";
import { StatusDAO } from "../../src/dao/StatusDAO";
import { UserDAO } from "../../src/dao/UserDAO";

interface StoredUser {
    user: UserDto;
    passwordHash: string;
    followerCount: number;
    followeeCount: number;
}

export class FakeUserDAO implements UserDAO {
    public readonly users = new Map<string, StoredUser>();

    public async getUser(alias: string): Promise<UserDto | null> {
        return this.users.get(alias)?.user ?? null;
    }

    public async getUsers(aliases: string[]): Promise<UserDto[]> {
        return aliases
            .map((alias) => this.users.get(alias)?.user)
            .filter((user): user is UserDto => user !== undefined);
    }

    public async putUser(user: UserDto, passwordHash: string): Promise<void> {
        this.users.set(user.alias, { user, passwordHash, followerCount: 0, followeeCount: 0 });
    }

    public async getPasswordHash(alias: string): Promise<string | null> {
        return this.users.get(alias)?.passwordHash ?? null;
    }

    public async incrementFollowerCount(alias: string): Promise<void> {
        this.adjust(alias, "followerCount", 1);
    }

    public async decrementFollowerCount(alias: string): Promise<void> {
        this.adjust(alias, "followerCount", -1);
    }

    public async incrementFolloweeCount(alias: string): Promise<void> {
        this.adjust(alias, "followeeCount", 1);
    }

    public async decrementFolloweeCount(alias: string): Promise<void> {
        this.adjust(alias, "followeeCount", -1);
    }

    public async getFollowerCount(alias: string): Promise<number> {
        return this.users.get(alias)?.followerCount ?? 0;
    }

    public async getFolloweeCount(alias: string): Promise<number> {
        return this.users.get(alias)?.followeeCount ?? 0;
    }

    private adjust(alias: string, field: "followerCount" | "followeeCount", delta: number): void {
        const stored = this.users.get(alias);
        if (stored !== undefined) {
            stored[field] += delta;
        }
    }
}

// Returns up to pageSize items after `lastKey` from a list already in page order.
const pageAfter = <T>(
    items: T[],
    pageSize: number,
    lastKey: string | null,
    keyOf: (item: T) => string
): [T[], boolean] => {
    const start = lastKey === null ? 0 : items.findIndex((item) => keyOf(item) === lastKey) + 1;
    const page = items.slice(start, start + pageSize);
    return [page, start + pageSize < items.length];
};

export class FakeFollowDAO implements FollowDAO {
    // Each entry is [followerAlias, followeeAlias].
    public readonly follows: Array<[string, string]> = [];

    public async putFollow(followerAlias: string, followeeAlias: string): Promise<void> {
        if (!(await this.isFollower(followerAlias, followeeAlias))) {
            this.follows.push([followerAlias, followeeAlias]);
        }
    }

    public async deleteFollow(followerAlias: string, followeeAlias: string): Promise<void> {
        const index = this.follows.findIndex(
            ([follower, followee]) => follower === followerAlias && followee === followeeAlias
        );
        if (index >= 0) {
            this.follows.splice(index, 1);
        }
    }

    public async isFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
        return this.follows.some(
            ([follower, followee]) => follower === followerAlias && followee === followeeAlias
        );
    }

    public async getFolloweeAliases(
        alias: string,
        pageSize: number,
        lastAlias: string | null
    ): Promise<[string[], boolean]> {
        const followees = this.follows
            .filter(([follower]) => follower === alias)
            .map(([, followee]) => followee)
            .sort();
        return pageAfter(followees, pageSize, lastAlias, (a) => a);
    }

    public async getFollowerAliases(
        alias: string,
        pageSize: number,
        lastAlias: string | null
    ): Promise<[string[], boolean]> {
        return pageAfter(await this.getAllFollowerAliases(alias), pageSize, lastAlias, (a) => a);
    }

    public async getAllFollowerAliases(alias: string): Promise<string[]> {
        return this.follows
            .filter(([, followee]) => followee === alias)
            .map(([follower]) => follower)
            .sort();
    }
}

const statusKey = (status: StatusDto): string => `${status.timestamp}#${status.user.alias}`;
const newestFirst = (a: StatusDto, b: StatusDto): number => b.timestamp - a.timestamp;

export class FakeStatusDAO implements StatusDAO {
    public readonly stories = new Map<string, StatusDto[]>();
    public readonly feeds = new Map<string, StatusDto[]>();

    public async putStory(status: StatusDto): Promise<void> {
        this.append(this.stories, status.user.alias, status);
    }

    public async getStoryPage(
        alias: string,
        pageSize: number,
        lastStatus: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        return this.page(this.stories, alias, pageSize, lastStatus);
    }

    public async putFeedItems(receiverAliases: string[], status: StatusDto): Promise<void> {
        receiverAliases.forEach((alias) => this.append(this.feeds, alias, status));
    }

    public async getFeedPage(
        alias: string,
        pageSize: number,
        lastStatus: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        return this.page(this.feeds, alias, pageSize, lastStatus);
    }

    private append(table: Map<string, StatusDto[]>, alias: string, status: StatusDto): void {
        table.set(alias, [...(table.get(alias) ?? []), status]);
    }

    private page(
        table: Map<string, StatusDto[]>,
        alias: string,
        pageSize: number,
        lastStatus: StatusDto | null
    ): [StatusDto[], boolean] {
        const sorted = [...(table.get(alias) ?? [])].sort(newestFirst);
        return pageAfter(sorted, pageSize, lastStatus === null ? null : statusKey(lastStatus), statusKey);
    }
}

export class FakeAuthTokenDAO implements AuthTokenDAO {
    public readonly tokens = new Map<string, AuthTokenRecord>();

    public async putToken(token: string, alias: string, expiresAt: number): Promise<void> {
        this.tokens.set(token, { token, alias, expiresAt });
    }

    public async getToken(token: string): Promise<AuthTokenRecord | null> {
        return this.tokens.get(token) ?? null;
    }

    public async updateExpiration(token: string, expiresAt: number): Promise<void> {
        const record = this.tokens.get(token);
        if (record !== undefined) {
            this.tokens.set(token, { ...record, expiresAt });
        }
    }

    public async deleteToken(token: string): Promise<void> {
        this.tokens.delete(token);
    }
}

export const FAKE_IMAGE_BASE_URL = "https://fake-bucket.example/";

export class FakeImageDAO implements ImageDAO {
    // File name -> base64 image bytes.
    public readonly images = new Map<string, string>();

    public async putImage(fileName: string, imageBase64: string): Promise<string> {
        this.images.set(fileName, imageBase64);
        return `${FAKE_IMAGE_BASE_URL}${fileName}`;
    }
}
