// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { FollowService } from "../model.service/FollowService";
import { NavigateFunction } from "react-router-dom";
import { MessageView } from "./Presenter";
import { ToastPresenter } from "./ToastPresenter";

export interface UserInfoView extends MessageView{
    authToken: AuthToken | null
    currentUser: User | null
    displayedUser: User | null
    setIsFollower: React.Dispatch<React.SetStateAction<boolean>>

    setFolloweeCount: React.Dispatch<React.SetStateAction<number>>
    setFollowerCount: React.Dispatch<React.SetStateAction<number>>

    setDisplayedUser: (user: User) => void
    navigate: NavigateFunction
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}


export class UserInfoPresenter extends ToastPresenter<UserInfoView>{
    private _service: UserService = new UserService();
    private _followService: FollowService = new FollowService();

    public get service(): UserService {
        return this._service;
    }

    public get followService(): FollowService {
        return this._followService;
    }

    ////// communicate with Service //////
    public async getIsFollowerStatus( user: User, selectedUser: User): Promise<boolean> {
        return this.service.getIsFollowerStatus(this.view.authToken!, user, selectedUser);
    };

    public async getFolloweeCount (userAlias: string,): Promise<number> {
        // TODO: Replace with the result of calling server
        return this.service.getFolloweeCount(this.view.authToken!, userAlias);
    };

    public async getFollowerCount(userAlias: string): Promise<number> {
        // TODO: Replace with the result of calling server
        return this.service.getFollowerCount(this.view.authToken!, userAlias);
    }

    public async getUser(alias: string): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return this.service.getUser(this.view.authToken!, alias);
    };

    ////// other presenter functions //////
    // These take the displayed user as an argument instead of reading
    // this.view.displayedUser: the component creates the presenter once, so the
    // view it holds keeps the displayed user from the first render.
    public async setIsFollowerStatus (displayedUser: User) {
      await this.doFailureReportingOperation( async() => {
        if (displayedUser.equals(this.view.currentUser!)) {
          this.view.setIsFollower(false);
        } else {
          this.view.setIsFollower(
            await this.getIsFollowerStatus(this.view.currentUser!, displayedUser),
          );
        }
      }, "determine follower status");
    };

    public async setNumbFollowees (displayedUser: User) {
      await this.doFailureReportingOperation(async() => {
        this.view.setFolloweeCount(await this.getFolloweeCount(displayedUser.alias));
      }, "get followees count");
    };

    public async setNumbFollowers (displayedUser: User) {
      await this.doFailureReportingOperation(async() => {
        this.view.setFollowerCount(await this.getFollowerCount(displayedUser.alias));
      }, "get followers count");
    };

    public switchToLoggedInUser(event: React.MouseEvent):void{
        event.preventDefault();
        this.view.setDisplayedUser(this.view.currentUser!);
        this.view.navigate(`${this.getBaseUrl()}/${this.view.currentUser!.alias}`);
    };

    private getBaseUrl(): string {
        const segments = location.pathname.split("/@");
        return segments.length > 1 ? segments[0] : "/";
      };

    public async followDisplayedUser (event: React.MouseEvent, displayedUser: User): Promise<void> {
      await this.doToastOperation(event, async() => {
        const [followerCount, followeeCount] = await this.follow(
          this.view.authToken!,
          displayedUser,
          );

          this.view.setIsFollower(true);
          this.view.setFollowerCount(followerCount);
          this.view.setFolloweeCount(followeeCount);
      }, "follow user", `Following ${displayedUser.name}...`);
    };

    private async follow (
        authToken: AuthToken,
        userToFollow: User,
      ): Promise<[followerCount: number, followeeCount: number]> {
        return this.followService.follow(authToken, userToFollow);
    };

    public async unfollowDisplayedUser (
        event: React.MouseEvent,
        displayedUser: User,
      ): Promise<void> {
        await this.doToastOperation(event, async() => {
          const [followerCount, followeeCount] = await this.unfollow(
            this.view.authToken!,
            displayedUser,
          );
    
          this.view.setIsFollower(false);
          this.view.setFollowerCount(followerCount);
          this.view.setFolloweeCount(followeeCount);
        }, "unfollow user", `Unfollowing ${displayedUser.name}...`);
      };
    
      private async unfollow (
        authToken: AuthToken,
        userToUnfollow: User,
      ): Promise<[followerCount: number, followeeCount: number]> {
        return this.followService.unfollow(authToken, userToUnfollow);
      };
}
