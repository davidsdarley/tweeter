// AI-assisted: see AI-ATTRIBUTION.md

import { describe, expect, it } from "@jest/globals";
import { handler } from "../../src/lambda/follow/GetIsFollowerStatusLambda";
import { IsFollowerRequest } from "tweeter-shared";

describe("GetIsFollowerStatusLambda", () => {
  const request: IsFollowerRequest = {
    token: "fake-token",
    userAlias: "@allen",
    selectedUserAlias: "@amy",
  };

  it("returns a successful response", async () => {
    const response = await handler(request);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
  });

  it("returns a boolean follower status", async () => {
    const response = await handler(request);

    expect(typeof response.isFollower).toBe("boolean");
  });

  it("rejects a request with a missing token as a bad request", async () => {
    await expect(handler({ ...request, token: "" })).rejects.toThrow(
      "[bad-request] Missing auth token"
    );
  });
});
