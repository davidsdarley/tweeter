import { AuthToken, Status, User } from "tweeter-shared";
import { LoadingView } from "./Presenter";
import { ToastPresenter } from "./ToastPresenter";
import { StatusService } from "../model.service/StatusService";

export interface PostStatusView extends LoadingView{
    getPost: () => string
    setPost: React.Dispatch<React.SetStateAction<string>>
    isLoading: boolean
}

export class PostStatusPresenter extends ToastPresenter<PostStatusView>{

  private _service: StatusService = new StatusService();

      public async submitPost (event: React.MouseEvent, authToken: AuthToken, currentUser: User) {
        this.doToastOperation(event, 
          async() => {
          const status = new Status(this.view.getPost(), currentUser!, Date.now());
          await this.service.postStatus(status, authToken!);
          this.clearPost(event)
          this.view.displayInfoMessage( "Status posted!", 2000);
        }, 
        "post the status", "Posting status...")
      };

      public async newSubmitPost(event: React.MouseEvent, authToken: AuthToken, currentUser: User) {
        event.preventDefault();
        const status = new Status(this.view.getPost(), currentUser!, Date.now());
        this.postStatus(status, authToken!);
      };
      
      public async postStatus(newStatus: Status, authToken: AuthToken): Promise<void>{
        return this.doToastOperation(null, 
          async() => {
          await this.service.postStatus(newStatus, authToken);
          this.clearPost(null)
          this.view.displayInfoMessage( "Status posted!", 2000);
        }, 
        "post the status", "Posting status...")
      }
      
    
    
      public clearPost(event: React.MouseEvent | null){
        if(event){       
          event.preventDefault();
        }
        this.view.setPost("");
      };
    
      public checkButtonStatus: (post: string, authToken: AuthToken, currentUser: User) => boolean = (post:string, authToken, currentUser) => {
        return !post.trim() ;
      };
      public oldcheckButtonStatus: (post: string, authToken: AuthToken, currentUser: User) => boolean = (post:string, authToken, currentUser) => {
        return !post.trim() || !authToken || !currentUser || this.view.isLoading;
      };

      public get service(){
        return this._service;
      }
}