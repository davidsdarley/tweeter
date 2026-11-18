// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, Status, StatusDto } from "tweeter-shared";
import { requireAlias, requirePositivePageSize, requireToken } from "./RequestValidation";

export class StatusService {
    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null  ): Promise<[StatusDto[], boolean]> {
        requireToken(token);
        requireAlias(userAlias);
        requirePositivePageSize(pageSize);
        // TODO: Replace with the result of calling the database
        return this.getFakeData(lastItem, pageSize);
      };

    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null  ): Promise<[StatusDto[], boolean]> {
        requireToken(token);
        requireAlias(userAlias);
        requirePositivePageSize(pageSize);
        // TODO: Replace with the result of calling the database
        return this.getFakeData(lastItem, pageSize);
      };

    public async postStatus(
        token: string,
        newStatus: StatusDto  ): Promise<void> {
        requireToken(token);
        // TODO: Call the database to post the status
        return Promise.resolve();
      };

    private getFakeData(lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
      const [items, hasMore] = FakeData.instance.getPageOfStatuses(lastItem ? Status.fromDto(lastItem) : null, pageSize);
      const dtoItems = items.map((status) => status.toDto());
      return Promise.resolve([dtoItems, hasMore]);
    }

}
