import { isFunction, batchSignals } from "@hella/core";
import { StoreBase, StoreSignals, StoreUpdateArgs } from "./types";

export function updateStore<T extends Record<string, any>>({
  signals,
  update,
}: StoreUpdateArgs<T>) {
  const updates = isFunction(update)
    ? update(Object.fromEntries(signals) as unknown as StoreSignals<T>)
    : update;

  batchSignals(() => {
    for (const [key, value] of Object.entries(updates)) {
      signals.get(key as keyof T)?.set(value);
    }
  });
}

export function destroyStore<T>(storeBase: StoreBase<T>): void {
  storeBase.isDisposed = true;
  storeBase.signals.forEach((signal) => signal.dispose?.());
  storeBase.effects.clear();
  storeBase.signals.clear();
  storeBase.methods.clear();
}
