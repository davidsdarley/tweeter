// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "tweeter-shared";
import { FollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { daoFactory } from "../DAOFactoryInstance";
import { handleErrors } from "../handleErrors";

export const handler = async (request: TweeterRequest): Promise<FollowResponse> => handleErrors(async () => {

    const followService = new FollowService(daoFactory);
    const [followerCount, followeeCount] = await followService.unfollow(request.token, request.userAlias);

    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount
    };

});
