import { signal, Signal } from "@hella/core";
import { StoreBase, StoreSignals, StoreValidatedArgs } from "./types";
import { undefinedStoreProp, readonlyStoreProp } from "./utils";
import { storeContext } from "./global";
export function storeSignal<T, V>({
  key,
  value,
  storeBase,
  storeProxy,
  options = {},
}: StoreValidatedArgs<T, V>): Signal<V> {
  const sig = signal(value);
  const storeData = storeContext.stores.get(storeProxy);
  const isReadonlyKey = Array.isArray(options.readonly)
    ? options.readonly.includes(key as string)
    : options.readonly;

  return new Proxy(sig, {
    get: (target, prop) =>
      prop !== "set"
        ? target[prop as keyof Signal<V>]
        : (...args: [V]) => {
          if (storeBase.isDisposed) {
            console.warn(
              `Attempting to update a disposed store signal: ${String(key)}`,
            );

            return
          }
          const isReadonlyExternal = isReadonlyKey && !storeBase.isInternal;
          if (isReadonlyExternal) {
            readonlyStoreProp(key);
          }
          target.set(args[0]);
          storeData?.store.forEach((cb) => { cb(key, args[0]) });
        },
  });
}

export function storeProxy<T>(storeBase: StoreBase<T>): StoreSignals<T> {
  return new Proxy({} as StoreSignals<T>, {
    get: (_target, prop: string | symbol) => {
      const key = prop as keyof T;
      let result;

      if (key === "effect") {
        result = storeBase.methods.get("effect" as keyof T);
      } else {
        result = storeBase.signals.get(key) ?? storeBase.methods.get(key);
        if (result === undefined) {
          undefinedStoreProp(prop);
          return;
        }
      }

      return result;
    },
  });
}
