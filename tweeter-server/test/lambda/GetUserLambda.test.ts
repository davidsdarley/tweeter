// AI-assisted: see AI-ATTRIBUTION.md

import { describe, expect, it } from "@jest/globals";
import { handler } from "../../src/lambda/user/GetUserLambda";
import { FakeData, TweeterRequest } from "tweeter-shared";

const USER_ALIAS = "@allen";

describe("GetUserLambda", () => {
  const request: TweeterRequest = {
    token: "fake-token",
    userAlias: USER_ALIAS,
  };

  it("returns a successful response", async () => {
    const response = await handler(request);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
  });

  it("returns exactly the user FakeData provides", async () => {
    const expectedUser = FakeData.instance.findUserByAlias(USER_ALIAS);

    const response = await handler(request);

    expect(expectedUser).not.toBeNull();
    expect(response.user).toEqual(expectedUser?.toDto());
  });

  it("returns a null user for an unknown alias", async () => {
    const response = await handler({ ...request, userAlias: "@no-such-user" });

    expect(response.success).toBe(true);
    expect(response.user).toBeNull();
  });

  it("rejects a request with a missing token as a bad request", async () => {
    await expect(handler({ ...request, token: "" })).rejects.toThrow(
      "[bad-request] Missing auth token"
    );
  });
});
