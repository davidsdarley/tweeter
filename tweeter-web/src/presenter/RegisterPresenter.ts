import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService"
import { Buffer } from "buffer";
import { NavigateFunction } from "react-router-dom";
import { ChangeEvent } from "react";
import { LoadingView, Presenter } from "./Presenter";

export interface RegisterView extends LoadingView{
    setImageUrl: (value: React.SetStateAction<string>) => void;
    setImageBytes: (value: React.SetStateAction<Uint8Array>) => void;
    setImageFileExtension: React.Dispatch<React.SetStateAction<string>>;

    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;

    firstName: string;
    lastName: string;
    alias: string;
    password: string;
    imageBytes: Uint8Array;
    imageFileExtension: string;

    rememberMe: boolean;
    navigate: NavigateFunction;
}


export class RegisterPresenter extends Presenter<RegisterView>{
    private service: UserService = new UserService;

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
      ): Promise<[User, AuthToken]> {
        return this.service.register(firstName, lastName, alias, password, userImageBytes, imageFileExtension)
    }
    public async doRegister ()   {
      try {
        this.view.setIsLoading(true);
        await this.doFailureReportingOperation( async() => {
          const [user, authToken] = await this.register(
            this.view.firstName,
            this.view.lastName,
            this.view.alias,
            this.view.password,
            this.view.imageBytes,
            this.view.imageFileExtension
          );
          this.view.updateUserInfo(user, user, authToken, this.view.rememberMe);
          this.view.navigate(`/feed/${user.alias}`);
        }, "register user");
      } finally {
        this.view.setIsLoading(false);
      }
    };

    public handleImageFile = (file: File | undefined) => {
        if (file) {
          this.view.setImageUrl(URL.createObjectURL(file));
    
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            const imageStringBase64 = event.target?.result as string;
    
            // Remove unnecessary file metadata from the start of the string.
            const imageStringBase64BufferContents =
              imageStringBase64.split("base64,")[1];
    
            const bytes: Uint8Array = Buffer.from(
              imageStringBase64BufferContents,
              "base64"
            );
    
            this.view.setImageBytes(bytes);
          };
          reader.readAsDataURL(file);
    
          // Set image file extension (and move to a separate method)
          const fileExtension = this.getFileExtension(file);
          if (fileExtension) {
            this.view.setImageFileExtension(fileExtension);
          }
        } else {
          this.view.setImageUrl("");
          this.view.setImageBytes(new Uint8Array());
        }
      };

    
    public handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        this.handleImageFile(file);
    };
    
    private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
    };

    
    

}