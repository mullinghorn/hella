import { signal } from "@hellajs/core";
import { ResourceOptions } from "./types";

/**
 * Resource state initialization
 */
export function resourceState<T>() {
  return {
    data: signal<T | undefined>(undefined),
    loading: signal(false),
    error: signal<Error | undefined>(undefined),
  };
}

/**
 * Resource configuration with defaults
 */
export function resourceConfig<T>(options: ResourceOptions<T>) {
  return {
    cache: true,
    cacheTime: 300000,
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
    poolSize: 10,
    transform: (data: T) => data,
    validate: () => true,
    onError: () => undefined,
    ...options,
  };
}
