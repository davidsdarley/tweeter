// AI-assisted: see AI-ATTRIBUTION.md
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { AuthTokenDAO } from "../AuthTokenDAO";
import { DAOFactory } from "../DAOFactory";
import { FollowDAO } from "../FollowDAO";
import { ImageDAO } from "../ImageDAO";
import { StatusDAO } from "../StatusDAO";
import { UserDAO } from "../UserDAO";
import { DynamoAuthTokenDAO } from "./DynamoAuthTokenDAO";
import { S3ImageDAO } from "../s3/S3ImageDAO";
import { AWS_REGION, IMAGE_BUCKET } from "./DynamoConfig";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoStatusDAO } from "./DynamoStatusDAO";
import { DynamoUserDAO } from "./DynamoUserDAO";

// One client per Lambda container, shared by every DAO and reused across warm invocations.
const documentClient = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: AWS_REGION }),
    { marshallOptions: { removeUndefinedValues: true } }
);

const s3Client = new S3Client({ region: AWS_REGION });

export class DynamoDAOFactory implements DAOFactory {
    private userDAO: UserDAO | null = null;
    private followDAO: FollowDAO | null = null;
    private statusDAO: StatusDAO | null = null;
    private authTokenDAO: AuthTokenDAO | null = null;
    private imageDAO: ImageDAO | null = null;

    public getUserDAO(): UserDAO {
        if (this.userDAO === null) {
            this.userDAO = new DynamoUserDAO(documentClient);
        }
        return this.userDAO;
    }

    public getFollowDAO(): FollowDAO {
        if (this.followDAO === null) {
            this.followDAO = new DynamoFollowDAO(documentClient);
        }
        return this.followDAO;
    }

    public getStatusDAO(): StatusDAO {
        if (this.statusDAO === null) {
            this.statusDAO = new DynamoStatusDAO(documentClient);
        }
        return this.statusDAO;
    }

    public getAuthTokenDAO(): AuthTokenDAO {
        if (this.authTokenDAO === null) {
            this.authTokenDAO = new DynamoAuthTokenDAO(documentClient);
        }
        return this.authTokenDAO;
    }

    public getImageDAO(): ImageDAO {
        if (this.imageDAO === null) {
            this.imageDAO = new S3ImageDAO(s3Client, IMAGE_BUCKET, AWS_REGION);
        }
        return this.imageDAO;
    }
}
