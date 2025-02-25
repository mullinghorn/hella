import { describe, expect, test, mock, beforeEach, afterEach } from "bun:test";
import {
  mockJsonResponse,
  resourceTestCleanup,
  resourceTestSetup,
  testUrl,
  testUser,
  User,
} from "./setup";
import { resource } from "../lib";
describe("resource fetching", () => {
  beforeEach(resourceTestSetup);
  afterEach(resourceTestCleanup);

  test("defaults", () => {
    const result = resource(testUrl);
    expect(result.data()).toBeUndefined();
    expect(result.loading()).toBe(false);
    expect(result.error()).toBeUndefined();
  });

  test("fetch", async () => {
    globalThis.fetch = mock(() => Promise.resolve(mockJsonResponse(testUser)));
    const result = resource<User>(testUrl);
    await result.fetch();
    expect(result.data()).toEqual(testUser);
  });
});
