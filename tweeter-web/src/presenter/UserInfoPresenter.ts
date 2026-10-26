import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
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
    private service: UserService = new UserService();

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
    public async setIsFollowerStatus () {
      this.doFailureReportingOperation( async() => {
        if (this.view.currentUser === this.view.displayedUser) {
          this.view.setIsFollower(false);
        } else {
          this.view.setIsFollower(
            await this.getIsFollowerStatus(this.view.currentUser!, this.view.displayedUser!),
          );
        }
      }, "determine follower status");
    };

    public setNumbFollowees = async () => {
      this.doFailureReportingOperation(async() => {
        this.view.setFolloweeCount(await this.getFolloweeCount(this.view.displayedUser!.alias));
      }, "get followees count");
    };


    public async setNumbFollowers () {
      this.doFailureReportingOperation(async() => {
        this.view.setFollowerCount(await this.getFollowerCount(this.view.displayedUser!.alias));
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

    public async followDisplayedUser (event: React.MouseEvent,): Promise<void> {
      this.doToastOperation(event, async() => {
        const [followerCount, followeeCount] = await this.follow(
          this.view.authToken!,
          this.view.displayedUser!,
          );

          this.view.setIsFollower(true);
          this.view.setFollowerCount(followerCount);
          this.view.setFolloweeCount(followeeCount);
      }, "follow user", `Following ${this.view.displayedUser!.name}...`);
    };

    private async follow (
        authToken: AuthToken,
        userToFollow: User,
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        const followerCount = await this.getFollowerCount(userToFollow.alias);
        const followeeCount = await this.getFolloweeCount(userToFollow.alias);
    
        return [followerCount, followeeCount];
    };

    public async unfollowDisplayedUser (
        event: React.MouseEvent,
      ): Promise<void> {
        this.doToastOperation(event, async() => {
          const [followerCount, followeeCount] = await this.unfollow(
            this.view.authToken!,
            this.view.displayedUser!,
          );
    
          this.view.setIsFollower(false);
          this.view.setFollowerCount(followerCount);
          this.view.setFolloweeCount(followeeCount);
        }, "unfollow user", `Unfollowing ${this.view.displayedUser!.name}...`);
      };
    
      private async unfollow (
        authToken: AuthToken,
        userToUnfollow: User,
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        const followerCount = await this.getFollowerCount(userToUnfollow.alias);
        const followeeCount = await this.getFolloweeCount(userToUnfollow.alias);
    
        return [followerCount, followeeCount];
      };
}
