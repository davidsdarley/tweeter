// AI-assisted: see AI-ATTRIBUTION.md
import { IsFollowerRequest } from "tweeter-shared";
import { IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { handleErrors } from "../handleErrors";

export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => handleErrors(async () => {

    const followService = new FollowService();
    const isFollower = await followService.getIsFollowerStatus(request.token, request.userAlias, request.selectedUserAlias);

    return {
        success: true,
        message: null,
        isFollower: isFollower
    };

});
