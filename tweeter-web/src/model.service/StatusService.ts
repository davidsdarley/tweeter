// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, Status } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService {
    private serverFacade = new ServerFacade();

    public async loadMoreStoryItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        return this.serverFacade.getMoreStoryItems({
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem ? lastItem.toDto() : null
        });
    };

    public async loadMoreFeedItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        return this.serverFacade.getMoreFeedItems({
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem ? lastItem.toDto() : null
        });
    };
    public async postStatus(newStatus: Status, authToken: AuthToken): Promise<void>{
        return new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server to post the status
      };

}