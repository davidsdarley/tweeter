import { AuthToken, Status, FakeData } from "tweeter-shared";

export class StatusService {
    public async loadMoreStoryItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    };
    
    public async loadMoreFeedItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    };
    public async postStatus(newStatus: Status, authToken: AuthToken): Promise<void>{
        return new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server to post the status
      };
    
}