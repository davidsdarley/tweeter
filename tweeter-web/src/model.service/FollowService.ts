import { AuthToken, FakeData, User } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService {
    private serverFacade = new ServerFacade();

    public async loadMoreFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {



        // TODO: Replace with the result of calling server
        return this.serverFacade.getMoreFollowees({
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem ? lastItem.toDto() : null
        });
        
      };



      public async loadMoreFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
      };
}