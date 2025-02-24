import { EffectOptions, EffectState, ReactiveState } from "./types";
import { trackEffect } from "./security";
import { ctx } from "@hella/global";

const context = ctx() as { HELLA_REACTIVE: ReactiveState };

/**
 * Reactive effect that tracks signal dependencies
 */
export function effect(
  fn: () => void,
  { immediate = false }: EffectOptions = {}
): () => void {
  const state: EffectState = { active: true, fn, deps: new Set() };
  const runner = effectRunner(state);

  immediate ? runner() : queueMicrotask(runner);

  return () => {
    if (!state.active) return;
    state.active = false;

    context.HELLA_REACTIVE.disposedEffects.add(runner);

    state.cleanup?.();
    state.deps.clear();

    const index = context.HELLA_REACTIVE.activeEffects.indexOf(fn);
    index !== -1 && context.HELLA_REACTIVE.activeEffects.splice(index, 1);
  };
}

/**
 * Core effect tracking implementation
 */
function effectRunner(state: EffectState) {
  return function run() {
    if (!state.active || context.HELLA_REACTIVE.disposedEffects.has(run))
      return;

    state.deps.clear();

    context.HELLA_REACTIVE.activeEffects.push(run);

    try {
      const result = state.fn();
      if (typeof result === "function") {
        state.cleanup = result;
        (result as Function)();
      }
    } finally {
      context.HELLA_REACTIVE.activeEffects.pop();
      trackEffect(run, state.deps);
    }
  };
}
