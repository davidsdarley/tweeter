// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDAO } from "../AuthTokenDAO";
import { DAOFactory } from "../DAOFactory";
import { FollowDAO } from "../FollowDAO";
import { ImageDAO } from "../ImageDAO";
import { StatusDAO } from "../StatusDAO";
import { UserDAO } from "../UserDAO";

export class DynamoDAOFactory implements DAOFactory {
    public getUserDAO(): UserDAO {
        throw new Error("Not implemented");
    }

    public getFollowDAO(): FollowDAO {
        throw new Error("Not implemented");
    }

    public getStatusDAO(): StatusDAO {
        throw new Error("Not implemented");
    }

    public getAuthTokenDAO(): AuthTokenDAO {
        throw new Error("Not implemented");
    }

    public getImageDAO(): ImageDAO {
        throw new Error("Not implemented");
    }
}
