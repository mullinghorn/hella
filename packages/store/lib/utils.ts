import { toError } from "@hella/core";
import { StoreWithFnArgs } from "./types";

export function storeWithFn<T>({
  storeBase,
  fn,
}: StoreWithFnArgs<T>): unknown {
  storeBase.isInternal = true;
  const result = fn();
  storeBase.isInternal = false;
  return result;
}

export function undefinedStoreProp(prop: string | symbol) {
  throw toError(`Accessing undefined store property: ${String(prop)}`);
}

export function readonlyStoreProp(prop: string | symbol | number) {
  throw toError(`Cannot modify readonly store property: ${String(prop)}`);
}
