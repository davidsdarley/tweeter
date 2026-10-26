import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { NavigateFunction } from "react-router-dom";
import { LoadingView, Presenter } from "./Presenter";

export interface LoginView extends LoadingView {
    alias: string;
    password: string;
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
    rememberMe: boolean;
    originalURL?: string ;
    navigate: NavigateFunction;
}

export class LoginPresenter extends Presenter<LoginView>{

  private service: UserService = new UserService;

  public async login (
    alias: string,
    password: string
    ): Promise<[User, AuthToken]>{
        return this. service.login(alias, password);
    };


  public async doLogin () {

    try {
      this.view.setIsLoading(true);

      await this.doFailureReportingOperation(async()=>{
        const [user, authToken] = await this.login(this.view.alias, this.view.password);
        this.view.updateUserInfo(user, user, authToken, this.view.rememberMe);
        if (!!this.view.originalURL) {
          this.view.navigate(this.view.originalURL);
        } else {
          this.view.navigate(`/feed/${user.alias}`);
        }
      }, "log in user")

    } finally {
      this.view.setIsLoading(false);
    }
  };

}