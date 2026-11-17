// AI-assisted: see AI-ATTRIBUTION.md

import { describe, expect, it } from "@jest/globals";
import { handler } from "../../src/lambda/user/RegisterLambda";
import { FakeData, RegisterRequest } from "tweeter-shared";

describe("RegisterLambda", () => {
  const request: RegisterRequest = {
    token: "",
    userAlias: "@newuser",
    password: "password",
    firstName: "New",
    lastName: "User",
    userImageBytes: "ZmFrZSBpbWFnZSBieXRlcw==", // base64 of "fake image bytes"
    imageFileExtension: "png",
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
