// AI-assisted: see AI-ATTRIBUTION.md
import {
    BatchGetCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { UserDto } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import { retryUnprocessed } from "./DynamoBatchRetry";
import { TABLES } from "./DynamoConfig";

type Item = Record<string, unknown>;

const BATCH_GET_LIMIT = 100;

// Attributes safe to return to callers; never includes passwordHash.
const USER_PROJECTION = "#alias, firstName, lastName, imageUrl";
const USER_PROJECTION_NAMES = { "#alias": "alias" };

export class DynamoUserDAO implements UserDAO {
    private readonly client: DynamoDBDocumentClient;
    private readonly tableName = TABLES.user;

    public constructor(client: DynamoDBDocumentClient) {
        this.client = client;
    }

    public async getUser(alias: string): Promise<UserDto | null> {
        const result = await this.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { alias },
                ProjectionExpression: USER_PROJECTION,
                ExpressionAttributeNames: USER_PROJECTION_NAMES,
            })
        );
        return result.Item === undefined ? null : this.toUserDto(result.Item);
    }

    public async getUsers(aliases: string[]): Promise<UserDto[]> {
        // BatchGet rejects duplicate keys within one request.
        const uniqueAliases = [...new Set(aliases)];
        const found = new Map<string, UserDto>();

        for (let i = 0; i < uniqueAliases.length; i += BATCH_GET_LIMIT) {
            const chunk = uniqueAliases.slice(i, i + BATCH_GET_LIMIT);
            const items = await this.batchGetChunk(chunk);
            for (const item of items) {
                const user = this.toUserDto(item);
                found.set(user.alias, user);
            }
        }

        // Preserve input order; omit aliases with no matching user.
        const ordered: UserDto[] = [];
        for (const alias of aliases) {
            const user = found.get(alias);
            if (user !== undefined) {
                ordered.push(user);
            }
        }
        return ordered;
    }

    public async putUser(user: UserDto, passwordHash: string): Promise<void> {
        await this.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: {
                    alias: user.alias,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    imageUrl: user.imageUrl,
                    passwordHash,
                    followerCount: 0,
                    followeeCount: 0,
                },
                ConditionExpression: "attribute_not_exists(#alias)",
                ExpressionAttributeNames: { "#alias": "alias" },
            })
        );
    }

    public async getPasswordHash(alias: string): Promise<string | null> {
        const result = await this.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { alias },
                ProjectionExpression: "passwordHash",
            })
        );
        const hash = result.Item?.passwordHash;
        return typeof hash === "string" ? hash : null;
    }

    public async incrementFollowerCount(alias: string): Promise<void> {
        await this.addToCount(alias, "followerCount", 1);
    }

    public async decrementFollowerCount(alias: string): Promise<void> {
        await this.addToCount(alias, "followerCount", -1);
    }

    public async incrementFolloweeCount(alias: string): Promise<void> {
        await this.addToCount(alias, "followeeCount", 1);
    }

    public async decrementFolloweeCount(alias: string): Promise<void> {
        await this.addToCount(alias, "followeeCount", -1);
    }

    public async getFollowerCount(alias: string): Promise<number> {
        return this.getCount(alias, "followerCount");
    }

    public async getFolloweeCount(alias: string): Promise<number> {
        return this.getCount(alias, "followeeCount");
    }

    private async batchGetChunk(aliases: string[]): Promise<Item[]> {
        const results: Item[] = [];

        await retryUnprocessed<Item>(
            aliases.map((alias) => ({ alias })),
            async (keys) => {
                const result = await this.client.send(
                    new BatchGetCommand({
                        RequestItems: {
                            [this.tableName]: {
                                Keys: keys,
                                ProjectionExpression: USER_PROJECTION,
                                ExpressionAttributeNames: USER_PROJECTION_NAMES,
                            },
                        },
                    })
                );
                results.push(...(result.Responses?.[this.tableName] ?? []));
                return result.UnprocessedKeys?.[this.tableName]?.Keys ?? [];
            },
            (remaining) =>
                `BatchGet left ${remaining} keys unprocessed after retries`
        );

        return results;
    }

    private async addToCount(
        alias: string,
        attribute: "followerCount" | "followeeCount",
        delta: number
    ): Promise<void> {
        await this.client.send(
            new UpdateCommand({
                TableName: this.tableName,
                Key: { alias },
                UpdateExpression: "ADD #count :delta",
                // ADD would otherwise create a stub item for a missing alias.
                ConditionExpression: "attribute_exists(#alias)",
                ExpressionAttributeNames: { "#alias": "alias", "#count": attribute },
                ExpressionAttributeValues: { ":delta": delta },
            })
        );
    }

    private async getCount(
        alias: string,
        attribute: "followerCount" | "followeeCount"
    ): Promise<number> {
        const result = await this.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { alias },
                ProjectionExpression: "#count",
                ExpressionAttributeNames: { "#count": attribute },
            })
        );
        const count = result.Item?.[attribute];
        return typeof count === "number" ? count : 0;
    }

    private toUserDto(item: Item): UserDto {
        return {
            alias: item.alias as string,
            firstName: item.firstName as string,
            lastName: item.lastName as string,
            imageUrl: item.imageUrl as string,
        };
    }
}
