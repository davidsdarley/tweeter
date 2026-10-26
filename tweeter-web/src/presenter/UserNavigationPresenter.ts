import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { NavigateFunction } from "react-router-dom";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View{
    authToken: AuthToken;
    displayedUser: User;
    setDisplayedUser: (user: User) => void
    featurePath: string;
    navigate: NavigateFunction;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView>{
    private service: UserService;
  
    public constructor(view: UserNavigationView){
      super(view);
      this.service = new UserService;
    }

    public async getUser(
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> {
        return this.service.getUser(authToken, alias);
    };

    public extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    };

    public async navToUser (event: React.MouseEvent): Promise<void> {
      event.preventDefault();
      this.doFailureReportingOperation(async() => {
        const alias = this.extractAlias(event.target.toString());
    
          const toUser = await this.service.getUser(this.view.authToken!, alias);
    
          if (toUser) {
            if (!toUser.equals(this.view.displayedUser!)) {
              this.view.setDisplayedUser(toUser);
              this.view.navigate(`${this.view.featurePath}/${toUser.alias}`);
            }
          }
      }, "get user")
    };
}