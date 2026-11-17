// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, UserDto } from "tweeter-shared";

export class UserService {
    public async getUser(token: string, alias: string): Promise<UserDto | null> {
        // TODO: Replace with the result of calling the database
        const user = FakeData.instance.findUserByAlias(alias);
        return user ? user.toDto() : null;
    };

    public async logout(token: string): Promise<void> {
        // TODO: Call the database to invalidate the auth token
        return Promise.resolve();
    };
}
