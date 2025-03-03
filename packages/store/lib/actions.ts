import { isFunction, batchSignals } from "@hellajs/core";
import { StoreBase, StoreSignals, StoreUpdateArgs } from "./types";

export function updateStore<T extends Record<string, unknown>>({
  signals,
  update,
}: StoreUpdateArgs<T>) {
  const updates = isFunction(update)
    ? update(Object.fromEntries(signals) as unknown as StoreSignals<T>)
    : update;

  batchSignals(() => {
    for (const [key, value] of Object.entries(updates as {})) {
      signals.get(key as keyof T)?.set(value);
    }
  });
}

export function destroyStore<T>(storeBase: StoreBase<T>): void {
  storeBase.isDisposed = true;
  storeBase.signals.forEach((signal) => { signal.dispose(); });
  storeBase.effects.clear();
  storeBase.signals.clear();
  storeBase.methods.clear();
}
