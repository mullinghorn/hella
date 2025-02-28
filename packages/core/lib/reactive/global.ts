import { ctx } from "../context";
import { Context } from "../types";
import { ReactiveState } from "./types";

const HELLA_REACTIVE: ReactiveState = {
  activeEffects: [],
  pendingEffects: new Set(),
  disposedEffects: new WeakSet(),
  batchingSignals: false,
};

const context: Context<{
  HELLA_REACTIVE?: ReactiveState;
}> = ctx();

context.HELLA_REACTIVE ??= HELLA_REACTIVE;

export const reactiveContext = context.HELLA_REACTIVE;
