import { toError } from "@hella/global";
import { HELLA_RESOURCE } from "./global";
import { ResourceOptions } from "./types";

const { activeRequests } = HELLA_RESOURCE;

export function validatePoolSize(limit: number): void {
  if (activeRequests.size >= limit) {
    throw toError("Resource pool limit reached");
  }
}

export function validateResult<T>(
  result: T,
  config: Required<ResourceOptions<T>>
): T {
  if (result === null || result === undefined) {
    throw toError("Resource returned no data");
  }

  if (!config.validate(result)) {
    throw toError("Resource validation failed");
  }

  return result;
}
