// AI-assisted: see AI-ATTRIBUTION.md

export interface FollowDAO {
    putFollow(followerAlias: string, followeeAlias: string): Promise<void>;
    deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;
    isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
    // Aliases of the users that `alias` follows. Returns [aliases, hasMore].
    getFolloweeAliases(
        alias: string,
        pageSize: number,
        lastAlias: string | null
    ): Promise<[string[], boolean]>;
    // Aliases of the users who follow `alias`. Returns [aliases, hasMore].
    getFollowerAliases(
        alias: string,
        pageSize: number,
        lastAlias: string | null
    ): Promise<[string[], boolean]>;
    getAllFollowerAliases(alias: string): Promise<string[]>;
}
