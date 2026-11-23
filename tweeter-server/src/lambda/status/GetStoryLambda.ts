// AI-assisted: see AI-ATTRIBUTION.md
import { PagedStatusItemRequest } from "tweeter-shared";
import { PagedStatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { daoFactory } from "../DAOFactoryInstance";
import { handleErrors } from "../handleErrors";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => handleErrors(async () => {

    const statusService = new StatusService(daoFactory);
    const [items, hasMore] = await statusService.loadMoreStoryItems(request.token, request.userAlias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    };

});
