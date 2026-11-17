// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: TweeterRequest): Promise<TweeterResponse> => {

    const userService = new UserService();
    await userService.logout(request.token);

    return {
        success: true,
        message: null
    };

}
