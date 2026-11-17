// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, Status, StatusDto } from "tweeter-shared";

export class StatusService {
    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null  ): Promise<[StatusDto[], boolean]> {
        // TODO: Replace with the result of calling the database
        return this.getFakeData(lastItem, pageSize);
      };

    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null  ): Promise<[StatusDto[], boolean]> {
        // TODO: Replace with the result of calling the database
        return this.getFakeData(lastItem, pageSize);
      };

    private getFakeData(lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
      const [items, hasMore] = FakeData.instance.getPageOfStatuses(lastItem ? Status.fromDto(lastItem) : null, pageSize);
      const dtoItems = items.map((status) => status.toDto());
      return Promise.resolve([dtoItems, hasMore]);
    }

}
