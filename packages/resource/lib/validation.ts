import { ctx, toError } from "@hella/core";
import { ResourceHella, ResourceOptions } from "./types";

const context = ctx() as { HELLA_RESOURCE: ResourceHella };

export function validatePoolSize(limit: number): void {
  if (context.HELLA_RESOURCE.activeRequests.size >= limit) {
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
