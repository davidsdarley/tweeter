// AI-assisted: see AI-ATTRIBUTION.md

import { beforeEach, describe, expect, it } from "@jest/globals";
import { compare } from "bcryptjs";
import { AuthTokenDto, UserDto } from "tweeter-shared";
import { INVALID_CREDENTIALS_MESSAGE, UserService } from "../../../src/model/service/UserService";
import { FAKE_IMAGE_BASE_URL } from "../../fakes/FakeDAOs";
import { FakeDAOFactory } from "../../fakes/FakeDAOFactory";

const ALIAS = "@alice";
const PASSWORD = "correct horse battery staple";
const IMAGE_BYTES = "ZmFrZSBpbWFnZSBieXRlcw=="; // base64 of "fake image bytes"

const nowEpochSeconds = (): number => Math.floor(Date.now() / 1000);

describe("UserService", () => {
    let factory: FakeDAOFactory;
    let service: UserService;

    const registerAlice = (): Promise<[UserDto, AuthTokenDto]> =>
        service.register("Alice", "Smith", ALIAS, PASSWORD, IMAGE_BYTES, "png");

    beforeEach(() => {
        factory = new FakeDAOFactory();
        service = new UserService(factory);
    });

    describe("register", () => {
        it("stores the user with a bcrypt hash, not the plaintext password", async () => {
            const [user, authToken] = await registerAlice();

            expect(user).toEqual({
                firstName: "Alice",
                lastName: "Smith",
                alias: ALIAS,
                imageUrl: `${FAKE_IMAGE_BASE_URL}alice.png`,
            });
            expect(factory.imageDAO.images.get("alice.png")).toBe(IMAGE_BYTES);

            const storedHash = await factory.userDAO.getPasswordHash(ALIAS);
            expect(storedHash).not.toBeNull();
            expect(storedHash).not.toBe(PASSWORD);
            expect(await compare(PASSWORD, storedHash ?? "")).toBe(true);

            expect(factory.authTokenDAO.tokens.get(authToken.token)?.alias).toBe(ALIAS);
        });

        it("rejects an alias that is already taken", async () => {
            await registerAlice();

            await expect(registerAlice()).rejects.toThrow(/^\[bad-request\]/);
        });
    });

    describe("login", () => {
        it("returns the user and a new session for the right password", async () => {
            const [registered] = await registerAlice();

            const [user, authToken] = await service.login(ALIAS, PASSWORD);

            expect(user).toEqual(registered);
            expect(factory.authTokenDAO.tokens.get(authToken.token)?.alias).toBe(ALIAS);
        });

        it("gives the same [bad-request] error for a wrong password and an unknown alias", async () => {
            await registerAlice();

            await expect(service.login(ALIAS, "wrong password")).rejects.toThrow(
                INVALID_CREDENTIALS_MESSAGE
            );
            await expect(service.login("@nobody", PASSWORD)).rejects.toThrow(
                INVALID_CREDENTIALS_MESSAGE
            );
            expect(INVALID_CREDENTIALS_MESSAGE).toMatch(/^\[bad-request\]/);
        });
    });

    describe("logout", () => {
        it("removes the auth token", async () => {
            const [, authToken] = await registerAlice();
            expect(factory.authTokenDAO.tokens.has(authToken.token)).toBe(true);

            await service.logout(authToken.token);

            expect(factory.authTokenDAO.tokens.has(authToken.token)).toBe(false);
        });
    });

    describe("getUser", () => {
        it("returns the user for a valid token", async () => {
            const [registered, authToken] = await registerAlice();

            expect(await service.getUser(authToken.token, ALIAS)).toEqual(registered);
        });

        it("rejects an unknown alias with [bad-request]", async () => {
            const [, authToken] = await registerAlice();

            await expect(service.getUser(authToken.token, "@nobody")).rejects.toThrow(
                /^\[bad-request\]/
            );
        });

        it("rejects a token that does not exist with [unauthorized]", async () => {
            await registerAlice();

            await expect(service.getUser("no-such-token", ALIAS)).rejects.toThrow(
                /^\[unauthorized\]/
            );
        });

        it("rejects an expired token with [unauthorized]", async () => {
            await registerAlice();
            await factory.authTokenDAO.putToken("expired-token", ALIAS, nowEpochSeconds() - 1);

            await expect(service.getUser("expired-token", ALIAS)).rejects.toThrow(
                /^\[unauthorized\]/
            );
        });

        it("rejects a logged-out token with [unauthorized]", async () => {
            const [, authToken] = await registerAlice();
            await service.logout(authToken.token);

            await expect(service.getUser(authToken.token, ALIAS)).rejects.toThrow(
                /^\[unauthorized\]/
            );
        });
    });
});
