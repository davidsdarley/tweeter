import { User, AuthToken } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";
import { StatusService } from "../model.service/StatusService";

export interface PageItemView<T> extends View{
    addItems: (items: T[]) => void,
}

export const PAGE_SIZE = 10;


export abstract class PageItemPresenter<T, U extends FollowService | StatusService> extends Presenter<PageItemView<T>>{
    protected _service: U;

    protected userService: UserService = new UserService();
    
    protected _hasMoreItems = true;
    protected _lastItem: T | null = null;

    public constructor(view: PageItemView<T>){
        super(view);
        this._service = this.serviceFactory()
    }

    protected abstract serviceFactory(): U;

    public async loadMoreItems (authToken: AuthToken, userAlias: string, ) {
        this.doFailureReportingOperation(async()=>{
        const [newItems, hasMore] = await this.getMoreItems(
            authToken!,
            userAlias,
        );

        this.hasMoreItems =  hasMore;
        this.lastItem = newItems[newItems.length - 1]
        this.view.addItems(newItems);
        }, this.itemDescription())
    };

    protected abstract itemDescription(): string;

    protected abstract getMoreItems(authtoken: AuthToken, userAlias: string): Promise<[T[], boolean]>;


    public async getUser  (authToken: AuthToken, alias: string): Promise<User | null> {   // references the function in UserService class, not duplicate.
        return this.userService.getUser(authToken, alias);
    };

    // Getters and setters
    protected get service(): U{
        return this._service;
    }
    protected set service(item: U) {
        this._service = item;
    }

    public get lastItem(){
        return this._lastItem;
    }
    protected set lastItem(value: T | null){
        this._lastItem = value;
    }

    public get hasMoreItems(){
        return this._hasMoreItems;
    }
    protected set hasMoreItems(value: boolean){
        this._hasMoreItems = value;
    }

    reset() {
        this.lastItem = null;
        this.hasMoreItems = true;
      throw new Error("Method not implemented.");
    }
}