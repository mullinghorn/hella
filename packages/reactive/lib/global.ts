import { ReactiveState } from "./types";

export const HELLA_REACTIVE: ReactiveState = {
  activeEffects: [],
  pendingEffects: new Set(),
  disposedEffects: new WeakSet(),
};
