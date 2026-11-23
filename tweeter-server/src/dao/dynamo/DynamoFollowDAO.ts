// AI-assisted: see AI-ATTRIBUTION.md
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { FollowDAO } from "../FollowDAO";
import { TABLES } from "./DynamoConfig";
import { DynamoItem, queryPage } from "./DynamoPaging";

const FOLLOWER_KEY = "follower_alias";
const FOLLOWEE_KEY = "followee_alias";

// Page size used when reading every follower (e.g. feed fan-out).
const ALL_FOLLOWERS_PAGE_SIZE = 500;

export class DynamoFollowDAO implements FollowDAO {
    private readonly client: DynamoDBDocumentClient;
    private readonly tableName = TABLES.follows;
    private readonly indexName = TABLES.followsIndex;

    public constructor(client: DynamoDBDocumentClient) {
        this.client = client;
    }

    public async putFollow(
        followerAlias: string,
        followeeAlias: string
    ): Promise<void> {
        await this.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: this.key(followerAlias, followeeAlias),
            })
        );
    }

    public async deleteFollow(
        followerAlias: string,
        followeeAlias: string
    ): Promise<void> {
        await this.client.send(
            new DeleteCommand({
                TableName: this.tableName,
                Key: this.key(followerAlias, followeeAlias),
            })
        );
    }

    public async isFollower(
        followerAlias: string,
        followeeAlias: string
    ): Promise<boolean> {
        const result = await this.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: this.key(followerAlias, followeeAlias),
            })
        );
        return result.Item !== undefined;
    }

    public async getFolloweeAliases(
        alias: string,
        pageSize: number,
        lastAlias: string | null
    ): Promise<[string[], boolean]> {
        const [items, hasMore] = await queryPage(this.client, {
            tableName: this.tableName,
            partitionKeyName: FOLLOWER_KEY,
            partitionKeyValue: alias,
            pageSize,
            exclusiveStartKey:
                lastAlias === null ? undefined : this.key(alias, lastAlias),
        });
        return [this.extract(items, FOLLOWEE_KEY), hasMore];
    }

    public async getFollowerAliases(
        alias: string,
        pageSize: number,
        lastAlias: string | null
    ): Promise<[string[], boolean]> {
        const [items, hasMore] = await queryPage(this.client, {
            tableName: this.tableName,
            indexName: this.indexName,
            partitionKeyName: FOLLOWEE_KEY,
            partitionKeyValue: alias,
            pageSize,
            // GSI start keys need both the index and table keys; here they are
            // the same two attributes, so the table key covers both.
            exclusiveStartKey:
                lastAlias === null ? undefined : this.key(lastAlias, alias),
        });
        return [this.extract(items, FOLLOWER_KEY), hasMore];
    }

    public async getAllFollowerAliases(alias: string): Promise<string[]> {
        const all: string[] = [];
        let lastAlias: string | null = null;
        let hasMore = true;

        while (hasMore) {
            const [page, more]: [string[], boolean] =
                await this.getFollowerAliases(
                    alias,
                    ALL_FOLLOWERS_PAGE_SIZE,
                    lastAlias
                );
            all.push(...page);
            hasMore = more && page.length > 0;
            lastAlias = page.length > 0 ? page[page.length - 1] : lastAlias;
        }

        return all;
    }

    private key(followerAlias: string, followeeAlias: string): DynamoItem {
        return { [FOLLOWER_KEY]: followerAlias, [FOLLOWEE_KEY]: followeeAlias };
    }

    private extract(items: DynamoItem[], attribute: string): string[] {
        return items.map((item) => item[attribute] as string);
    }
}
