// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "tweeter-shared";
import { GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { handleErrors } from "../handleErrors";

export const handler = async (request: TweeterRequest): Promise<GetUserResponse> => handleErrors(async () => {

    const userService = new UserService();
    const user = await userService.getUser(request.token, request.userAlias);

    return {
        success: true,
        message: null,
        user: user
    };

});
