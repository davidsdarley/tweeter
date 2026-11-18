// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "tweeter-shared";
import { GetCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { handleErrors } from "../handleErrors";

export const handler = async (request: TweeterRequest): Promise<GetCountResponse> => handleErrors(async () => {

    const followService = new FollowService();
    const count = await followService.getFolloweeCount(request.token, request.userAlias);

    return {
        success: true,
        message: null,
        count: count
    };

});
