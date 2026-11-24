// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";
import { DAOFactory } from "../../dao/DAOFactory";
import { FollowDAO } from "../../dao/FollowDAO";
import { StatusDAO } from "../../dao/StatusDAO";
import { AuthorizationService } from "./AuthorizationService";
import { requireAlias, requirePositivePageSize, requireToken } from "./RequestValidation";

export class StatusService {
    private readonly statusDAO: StatusDAO;
    private readonly followDAO: FollowDAO;
    private readonly authorizationService: AuthorizationService;

    public constructor(daoFactory: DAOFactory) {
        this.statusDAO = daoFactory.getStatusDAO();
        this.followDAO = daoFactory.getFollowDAO();
        this.authorizationService = new AuthorizationService(daoFactory);
    }

    // Returns [statuses, hasMore] from userAlias's story, newest first.
    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        requireToken(token);
        requireAlias(userAlias);
        requirePositivePageSize(pageSize);
        await this.authorizationService.authorize(token);

        return this.statusDAO.getStoryPage(userAlias, pageSize, lastItem);
    };

    // Returns [statuses, hasMore] from userAlias's feed, newest first.
    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        requireToken(token);
        requireAlias(userAlias);
        requirePositivePageSize(pageSize);
        await this.authorizationService.authorize(token);

        return this.statusDAO.getFeedPage(userAlias, pageSize, lastItem);
    };

    // Writes the status to its author's story and to each follower's feed.
    public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
        requireToken(token);
        if (!newStatus || !newStatus.user) {
            throw new Error("[bad-request] Missing status");
        }
        const authorAlias = newStatus.user.alias;
        requireAlias(authorAlias, "status author alias");

        const tokenAlias = await this.authorizationService.authorize(token);
        if (tokenAlias !== authorAlias) {
            throw new Error("[unauthorized] Cannot post a status as another user");
        }

        await this.statusDAO.putStory(newStatus);

        const followerAliases = await this.followDAO.getAllFollowerAliases(authorAlias);
        if (followerAliases.length > 0) {
            await this.statusDAO.putFeedItems(followerAliases, newStatus);
        }
    };
}
