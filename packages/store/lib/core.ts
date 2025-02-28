import {
  StoreFactory,
  StoreSignals,
  StoreBase,
  StoreEffectFn,
  StoreOptions,
  StoreComputed,
} from "./types";
import { isFunction, toError, effect, computed, Signal, UnknownFn } from "@hella/core";
import { storeProxy, storeSignal } from "./proxy";
import { destroyStore, updateStore } from "./actions";
import { storeWithFn } from "./utils";
import { storeContext } from "./global";

export function store<T extends Record<string, unknown>>(
  factory: StoreFactory<T>,
  options: StoreOptions = {},
): StoreSignals<T> {
  const storeBase: StoreBase<T> = {
    signals: new Map(),
    methods: new Map(),
    effects: new Set(),
    isDisposed: false,
    isInternal: true,
  };

  const storeEffect: StoreEffectFn = (fn) => {
    const cleanup = effect(fn);
    storeBase.effects.add(cleanup);
    return cleanup;
  };

  const proxyStore = storeProxy(storeBase);
  storeBase.methods.set("effect", storeEffect as UnknownFn);

  const storeEntries = Object.entries(
    isFunction(factory) ? factory(proxyStore) : factory,
  );
  storeBase.isInternal = false;

  for (const [key, value] of storeEntries) {
    if (isFunction(value)) {
      const methodWrapper = (...args: unknown[]) => {
        const result = storeWithFn({
          storeBase,
          fn: () => value(...args)
        });
        return result;
      };
      storeBase.methods.set(key, methodWrapper);
    } else {
      storeBase.signals.set(
        key,
        storeSignal({
          key,
          value,
          storeBase,
          storeProxy,
          options,
        }),
      );
    }
  }

  const storeInstance = storeResult(storeBase, options);
  storeContext.stores.set(storeInstance, {
    store: new Set(),
    effects: storeBase.effects,
  });
  return storeInstance;
}

function storeResult<T>(
  storeBase: StoreBase<T>,
  options: StoreOptions = {},
): StoreSignals<T> {
  const methods = Object.fromEntries(storeBase.methods);
  const signals = Object.fromEntries(storeBase.signals);

  const getComputedState = () => {
    const state: Partial<StoreComputed<T>> = {};
    for (const [key, signal] of storeBase.signals.entries()) {
      state[key] = signal() as StoreComputed<T>[keyof T];
    }
    for (const [key, method] of storeBase.methods.entries()) {
      if (key !== "effect") {
        state[key] = method() as StoreComputed<T>[keyof T];
      }
    }
    return state as StoreComputed<T>;
  };

  return {
    ...methods,
    ...signals,
    set: (update) => {
      if (storeBase.isDisposed) {
        throw toError("Attempting to update a disposed store");
      }
      const updates = isFunction(update)
        ? update(Object.fromEntries(storeBase.signals) as StoreSignals<T>)
        : update;
      const hasReadonlyViolation = Object.keys(updates).some((key) =>
        Array.isArray(options.readonly)
          ? options.readonly.includes(key)
          : options.readonly,
      );
      if (hasReadonlyViolation) {
        throw toError("Cannot modify readonly store properties");
      }
      updateStore({
        signals: storeBase.signals as Map<string, Signal<unknown>>,
        update: updates,
      });
    },
    cleanup: () => {
      destroyStore(storeBase);
    },
    computed: () => computed(getComputedState)(),
  } as StoreSignals<T>;
}
