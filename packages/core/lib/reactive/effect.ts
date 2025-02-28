import { EffectOptions, EffectState } from "./types";
import { trackEffect } from "./security";
import { reactiveContext } from "./global";

/**
 * Reactive effect that tracks signal dependencies
 */
export function effect(
  fn: () => void,
  { immediate = false }: EffectOptions = {},
): () => void {
  const state: EffectState = { active: true, fn, deps: new Set() };
  const runner = effectRunner(state);

  immediate ? runner() : queueMicrotask(runner);

  return () => {
    if (!state.active) return;
    state.active = false;

    reactiveContext.disposedEffects.add(runner);

    state.cleanup?.();
    state.deps.clear();

    const index = reactiveContext.activeEffects.indexOf(fn);
    index !== -1 && reactiveContext.activeEffects.splice(index, 1);
  };
}

/**
 * Core effect tracking implementation
 */
function effectRunner(state: EffectState) {
  return function run() {
    if (!state.active || reactiveContext.disposedEffects.has(run)) return;

    state.deps.clear();

    reactiveContext.activeEffects.push(run);

    try {
      const result = state.fn();
      if (typeof result === "function") {
        state.cleanup = result;
        (result as Function)();
      }
    } finally {
      reactiveContext.activeEffects.pop();
      trackEffect(run, state.deps);
    }
  };
}
