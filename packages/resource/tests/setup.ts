import { resourceContext } from "../lib";

export interface User {
  id: number;
  name: string;
}

export const testUser: User = { id: 1, name: "Test User" };
export const testUrl = "https://api.example.com/users/1";

const originalFetch = globalThis.fetch;

export function resourceTestSetup() {
  resourceContext.cache.clear();
  resourceContext.activeRequests.clear();
}

export function resourceTestCleanup() {
  globalThis.fetch = originalFetch;
}

export function mockJsonResponse(data: unknown) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
