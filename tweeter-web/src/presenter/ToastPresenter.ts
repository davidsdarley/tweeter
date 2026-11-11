import { MessageView, Presenter } from "./Presenter";

export interface LoadingView extends MessageView{
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


export abstract class ToastPresenter<V extends LoadingView> extends Presenter<V>{

    protected async doToastOperation (event: React.MouseEvent | null, operation: () => Promise<void>, operationDescription: string, toastMessage?: string): Promise<void> {
        if(event){
            event.preventDefault();
        }
        var toast = "";
        try {
            this.view.setIsLoading(true);
            if (toastMessage){
                toast = this.view.displayInfoMessage(`${toastMessage}`, 0);
            }
            await this.doFailureReportingOperation( operation, operationDescription);
        } finally {
            if (toastMessage){
                this.view.deleteMessage(toast);
            }

            this.view.setIsLoading(false);
        }
    };
}

