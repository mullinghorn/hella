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

describe("resource caching", () => {
  beforeEach(resourceTestSetup);
  afterEach(resourceTestCleanup);

  test("enabled", async () => {
    const fetchMock = mock(() => Promise.resolve(mockJsonResponse(testUser)));
    globalThis.fetch = fetchMock;

    const result = resource<User>(testUrl);
    await result.fetch();
    await result.fetch();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("disabled", async () => {
    globalThis.fetch = mock(() => Promise.resolve(mockJsonResponse(testUser)));
    const result = resource<User>(testUrl, { cacheTime: 0 });

    await result.fetch();
    await result.fetch();

    expect(result.data()).toEqual(testUser);
  });
});
