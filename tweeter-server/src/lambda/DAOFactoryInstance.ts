// AI-assisted: see AI-ATTRIBUTION.md
import { DAOFactory } from "../dao/DAOFactory";
import { DynamoDAOFactory } from "../dao/dynamo/DynamoDAOFactory";

// The one DAOFactory the lambdas pass into services. This is the only place
// DynamoDAOFactory is constructed; it lives for the life of the Lambda container.
export const daoFactory: DAOFactory = new DynamoDAOFactory();
