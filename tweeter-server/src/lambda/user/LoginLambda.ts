// AI-assisted: see AI-ATTRIBUTION.md
import { AuthResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { handleErrors } from "../handleErrors";

export const handler = async (request: LoginRequest): Promise<AuthResponse> => handleErrors(async () => {

    const userService = new UserService();
    const [user, authToken] = await userService.login(request.userAlias, request.password);

    return {
        success: true,
        message: null,
        user: user,
        authToken: authToken
    };

});
