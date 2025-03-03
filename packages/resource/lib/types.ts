import { GenericPromise } from "@hellajs/core";
import { Signal } from "@hellajs/core";

export interface ResourceHella {
  cache: Map<string, ResourceCache>;
  activeRequests: Map<string, AbortController>;
}

export interface ResourceOptions<T> {
  transform?: (data: T) => T;
  onError?: (response: Response) => void;
  cache?: boolean;
  cacheTime?: number;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  validate?: (data: T) => boolean;
  poolSize?: number;
}

export interface ResourceResult<T> {
  data: Signal<T | undefined>;
  loading: Signal<boolean>;
  error: Signal<Error | undefined>;
  fetch: () => Promise<void>;
  abort: () => void;
  refresh: () => Promise<void>;
  invalidate: () => void;
}

export interface ResourceCache {
  data: unknown;
  timestamp: number;
  promise?: Promise<unknown>;
}

export interface ResourceRequestArgs<T> {
  input: string | GenericPromise<T>;
  options: Required<ResourceOptions<T>>;
  signal: AbortSignal;
}

export interface ResourceJSONArgs {
  url: string;
  onError?: (response: Response) => void;
  signal?: AbortSignal;
}

export interface ResourceCacheArgs {
  key: string;
  maxAge: number;
}

export interface ResourceUpdateCacheArgs {
  key: string;
  data: unknown;
  shouldCache: boolean;
}
