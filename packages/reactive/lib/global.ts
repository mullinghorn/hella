import { ctx } from "@hella/global";
import { ReactiveState } from "./types";

const HELLA_REACTIVE: ReactiveState = {
  activeEffects: [],
  pendingEffects: new Set(),
  disposedEffects: new WeakSet(),
  batchingSignals: false,
};

ctx().HELLA_REACTIVE ||= HELLA_REACTIVE;
