// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../network/ServerFacade";

export class UserService {
  private serverFacade = new ServerFacade();

  public async getUser  (authToken: AuthToken, alias: string): Promise<User | null> {
    return this.serverFacade.getUser({
      token: authToken.token,
      userAlias: alias
    });
  };

  public async getFolloweeCount (authToken: AuthToken,alias: string,): Promise<number> {
    return this.serverFacade.getFolloweeCount({
      token: authToken.token,
      userAlias: alias
    });
  };

  public async getIsFollowerStatus( authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
    return this.serverFacade.getIsFollowerStatus({
      token: authToken.token,
      userAlias: user.alias,
      selectedUserAlias: selectedUser.alias
    });
  };

  public async getFollowerCount (authToken: AuthToken, userAlias: string): Promise<number> {
    return this.serverFacade.getFollowerCount({
      token: authToken.token,
      userAlias: userAlias
    });
  };
  
  public async register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    return this.serverFacade.register({
      token: "",
      userAlias: alias,
      password: password,
      firstName: firstName,
      lastName: lastName,
      userImageBytes: imageStringBase64,
      imageFileExtension: imageFileExtension
    });
  };

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    return this.serverFacade.login({
      token: "",
      userAlias: alias,
      password: password
    });
  };

  public async logout (authToken: AuthToken): Promise<void> {
    return this.serverFacade.logout({
      token: authToken.token,
      userAlias: ""
    });
  };

}
