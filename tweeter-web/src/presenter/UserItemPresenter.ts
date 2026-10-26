import { User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { PageItemPresenter, PageItemView } from "./PageItemPresenter";



export abstract class UserItemPresenter extends PageItemPresenter<User, FollowService>{

    protected serviceFactory(): FollowService {
        return new FollowService()
    }
}
