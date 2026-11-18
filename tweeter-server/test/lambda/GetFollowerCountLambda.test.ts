// AI-assisted: see AI-ATTRIBUTION.md

import { describe, expect, it } from "@jest/globals";
import { handler } from "../../src/lambda/follow/GetFollowerCountLambda";
import { TweeterRequest } from "tweeter-shared";

describe("GetFollowerCountLambda", () => {
  const request: TweeterRequest = {
    token: "fake-token",
    userAlias: "@allen",
  };

  it("returns a successful response", async () => {
    const response = await handler(request);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
  });

  it("returns an integer count in FakeData's range (1 to 10)", async () => {
    const response = await handler(request);

    expect(Number.isInteger(response.count)).toBe(true);
    expect(response.count).toBeGreaterThanOrEqual(1);
    expect(response.count).toBeLessThanOrEqual(10);
  });

  it("rejects a request with a missing token as a bad request", async () => {
    await expect(handler({ ...request, token: "" })).rejects.toThrow(
      "[bad-request] Missing auth token"
    );
  });
});
