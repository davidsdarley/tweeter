import { AuthToken, Status } from "tweeter-shared";
import { StatusPresenter } from "./StatusPresenter";

export const PAGE_SIZE = 10;

export class StoryPresenter extends StatusPresenter{
  protected itemDescription(): string {
    return "load story items";
  }
  protected getMoreItems(authtoken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
    return this.service.loadMoreStoryItems(authtoken, userAlias, PAGE_SIZE, this.lastItem);
  }
}