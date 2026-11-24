// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "tweeter-shared";
import { DAOFactory } from "../../dao/DAOFactory";
import { FollowDAO } from "../../dao/FollowDAO";
import { UserDAO } from "../../dao/UserDAO";
import { AuthorizationService } from "./AuthorizationService";
import { requireAlias, requirePositivePageSize, requireToken } from "./RequestValidation";

type AliasPageQuery = (
    alias: string,
    pageSize: number,
    lastAlias: string | null
) => Promise<[string[], boolean]>;

export class FollowService {
    private readonly followDAO: FollowDAO;
    private readonly userDAO: UserDAO;
    private readonly authorizationService: AuthorizationService;

    public constructor(daoFactory: DAOFactory) {
        this.followDAO = daoFactory.getFollowDAO();
        this.userDAO = daoFactory.getUserDAO();
        this.authorizationService = new AuthorizationService(daoFactory);
    }

    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        requireToken(token);
        requireAlias(userAlias);
        requirePositivePageSize(pageSize);
        await this.authorizationService.authorize(token);

        return this.loadUserPage(
            (alias, size, lastAlias) => this.followDAO.getFolloweeAliases(alias, size, lastAlias),
            userAlias,
            pageSize,
            lastItem
        );
    };

    public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        requireToken(token);
        requireAlias(userAlias);
        requirePositivePageSize(pageSize);
        await this.authorizationService.authorize(token);

        return this.loadUserPage(
            (alias, size, lastAlias) => this.followDAO.getFollowerAliases(alias, size, lastAlias),
            userAlias,
            pageSize,
            lastItem
        );
    };

    // Returns the followed user's [followerCount, followeeCount] after the follow.
    public async follow(
        token: string,
        userToFollowAlias: string
    ): Promise<[followerCount: number, followeeCount: number]> {
        requireToken(token);
        requireAlias(userToFollowAlias);
        const followerAlias = await this.authorizationService.authorize(token);

        // Already following: leave the counts alone so they are not bumped twice.
        if (!(await this.followDAO.isFollower(followerAlias, userToFollowAlias))) {
            await this.followDAO.putFollow(followerAlias, userToFollowAlias);
            await this.userDAO.incrementFollowerCount(userToFollowAlias);
            await this.userDAO.incrementFolloweeCount(followerAlias);
        }

        return this.getFollowCounts(userToFollowAlias);
    };

    // Returns the unfollowed user's [followerCount, followeeCount] after the unfollow.
    public async unfollow(
        token: string,
        userToUnfollowAlias: string
    ): Promise<[followerCount: number, followeeCount: number]> {
        requireToken(token);
        requireAlias(userToUnfollowAlias);
        const followerAlias = await this.authorizationService.authorize(token);

        // Not following: nothing to undo, so the counts stay as they are.
        if (await this.followDAO.isFollower(followerAlias, userToUnfollowAlias)) {
            await this.followDAO.deleteFollow(followerAlias, userToUnfollowAlias);
            await this.userDAO.decrementFollowerCount(userToUnfollowAlias);
            await this.userDAO.decrementFolloweeCount(followerAlias);
        }

        return this.getFollowCounts(userToUnfollowAlias);
    };

    public async getFolloweeCount(token: string, userAlias: string): Promise<number> {
        requireToken(token);
        requireAlias(userAlias);
        await this.authorizationService.authorize(token);

        return this.userDAO.getFolloweeCount(userAlias);
    };

    public async getFollowerCount(token: string, userAlias: string): Promise<number> {
        requireToken(token);
        requireAlias(userAlias);
        await this.authorizationService.authorize(token);

        return this.userDAO.getFollowerCount(userAlias);
    };

    // True when userAlias follows selectedUserAlias.
    public async getIsFollowerStatus(
        token: string,
        userAlias: string,
        selectedUserAlias: string
    ): Promise<boolean> {
        requireToken(token);
        requireAlias(userAlias);
        requireAlias(selectedUserAlias, "selected user alias");
        await this.authorizationService.authorize(token);

        return this.followDAO.isFollower(userAlias, selectedUserAlias);
    };

    private async loadUserPage(
        getAliasPage: AliasPageQuery,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        const [aliases, hasMore] = await getAliasPage(
            userAlias,
            pageSize,
            lastItem === null ? null : lastItem.alias
        );
        const users = await this.userDAO.getUsers(aliases);
        return [users, hasMore];
    }

    private async getFollowCounts(alias: string): Promise<[followerCount: number, followeeCount: number]> {
        const followerCount = await this.userDAO.getFollowerCount(alias);
        const followeeCount = await this.userDAO.getFolloweeCount(alias);
        return [followerCount, followeeCount];
    }
}
