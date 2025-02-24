import { ctx } from "@hella/global";
import {
  ResourceCacheArgs,
  ResourceHella,
  ResourceUpdateCacheArgs,
} from "./types";

const context = ctx() as { HELLA_RESOURCE: ResourceHella };

export function checkCache<T>({
  key,
  maxAge,
}: ResourceCacheArgs): T | undefined {
  const cached = context.HELLA_RESOURCE.cache.get(key);
  if (!cached) return undefined;

  const isExpired = Date.now() - cached.timestamp > maxAge;
  isExpired && context.HELLA_RESOURCE.cache.delete(key);
  return isExpired ? undefined : cached.data;
}

export function updateCache({
  key,
  data,
  shouldCache,
}: ResourceUpdateCacheArgs): void {
  shouldCache &&
    context.HELLA_RESOURCE.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
}

export function destroyCache(key: string): void {
  context.HELLA_RESOURCE.cache.delete(key);
}
