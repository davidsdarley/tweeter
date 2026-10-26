import { NavigateFunction } from "react-router-dom";
import { AuthToken } from "tweeter-shared";
import { MessageView, Presenter } from "./Presenter";

export interface NavbarView extends MessageView{
    clearUserInfo: () => void
    navigate: NavigateFunction
    authToken: AuthToken | null
}

export class NavbarPresenter extends Presenter<NavbarView>{

  private async logout (authToken: AuthToken): Promise<void> {
      // Pause so we can see the logging out message. Delete when the call to the server is implemented.
      await new Promise((res) => setTimeout(res, 1000));
  };

  public async logOut () {
      const loggingOutToastId = this.view.displayInfoMessage( "Logging Out...", 0);
      this.doFailureReportingOperation(async() => {
        await this.logout(this.view.authToken!);
  
        this.view.deleteMessage(loggingOutToastId);
        this.view.clearUserInfo();
        this.view.navigate("/login");
      }, "log user out");
  };
}