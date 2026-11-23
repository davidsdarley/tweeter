// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "tweeter-shared";

export interface UserDAO {
    getUser(alias: string): Promise<UserDto | null>;
    // Aliases with no matching user are omitted from the result.
    getUsers(aliases: string[]): Promise<UserDto[]>;
    putUser(user: UserDto, passwordHash: string): Promise<void>;
    getPasswordHash(alias: string): Promise<string | null>;
    incrementFollowerCount(alias: string): Promise<void>;
    decrementFollowerCount(alias: string): Promise<void>;
    incrementFolloweeCount(alias: string): Promise<void>;
    decrementFolloweeCount(alias: string): Promise<void>;
    getFollowerCount(alias: string): Promise<number>;
    getFolloweeCount(alias: string): Promise<number>;
}
