import { FakeData, User, UserDto } from "tweeter-shared";

export class FollowService {
    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null  ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);
      };
    public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null  ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);
      };

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