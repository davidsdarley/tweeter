// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "tweeter-shared";
import { GetCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { daoFactory } from "../DAOFactoryInstance";
import { handleErrors } from "../handleErrors";

export const handler = async (request: TweeterRequest): Promise<GetCountResponse> => handleErrors(async () => {

    const followService = new FollowService(daoFactory);
    const count = await followService.getFollowerCount(request.token, request.userAlias);

    return {
        success: true,
        message: null,
        count: count
    };

});
