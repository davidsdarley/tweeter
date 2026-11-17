// AI-assisted: see AI-ATTRIBUTION.md

import { describe, expect, it } from "@jest/globals";
import { handler } from "../../src/lambda/user/LoginLambda";
import { FakeData, LoginRequest } from "tweeter-shared";

describe("LoginLambda", () => {
  const request: LoginRequest = {
    token: "",
    userAlias: "@allen",
    password: "password",
  };

  it("returns a successful response", async () => {
    const response = await handler(request);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
  });

  it("returns the user and auth token FakeData provides", async () => {
    const response = await handler(request);

    expect(response.user).toEqual(FakeData.instance.firstUser?.toDto());
    expect(response.authToken).toEqual(FakeData.instance.authToken.toDto());
  });
});
