// AI-assisted: see AI-ATTRIBUTION.md
import {
    BatchWriteCommand,
    DynamoDBDocumentClient,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { StatusDto } from "tweeter-shared";
import { StatusDAO } from "../StatusDAO";
import { retryUnprocessed } from "./DynamoBatchRetry";
import { TABLES } from "./DynamoConfig";
import { DynamoItem, queryPage } from "./DynamoPaging";

const ALIAS_KEY = "alias";
const STORY_SORT_KEY = "timestamp";
const FEED_SORT_KEY = "timestamp_alias";

const BATCH_WRITE_LIMIT = 25;

// Feed sort key: "<timestamp>#<authorAlias>". Used both when writing feed items
// and when building ExclusiveStartKey, so the two can never drift apart.
function feedSortKey(timestamp: number, authorAlias: string): string {
    return `${timestamp}#${authorAlias}`;
}

export class DynamoStatusDAO implements StatusDAO {
    private readonly client: DynamoDBDocumentClient;
    private readonly storyTable = TABLES.story;
    private readonly feedTable = TABLES.feed;

    public constructor(client: DynamoDBDocumentClient) {
        this.client = client;
    }

    public async putStory(status: StatusDto): Promise<void> {
        await this.client.send(
            new PutCommand({
                TableName: this.storyTable,
                Item: {
                    [ALIAS_KEY]: status.user.alias,
                    [STORY_SORT_KEY]: status.timestamp,
                    ...this.statusAttributes(status),
                },
            })
        );
    }

    public async getStoryPage(
        alias: string,
        pageSize: number,
        lastStatus: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        const [items, hasMore] = await queryPage(this.client, {
            tableName: this.storyTable,
            partitionKeyName: ALIAS_KEY,
            partitionKeyValue: alias,
            pageSize,
            scanIndexForward: false,
            exclusiveStartKey:
                lastStatus === null
                    ? undefined
                    : {
                          [ALIAS_KEY]: alias,
                          [STORY_SORT_KEY]: lastStatus.timestamp,
                      },
        });
        return [items.map((item) => this.toStatusDto(item)), hasMore];
    }

    public async putFeedItems(
        receiverAliases: string[],
        status: StatusDto
    ): Promise<void> {
        // Duplicate keys within one BatchWrite are rejected by DynamoDB.
        const receivers = [...new Set(receiverAliases)];
        const sortKey = feedSortKey(status.timestamp, status.user.alias);
        const attributes = this.statusAttributes(status);

        const items: DynamoItem[] = receivers.map((receiver) => ({
            [ALIAS_KEY]: receiver,
            [FEED_SORT_KEY]: sortKey,
            ...attributes,
        }));

        for (let i = 0; i < items.length; i += BATCH_WRITE_LIMIT) {
            await this.batchWriteChunk(items.slice(i, i + BATCH_WRITE_LIMIT));
        }
    }

    public async getFeedPage(
        alias: string,
        pageSize: number,
        lastStatus: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        const [items, hasMore] = await queryPage(this.client, {
            tableName: this.feedTable,
            partitionKeyName: ALIAS_KEY,
            partitionKeyValue: alias,
            pageSize,
            scanIndexForward: false,
            exclusiveStartKey:
                lastStatus === null
                    ? undefined
                    : {
                          [ALIAS_KEY]: alias,
                          [FEED_SORT_KEY]: feedSortKey(
                              lastStatus.timestamp,
                              lastStatus.user.alias
                          ),
                      },
        });
        return [items.map((item) => this.toStatusDto(item)), hasMore];
    }

    private async batchWriteChunk(items: DynamoItem[]): Promise<void> {
        await retryUnprocessed<DynamoItem>(
            items,
            async (pending) => {
                const result = await this.client.send(
                    new BatchWriteCommand({
                        RequestItems: {
                            [this.feedTable]: pending.map((item) => ({
                                PutRequest: { Item: item },
                            })),
                        },
                    })
                );
                const unprocessed =
                    result.UnprocessedItems?.[this.feedTable] ?? [];
                const retry: DynamoItem[] = [];
                for (const request of unprocessed) {
                    if (request.PutRequest?.Item !== undefined) {
                        retry.push(request.PutRequest.Item);
                    }
                }
                return retry;
            },
            (remaining) =>
                `BatchWrite left ${remaining} feed items unprocessed after retries`
        );
    }

    // The full status copy stored on both story and feed items, so pages can be
    // built without looking up the author.
    private statusAttributes(status: StatusDto): DynamoItem {
        return {
            post: status.post,
            timestamp: status.timestamp,
            authorAlias: status.user.alias,
            firstName: status.user.firstName,
            lastName: status.user.lastName,
            imageUrl: status.user.imageUrl,
        };
    }

    private toStatusDto(item: DynamoItem): StatusDto {
        return {
            post: item.post as string,
            timestamp: item.timestamp as number,
            user: {
                alias: item.authorAlias as string,
                firstName: item.firstName as string,
                lastName: item.lastName as string,
                imageUrl: item.imageUrl as string,
            },
        };
    }
}
