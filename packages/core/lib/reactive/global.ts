import { ctx } from "../context";
import { ReactiveState } from "./types";

const HELLA_REACTIVE: ReactiveState = {
  activeEffects: [],
  pendingEffects: new Set(),
  disposedEffects: new WeakSet(),
  batchingSignals: false,
};

const context = ctx();

context.HELLA_REACTIVE ||= HELLA_REACTIVE;

export const reactiveContext = context.HELLA_REACTIVE as ReactiveState;
