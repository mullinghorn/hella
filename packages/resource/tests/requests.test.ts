import { describe, expect, test, mock, beforeEach, afterEach } from "bun:test";
import {
  mockJsonResponse,
  resourceTestCleanup,
  resourceTestSetup,
  testUrl,
  testUser,
  User,
} from "./setup";
import { resource, resourceContext, ResourceResult } from "../lib";

describe("resource requests", () => {
  beforeEach(resourceTestSetup);
  afterEach(resourceTestCleanup);

  test("abort", async () => {
    const abortError = new DOMException("Aborted", "AbortError");
    globalThis.fetch = mock(() => Promise.reject(abortError));

    const result = resource(testUrl);
    const fetchPromise = result.fetch();
    result.abort();
    await fetchPromise;

    expect(result.error()).toBeUndefined();
    expect(resourceContext.activeRequests.size).toBe(0);
  });

  test("refresh", async () => {
    const fetchMock = mock(() => Promise.resolve(mockJsonResponse(testUser)));
    globalThis.fetch = fetchMock;

    const result = resource<User>(testUrl);
    await result.fetch();
    await result.refresh();

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test("pooling", async () => {
    globalThis.fetch = mock(() => Promise.resolve(mockJsonResponse(testUser)));

    const results: ResourceResult<User>[] = [];
    const poolSize = 2;

    for (let i = 0; i < poolSize + 1; i++) {
      results.push(resource<User>(`${testUrl}/${i}`, { poolSize }));
    }

    expect(Promise.all(results.map((r) => r.fetch()))).rejects.toThrow();
  });
});
