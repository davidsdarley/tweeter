// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "tweeter-shared";
import { GetCountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: TweeterRequest): Promise<GetCountResponse> => {

    const userService = new UserService();
    const count = await userService.getFollowerCount(request.token, request.userAlias);

    return {
        success: true,
        message: null,
        count: count
    };

}
