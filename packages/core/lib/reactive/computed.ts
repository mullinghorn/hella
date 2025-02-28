import { ComputedConfig, ComputedState, Signal } from "./types";
import { effect } from "./effect";
import { signal } from "./signal";

/**
 * Reactive computed signal with dependency tracking
 */
export function computed<T>(
  fn: () => T,
  config?: ComputedConfig<T>,
): Signal<T> {
  const state = { initialized: false, fn, config };
  return computedProxy(state);
}

/**
 * Signal initialization with lazy evaluation
 */
function computedProxy<T>(state: ComputedState<T>): Signal<T> {
  const handler: ProxyHandler<Signal<T>> = {
    get(_, prop: string | symbol) {
      const isInit = !state.initialized;
      if (isInit) {
        state.computed = computedCore(state);
        state.initialized = true;
      }
      return state.computed![prop as keyof Signal<T>];
    },
    apply() {
      const isInit = !state.initialized;
      if (isInit) {
        state.computed = computedCore(state);
        state.initialized = true;
      }
      return state.computed!();
    },
  };

  return new Proxy(() => {}, handler) as Signal<T>;
}

/**
 * Core computed implementation with caching
 */
function computedCore<T>({ fn, config }: ComputedState<T>): Signal<T> {
  config?.onCreate?.();
  let currentValue = fn();
  const cache = signal(currentValue);

  effect(
    () => {
      const result = fn();
      if (result !== currentValue) {
        currentValue = result;
        cache.set(result);
        config?.onCompute?.(result);
      }
    },
    { immediate: true },
  );

  return cache;
}
