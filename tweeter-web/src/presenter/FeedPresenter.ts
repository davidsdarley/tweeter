import { AuthToken, Status } from "tweeter-shared";
import { StatusPresenter, StatusView } from "./StatusPresenter";

export const PAGE_SIZE = 10;

export class FeedPresenter extends StatusPresenter{
  protected getMoreItems(authtoken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
    return this.service.loadMoreFeedItems(authtoken, userAlias, PAGE_SIZE, this.lastItem);
  }
  protected itemDescription(): string {
    return "load feed items";
  }

}