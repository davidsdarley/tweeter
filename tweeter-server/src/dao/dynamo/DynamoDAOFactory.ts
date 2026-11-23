// AI-assisted: see AI-ATTRIBUTION.md
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { AuthTokenDAO } from "../AuthTokenDAO";
import { DAOFactory } from "../DAOFactory";
import { FollowDAO } from "../FollowDAO";
import { ImageDAO } from "../ImageDAO";
import { StatusDAO } from "../StatusDAO";
import { UserDAO } from "../UserDAO";
import { DynamoAuthTokenDAO } from "./DynamoAuthTokenDAO";
import { AWS_REGION } from "./DynamoConfig";
import { DynamoUserDAO } from "./DynamoUserDAO";

// One client per Lambda container, shared by every DAO and reused across warm invocations.
const documentClient = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: AWS_REGION }),
    { marshallOptions: { removeUndefinedValues: true } }
);

export class DynamoDAOFactory implements DAOFactory {
    private userDAO: UserDAO | null = null;
    private authTokenDAO: AuthTokenDAO | null = null;

    public getUserDAO(): UserDAO {
        if (this.userDAO === null) {
            this.userDAO = new DynamoUserDAO(documentClient);
        }
        return this.userDAO;
    }

    public getFollowDAO(): FollowDAO {
        throw new Error("Not implemented");
    }

    public getStatusDAO(): StatusDAO {
        throw new Error("Not implemented");
    }

    public getAuthTokenDAO(): AuthTokenDAO {
        if (this.authTokenDAO === null) {
            this.authTokenDAO = new DynamoAuthTokenDAO(documentClient);
        }
        return this.authTokenDAO;
    }

    public getImageDAO(): ImageDAO {
        throw new Error("Not implemented");
    }
}
