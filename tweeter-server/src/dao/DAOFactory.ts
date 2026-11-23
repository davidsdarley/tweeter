// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDAO } from "./AuthTokenDAO";
import { FollowDAO } from "./FollowDAO";
import { ImageDAO } from "./ImageDAO";
import { StatusDAO } from "./StatusDAO";
import { UserDAO } from "./UserDAO";

export interface DAOFactory {
    getUserDAO(): UserDAO;
    getFollowDAO(): FollowDAO;
    getStatusDAO(): StatusDAO;
    getAuthTokenDAO(): AuthTokenDAO;
    getImageDAO(): ImageDAO;
}
