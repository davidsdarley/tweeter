import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";
import { PageItemPresenter } from "./PageItemPresenter";

export const PAGE_SIZE = 10;

export interface StatusView extends View{
    addItems: (items: Status[]) => void,
}

export abstract class StatusPresenter extends PageItemPresenter<Status, StatusService>{
  
  protected serviceFactory(): StatusService {
    return new StatusService();
  }
}