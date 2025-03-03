import { toError } from "@hellajs/core";
import { ResourceOptions } from "./types";
import { resourceContext } from "./global";

export function validatePoolSize(limit: number): void {
  if (resourceContext.activeRequests.size >= limit) {
    throw toError("Resource pool limit reached");
  }
}

export function validateResult<T>(
  result: T,
  config: Required<ResourceOptions<T>>,
): T {
  if (result === null || result === undefined) {
    throw toError("Resource returned no data");
  }

  if (!config.validate(result)) {
    throw toError("Resource validation failed");
  }

  return result;
}
