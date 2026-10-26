import { AuthToken, Status, User } from "tweeter-shared";
import { LoadingView } from "./Presenter";
import { ToastPresenter } from "./ToastPresenter";

export interface PostStatusView extends LoadingView{
    authToken: AuthToken | null
    currentUser: User | null
    getPost: () => string
    setPost: React.Dispatch<React.SetStateAction<string>>
    isLoading: boolean
}

export class PostStatusPresenter extends ToastPresenter<PostStatusView>{

    public async submitPost (event: React.MouseEvent) {
      this.doToastOperation(event, 
        async() => {
        const status = new Status(this.view.getPost(), this.view.currentUser!, Date.now());
        await this.postStatus(status);
        this.view.setPost("");
        this.view.displayInfoMessage( "Status posted!", 2000);
      }, 
      "post the status", "Posting status...")
      };
    
      public async postStatus(
        newStatus: Status,
      ): Promise<void>{
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server to post the status
      };
    
      public clearPost(event: React.MouseEvent){
        event.preventDefault();
        this.view.setPost("");
      };
    
      public checkButtonStatus: (post: string) => boolean = (post:string) => {
        return !post.trim() || !this.view.authToken || !this.view.currentUser || this.view.isLoading;
      };
      public checkButtonExhaustive: (post:string) => boolean = (post: string) => {
        console.log("!post.trim(): ", !post.trim());
        console.log("!this.view.authToken: ", !this.view.authToken);
        console.log("!this.view.currentUser: ", !this.view.currentUser);
        console.log("this.view.isLoading: ", this.view.isLoading);
        console.log("Together:", !post.trim() || !this.view.authToken || !this.view.currentUser || this.view.isLoading);

        return !post.trim() || !this.view.authToken || !this.view.currentUser || this.view.isLoading;
      }
}