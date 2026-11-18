// AI-assisted: see AI-ATTRIBUTION.md
import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { handleErrors } from "../handleErrors";

export const handler = async (request: RegisterRequest): Promise<AuthResponse> => handleErrors(async () => {

    const userService = new UserService();
    const [user, authToken] = await userService.register(
        request.firstName,
        request.lastName,
        request.userAlias,
        request.password,
        request.userImageBytes,
        request.imageFileExtension
    );

    return {
        success: true,
        message: null,
        user: user,
        authToken: authToken
    };

});
