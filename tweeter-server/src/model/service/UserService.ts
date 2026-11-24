// AI-assisted: see AI-ATTRIBUTION.md
import { compare, hash } from "bcryptjs";
import { AuthTokenDto, UserDto } from "tweeter-shared";
import { DAOFactory } from "../../dao/DAOFactory";
import { ImageDAO } from "../../dao/ImageDAO";
import { UserDAO } from "../../dao/UserDAO";
import { AuthorizationService } from "./AuthorizationService";
import { requireAlias, requireToken } from "./RequestValidation";

const SALT_ROUNDS = 10;

// Same message for unknown alias and wrong password so callers can't tell which failed.
export const INVALID_CREDENTIALS_MESSAGE = "[bad-request] Invalid alias or password";

export class UserService {
    private readonly userDAO: UserDAO;
    private readonly imageDAO: ImageDAO;
    private readonly authorizationService: AuthorizationService;

    public constructor(daoFactory: DAOFactory) {
        this.userDAO = daoFactory.getUserDAO();
        this.imageDAO = daoFactory.getImageDAO();
        this.authorizationService = new AuthorizationService(daoFactory);
    }

    public async login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]> {
        requireAlias(alias);

        const passwordHash = await this.userDAO.getPasswordHash(alias);
        const passwordMatches =
            passwordHash !== null && (await compare(password, passwordHash));
        if (!passwordMatches) {
            throw new Error(INVALID_CREDENTIALS_MESSAGE);
        }

        const user = await this.userDAO.getUser(alias);
        if (user === null) {
            throw new Error("[internal-server-error] User record missing for stored credentials");
        }

        const authToken = await this.authorizationService.createSession(alias);
        return [user, authToken.toDto()];
    };

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string,
        imageFileExtension: string
    ): Promise<[UserDto, AuthTokenDto]> {
        requireAlias(alias);

        if ((await this.userDAO.getUser(alias)) !== null) {
            throw new Error("[bad-request] Alias is already taken");
        }

        const fileName = `${alias.startsWith("@") ? alias.slice(1) : alias}.${imageFileExtension}`;
        const imageUrl = await this.imageDAO.putImage(fileName, userImageBytes);

        const passwordHash = await hash(password, SALT_ROUNDS);
        const user: UserDto = { firstName, lastName, alias, imageUrl };
        await this.userDAO.putUser(user, passwordHash);

        const authToken = await this.authorizationService.createSession(alias);
        return [user, authToken.toDto()];
    };

    public async getUser(token: string, alias: string): Promise<UserDto> {
        requireToken(token);
        requireAlias(alias);
        await this.authorizationService.authorize(token);

        const user = await this.userDAO.getUser(alias);
        if (user === null) {
            throw new Error("[bad-request] User not found");
        }
        return user;
    };

    public async logout(token: string): Promise<void> {
        requireToken(token);
        await this.authorizationService.endSession(token);
    };
}
