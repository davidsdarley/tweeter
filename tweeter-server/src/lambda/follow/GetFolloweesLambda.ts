// AI-assisted: see AI-ATTRIBUTION.md
import { PagedUserItemRequest } from "tweeter-shared";
import { PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { daoFactory } from "../DAOFactoryInstance";
import { handleErrors } from "../handleErrors";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => handleErrors(async () => {
    
    const followService = new FollowService(daoFactory);
    const [items, hasMore] = await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    };

});
