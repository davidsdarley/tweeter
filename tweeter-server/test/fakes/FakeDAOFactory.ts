// AI-assisted: see AI-ATTRIBUTION.md
import { DAOFactory } from "../../src/dao/DAOFactory";
import {
    FakeAuthTokenDAO,
    FakeFollowDAO,
    FakeImageDAO,
    FakeStatusDAO,
    FakeUserDAO,
} from "./FakeDAOs";

// Returns the same in-memory DAO instances on every call, so state written
// through one service is visible to the next and to the test itself.
// Create a new factory per test for a clean slate.
export class FakeDAOFactory implements DAOFactory {
    public readonly userDAO = new FakeUserDAO();
    public readonly followDAO = new FakeFollowDAO();
    public readonly statusDAO = new FakeStatusDAO();
    public readonly authTokenDAO = new FakeAuthTokenDAO();
    public readonly imageDAO = new FakeImageDAO();

    public getUserDAO(): FakeUserDAO {
        return this.userDAO;
    }

    public getFollowDAO(): FakeFollowDAO {
        return this.followDAO;
    }

    public getStatusDAO(): FakeStatusDAO {
        return this.statusDAO;
    }

    public getAuthTokenDAO(): FakeAuthTokenDAO {
        return this.authTokenDAO;
    }

    public getImageDAO(): FakeImageDAO {
        return this.imageDAO;
    }
}
