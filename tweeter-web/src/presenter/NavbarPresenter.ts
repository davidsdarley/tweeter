import { NavigateFunction } from "react-router-dom";
import { AuthToken } from "tweeter-shared";
import { MessageView, Presenter } from "./Presenter";
import { UserService } from "../model.service/UserService";

export interface NavbarView extends MessageView{
    clearUserInfo: () => void
    navigate: NavigateFunction
    authToken: AuthToken | null
}

export class NavbarPresenter extends Presenter<NavbarView>{
  private _service: UserService;
  
  public constructor(view: NavbarView){
    super(view);
    this._service = new UserService;
  }
  public get service(){
    return this._service;
  }

  public async logOut (authToken: AuthToken) {
      const loggingOutToastId = this.view.displayInfoMessage( "Logging Out...", 0);
      this.doFailureReportingOperation(async() => {
        await this.service.logout(authToken);
  
        this.view.deleteMessage(loggingOutToastId);
        this.view.clearUserInfo();
        this.view.navigate("/login");
      }, "log user out");
  };

}