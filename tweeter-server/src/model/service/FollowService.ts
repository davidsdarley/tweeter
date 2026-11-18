// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, User, UserDto } from "tweeter-shared";
import { requireAlias, requirePositivePageSize, requireToken } from "./RequestValidation";

export class FollowService {
    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null  ): Promise<[UserDto[], boolean]> {
        requireToken(token);
        requireAlias(userAlias);
        requirePositivePageSize(pageSize);
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);
      };
    public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null  ): Promise<[UserDto[], boolean]> {
        requireToken(token);
        requireAlias(userAlias);
        requirePositivePageSize(pageSize);
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);
      };

    public async follow(
        token: string,
        userToFollowAlias: string
      ): Promise<[followerCount: number, followeeCount: number]> {
        requireToken(token);
        requireAlias(userToFollowAlias);
        // TODO: Call the database to record the follow
        return this.getFollowCounts(token, userToFollowAlias);
      };

    public async unfollow(
        token: string,
        userToUnfollowAlias: string
      ): Promise<[followerCount: number, followeeCount: number]> {
        requireToken(token);
        requireAlias(userToUnfollowAlias);
        // TODO: Call the database to remove the follow
        return this.getFollowCounts(token, userToUnfollowAlias);
      };

    public async getFolloweeCount(token: string, userAlias: string): Promise<number> {
        requireToken(token);
        requireAlias(userAlias);
        // TODO: Replace with the result of calling the database
        return FakeData.instance.getFolloweeCount(userAlias);
    };

    public async getFollowerCount(token: string, userAlias: string): Promise<number> {
        requireToken(token);
        requireAlias(userAlias);
        // TODO: Replace with the result of calling the database
        return FakeData.instance.getFollowerCount(userAlias);
    };

    public async getIsFollowerStatus(token: string, userAlias: string, selectedUserAlias: string): Promise<boolean> {
        requireToken(token);
        requireAlias(userAlias);
        requireAlias(selectedUserAlias, "selected user alias");
        // TODO: Replace with the result of calling the database
        return FakeData.instance.isFollower();
    };

    private async getFollowCounts(token: string, userAlias: string): Promise<[followerCount: number, followeeCount: number]> {
      const followerCount = await this.getFollowerCount(token, userAlias);
      const followeeCount = await this.getFolloweeCount(token, userAlias);
      return [followerCount, followeeCount];
    }

    private getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
      const [items, hasMore] = FakeData.instance.getPageOfUsers(this.getDomainObject(lastItem), pageSize, userAlias);
      const dtoItems = items.map((user) => this.getDtoObject(user));
      return Promise.resolve([dtoItems, hasMore]);
    }

    private getDtoObject(user: User): UserDto {
      return {firstName: user.firstName, lastName: user.lastName, alias: user.alias, imageUrl: user.imageUrl};
    }


    private getDomainObject(dto: UserDto | null): User | null {
        if (dto === null) {
            return null;
        }
        return new User(dto.firstName, dto.lastName, dto.alias, dto.imageUrl);
    }
}