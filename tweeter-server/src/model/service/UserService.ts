// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDto, FakeData, UserDto } from "tweeter-shared";

export class UserService {
    public async login(alias: string, password: string): Promise<[UserDto | null, AuthTokenDto]> {
        // TODO: Replace with the result of calling the database
        const user = FakeData.instance.firstUser;
        return [user ? user.toDto() : null, FakeData.instance.authToken.toDto()];
    };

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string,
        imageFileExtension: string
    ): Promise<[UserDto | null, AuthTokenDto]> {
        // TODO: Replace with the result of calling the database
        const user = FakeData.instance.firstUser;
        return [user ? user.toDto() : null, FakeData.instance.authToken.toDto()];
    };

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
