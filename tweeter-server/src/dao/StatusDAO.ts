// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";

export interface StatusDAO {
    putStory(status: StatusDto): Promise<void>;
    // Returns [statuses, hasMore], newest first.
    getStoryPage(
        alias: string,
        pageSize: number,
        lastStatus: StatusDto | null
    ): Promise<[StatusDto[], boolean]>;
    putFeedItems(receiverAliases: string[], status: StatusDto): Promise<void>;
    // Returns [statuses, hasMore], newest first.
    getFeedPage(
        alias: string,
        pageSize: number,
        lastStatus: StatusDto | null
    ): Promise<[StatusDto[], boolean]>;
}
