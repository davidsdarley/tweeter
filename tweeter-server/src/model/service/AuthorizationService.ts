// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken } from "tweeter-shared";
import { AuthTokenDAO } from "../../dao/AuthTokenDAO";
import { DAOFactory } from "../../dao/DAOFactory";

// How long a session stays valid after it is created or last used.
export const TOKEN_LIFETIME_SECONDS = 3600;

const nowEpochSeconds = (): number => Math.floor(Date.now() / 1000);

export class AuthorizationService {
    private readonly authTokenDAO: AuthTokenDAO;

    public constructor(daoFactory: DAOFactory) {
        this.authTokenDAO = daoFactory.getAuthTokenDAO();
    }

    public async createSession(alias: string): Promise<AuthToken> {
        const authToken = AuthToken.Generate();
        await this.authTokenDAO.putToken(
            authToken.token,
            alias,
            nowEpochSeconds() + TOKEN_LIFETIME_SECONDS
        );
        return authToken;
    }

    // Returns the alias that owns the token and extends the session.
    // DynamoDB TTL deletes expired items lazily, so expiresAt is checked here too.
    public async authorize(token: string): Promise<string> {
        const record = await this.authTokenDAO.getToken(token);
        const now = nowEpochSeconds();
        if (record === null || record.expiresAt <= now) {
            throw new Error("[unauthorized] Invalid or expired auth token");
        }
        await this.authTokenDAO.updateExpiration(token, now + TOKEN_LIFETIME_SECONDS);
        return record.alias;
    }

    public async endSession(token: string): Promise<void> {
        await this.authTokenDAO.deleteToken(token);
    }
}
