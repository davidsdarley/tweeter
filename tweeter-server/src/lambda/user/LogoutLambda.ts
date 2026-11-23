// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { daoFactory } from "../DAOFactoryInstance";
import { handleErrors } from "../handleErrors";

export const handler = async (request: TweeterRequest): Promise<TweeterResponse> => handleErrors(async () => {

    const userService = new UserService(daoFactory);
    await userService.logout(request.token);

    return {
        success: true,
        message: null
    };

});
