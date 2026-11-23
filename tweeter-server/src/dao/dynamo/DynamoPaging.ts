// AI-assisted: see AI-ATTRIBUTION.md
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

export type DynamoItem = Record<string, unknown>;

export interface PageQuery {
    readonly tableName: string;
    readonly indexName?: string;
    readonly partitionKeyName: string;
    readonly partitionKeyValue: string;
    readonly pageSize: number;
    // Full key of the last item from the previous page (table key + index key
    // for a GSI query). Undefined means the first page.
    readonly exclusiveStartKey?: DynamoItem;
    // false = descending sort key order (newest first for timestamp keys).
    readonly scanIndexForward?: boolean;
}

// Queries one page of items sharing a partition key. Returns [items, hasMore].
//
// Asks for one extra item so hasMore is accurate: relying only on
// LastEvaluatedKey reports hasMore=true when exactly pageSize items remain,
// which makes the client request an empty page.
export async function queryPage(
    client: DynamoDBDocumentClient,
    query: PageQuery
): Promise<[DynamoItem[], boolean]> {
    if (!Number.isInteger(query.pageSize) || query.pageSize < 1) {
        throw new Error(
            `[bad-request] pageSize must be a positive integer, got ${query.pageSize}`
        );
    }

    const result = await client.send(
        new QueryCommand({
            TableName: query.tableName,
            IndexName: query.indexName,
            KeyConditionExpression: "#pk = :pk",
            ExpressionAttributeNames: { "#pk": query.partitionKeyName },
            ExpressionAttributeValues: { ":pk": query.partitionKeyValue },
            Limit: query.pageSize + 1,
            ExclusiveStartKey: query.exclusiveStartKey,
            ScanIndexForward: query.scanIndexForward ?? true,
        })
    );

    const items = result.Items ?? [];
    if (items.length > query.pageSize) {
        return [items.slice(0, query.pageSize), true];
    }
    // Fewer items than requested but a LastEvaluatedKey means the 1MB response
    // cap cut the page short, so more items may remain.
    return [items, result.LastEvaluatedKey !== undefined];
}
