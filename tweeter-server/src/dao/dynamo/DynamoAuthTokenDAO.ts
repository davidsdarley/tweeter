// AI-assisted: see AI-ATTRIBUTION.md
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthTokenDAO, AuthTokenRecord } from "../AuthTokenDAO";
import { TABLES } from "./DynamoConfig";

export class DynamoAuthTokenDAO implements AuthTokenDAO {
    private readonly client: DynamoDBDocumentClient;
    private readonly tableName = TABLES.authToken;

    public constructor(client: DynamoDBDocumentClient) {
        this.client = client;
    }

    public async putToken(
        token: string,
        alias: string,
        expiresAt: number
    ): Promise<void> {
        await this.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: { token, alias, expiresAt },
            })
        );
    }

    public async getToken(token: string): Promise<AuthTokenRecord | null> {
        const result = await this.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { token },
            })
        );
        const item = result.Item;
        if (item === undefined) {
            return null;
        }
        return {
            token: item.token as string,
            alias: item.alias as string,
            expiresAt: item.expiresAt as number,
        };
    }

    public async updateExpiration(
        token: string,
        expiresAt: number
    ): Promise<void> {
        await this.client.send(
            new UpdateCommand({
                TableName: this.tableName,
                Key: { token },
                UpdateExpression: "SET expiresAt = :expiresAt",
                // Don't recreate a token that was deleted (logout) or expired by TTL.
                ConditionExpression: "attribute_exists(#token)",
                ExpressionAttributeNames: { "#token": "token" },
                ExpressionAttributeValues: { ":expiresAt": expiresAt },
            })
        );
    }

    public async deleteToken(token: string): Promise<void> {
        await this.client.send(
            new DeleteCommand({
                TableName: this.tableName,
                Key: { token },
            })
        );
    }
}
