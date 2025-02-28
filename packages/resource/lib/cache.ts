import { resourceContext } from "./global";
import { ResourceCacheArgs, ResourceUpdateCacheArgs } from "./types";

export function checkCache({
  key,
  maxAge,
}: ResourceCacheArgs): unknown {
  const cached = resourceContext.cache.get(key);
  if (!cached) return undefined;

  const isExpired = Date.now() - cached.timestamp > maxAge;
  if (isExpired) {
    resourceContext.cache.delete(key);
  }
  return isExpired ? undefined : cached.data;
}

export function updateCache({
  key,
  data,
  shouldCache,
}: ResourceUpdateCacheArgs): void {
  if (shouldCache) {
    resourceContext.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
}

export function destroyCache(key: string): void {
  resourceContext.cache.delete(key);
}
