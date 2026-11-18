// AI-assisted: see AI-ATTRIBUTION.md

import { describe, expect, it } from "@jest/globals";
import { handler } from "../../src/lambda/follow/FollowLambda";
import { TweeterRequest } from "tweeter-shared";

describe("FollowLambda", () => {
  const request: TweeterRequest = {
    token: "fake-token",
    userAlias: "@amy",
  };

  it("returns a successful response", async () => {
    const response = await handler(request);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
  });

  it("returns integer follower and followee counts in FakeData's range (1 to 10)", async () => {
    const response = await handler(request);

    for (const count of [response.followerCount, response.followeeCount]) {
      expect(Number.isInteger(count)).toBe(true);
      expect(count).toBeGreaterThanOrEqual(1);
      expect(count).toBeLessThanOrEqual(10);
    }
  });

  it("rejects a request with a missing token as a bad request", async () => {
    await expect(handler({ ...request, token: "" })).rejects.toThrow(
      "[bad-request] Missing auth token"
    );
  });
});
