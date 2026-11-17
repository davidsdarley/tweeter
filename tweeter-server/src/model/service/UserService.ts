// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, UserDto } from "tweeter-shared";

export class UserService {
    public async getUser(token: string, alias: string): Promise<UserDto | null> {
        // TODO: Replace with the result of calling the database
        const user = FakeData.instance.findUserByAlias(alias);
        return user ? user.toDto() : null;
    };

    public async getFolloweeCount(token: string, userAlias: string): Promise<number> {
        // TODO: Replace with the result of calling the database
        return FakeData.instance.getFolloweeCount(userAlias);
    };

    public async getFollowerCount(token: string, userAlias: string): Promise<number> {
        // TODO: Replace with the result of calling the database
        return FakeData.instance.getFollowerCount(userAlias);
    };

    public async getIsFollowerStatus(token: string, userAlias: string, selectedUserAlias: string): Promise<boolean> {
        // TODO: Replace with the result of calling the database
        return FakeData.instance.isFollower();
    };
}
