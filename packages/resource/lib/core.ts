import {
  ctx,
  GenericPromise,
  isAbortError,
  isString,
  toError,
} from "@hella/global";
import { resourceConfig, resourceState } from "./utils";
import { executeRequest } from "./actions";
import { checkCache, destroyCache, updateCache } from "./cache";
import { ResourceHella, ResourceOptions, ResourceResult } from "./types";
import { validatePoolSize, validateResult } from "./validation";

const context = ctx() as { HELLA_RESOURCE: ResourceHella };

/**
 * Core resource primitive with caching and retry logic
 */
export function resource<T>(
  input: string | GenericPromise<T>,
  options: ResourceOptions<T> = {}
): ResourceResult<T> {
  const state = resourceState<T>();
  const config = resourceConfig(options);
  const key = isString(input) ? input : input.toString();
  const controller = new AbortController();

  async function fetch(): Promise<void> {
    const cached = checkCache<T>({ key, maxAge: config.cacheTime });
    if (cached) {
      state.data.set(cached);
      return;
    }

    validatePoolSize(config.poolSize);

    state.loading.set(true);
    state.error.set(undefined);
    context.HELLA_RESOURCE.activeRequests.set(key, controller);

    try {
      const result = await executeRequest({
        input,
        options: config,
        signal: controller.signal,
      });
      const validated = validateResult(result, config);
      const transformed = config.transform(validated);

      updateCache({ key, data: transformed, shouldCache: config.cache });
      state.data.set(transformed);
    } catch (e) {
      if (isAbortError(e)) return;
      state.error.set(toError(e));
    } finally {
      state.loading.set(false);
      context.HELLA_RESOURCE.activeRequests.delete(key);
    }
  }

  return {
    ...state,
    fetch,
    abort: () => controller.abort(),
    refresh: () => {
      destroyCache(key);
      return fetch();
    },
    invalidate: () => destroyCache(key),
  };
}
