export const PAGE_SIZE = 10;

export interface View{
    displayErrorMessage: (message: string, bootstrapClasses?: string) => string;
}
export interface MessageView extends View{
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => string
    deleteMessage: (messageId: string) => void
}
export interface LoadingView extends MessageView{
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


export abstract class Presenter<V extends View>{
    private _view: V;

    public constructor(view: V){
        this._view = view
    }

    protected async doFailureReportingOperation (operation: () => Promise<void>, operationDescription: string) {
        try {
            await operation();
        } catch (error) {
        this.view.displayErrorMessage(
            `Failed to ${operationDescription} because of exception: ${error}`,
        );
        }
    };

    protected get view(){
        return this._view;
    }
}