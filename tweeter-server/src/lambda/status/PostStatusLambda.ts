// AI-assisted: see AI-ATTRIBUTION.md
import { PostStatusRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { daoFactory } from "../DAOFactoryInstance";
import { handleErrors } from "../handleErrors";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => handleErrors(async () => {

    const statusService = new StatusService(daoFactory);
    await statusService.postStatus(request.token, request.newStatus);

    return {
        success: true,
        message: null
    };

});
