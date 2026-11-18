// AI-assisted: see AI-ATTRIBUTION.md

import { describe, expect, it } from "@jest/globals";
import { handler } from "../../src/lambda/user/LogoutLambda";
import { TweeterRequest } from "tweeter-shared";

describe("LogoutLambda", () => {
  const request: TweeterRequest = {
    token: "fake-token",
    userAlias: "",
  };

  it("returns a successful response for a valid token", async () => {
    const response = await handler(request);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
  });

  it("rejects a request with a missing token as a bad request", async () => {
    await expect(handler({ ...request, token: "" })).rejects.toThrow(
      "[bad-request] Missing auth token"
    );
  });
});
