// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService {
    private serverFacade = new ServerFacade();

    public async loadMoreFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {

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
        return this.serverFacade.getMoreFollowers({
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem ? lastItem.toDto() : null
        });
      };

      public async follow(
        authToken: AuthToken,
        userToFollow: User
      ): Promise<[followerCount: number, followeeCount: number]> {
        return this.serverFacade.follow({
            token: authToken.token,
            userAlias: userToFollow.alias
        });
      };

      public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
      ): Promise<[followerCount: number, followeeCount: number]> {
        return this.serverFacade.unfollow({
            token: authToken.token,
            userAlias: userToUnfollow.alias
        });
      };
}
